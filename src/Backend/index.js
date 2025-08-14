import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import axios from "axios";
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const { Pool } = pkg;

const JWT_SECRET = 'A123HxyZjrwjoQopbnkjjw12498BSHIDJ';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(cors({
  origin: "*", // or ["http://localhost:5173", "https://your-frontend-domain.com"]
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());


const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT || 6543,
  ssl: { rejectUnauthorized: false }
});


app.get('/api/products', async (req, res) => {
  try {
    const { seller_id } = req.query; 
    let result;

    if (seller_id) {
    
      result = await pool.query('SELECT * FROM products WHERE seller_id = $1', [seller_id]);
    } else {
  
      result = await pool.query('SELECT * FROM products');
    }

   
    const products = result.rows.map(product => ({
      ...product,
      about: product.about ? JSON.parse(product.about) : []
    }));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by id
app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const product = result.rows[0];
    product.about = product.about ? JSON.parse(product.about) : [];
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );
    res.json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === '23505') { 
      return res.status(400).json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Add to Cart Endpoint
app.post('/api/cart', authenticate, async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;
  try {

    await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity`,
      [user_id, product_id, quantity || 1]
    );
    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Cart Endpoint
app.get('/api/cart', authenticate, async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `SELECT cart.id, cart.quantity, cart.product_id, products.name, products.price, products.img
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = $1`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from Cart Endpoint
app.delete('/api/cart/:id', authenticate, async (req, res) => {
  const user_id = req.user.id;
  const cart_id = req.params.id;
  try {
    await pool.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2',
      [cart_id, user_id]
    );
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Decrease quantity or remove from cart
app.put('/api/cart', authenticate, async (req, res) => {
  const { product_id, quantity } = req.body; 
  const user_id = req.user.id;
  try {
    // Get current quantity
    const result = await pool.query(
      'SELECT quantity FROM cart WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Item not found in cart" });

    const currentQty = result.rows[0].quantity;
    if (currentQty + quantity <= 0) {
      // Remove item
      await pool.query(
        'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
        [user_id, product_id]
      );
    } else {
      // Update quantity
      await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
        [quantity, user_id, product_id]
      );
    }
    res.json({ message: "Cart updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/create-order', authenticate, async (req, res) => {
  const { amount } = req.body; 
  try {
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seller/add-product', authenticate, async (req, res) => {
  const {
    name,
    price,
    category,
    description,
    about,        
    car_models,    
    img,           
    seller_id
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO products (name, price, category, description, about, car_models, img, seller_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        name,
        price,
        category,
        description,
        about,      
        car_models, 
        img,       
        seller_id
      ]
    );
    res.json({ message: "Product added successfully!" });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Failed to add product." });
  }
});

app.post('/api/seller/register', async (req, res) => {
  const {
    seller_id, shop_name, email, phone_number, gst_number, address, city, pincode
  } = req.body;
  try {
    await pool.query(
      `INSERT INTO seller (seller_id, shop_name, email, phone_number, gst_number, address, city, pincode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [seller_id, shop_name, email, phone_number, gst_number, address, city, pincode]
    );
    res.json({ message: "Seller registered successfully!", seller_id });
  } catch (err) {
    console.error("Seller registration error:", err);
    res.status(500).json({ error: "Failed to register seller." });
  }
});

app.post('/api/seller/verify', async (req, res) => {
  const { phone_number } = req.body; 

  if (!phone_number) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  try {
  
    const result = await pool.query(
      "SELECT * FROM seller WHERE REPLACE(phone_number, ' ', '') = $1", 
      [phone_number]
    );

    if (result.rows.length > 0) {
    
      res.json({ isSeller: true, seller: result.rows[0] });
    } else {
      
      res.status(404).json({ isSeller: false, error: 'Seller not found.' });
    }
  } catch (err) {
    console.error("Seller verification error:", err);
    res.status(500).json({ error: 'Server error during seller verification.' });
  }
});


app.delete('/api/seller/delete-product/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  const { imgUrl } = req.query; 
  
  try {
 
    if (imgUrl && typeof imgUrl === 'string') {
      const match = imgUrl.match(/product-images\/(.+)$/);
      const filePath = match ? match[1] : null;
      if (filePath) {
        console.log(`Pretending to delete image at path: ${filePath}`);
      }
    }
    
    // Delete product from the database
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: "Product deleted successfully!" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product." });
  }
});

app.put('/api/seller/update-product/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, about, car_models, img } = req.body;
  try {
    await pool.query(
      `UPDATE products SET name=$1, price=$2, category=$3, description=$4, about=$5, car_models=$6, img=$7 WHERE id=$8`,
      [name, price, category, description, about, car_models, img, id]
    );
    res.json({ message: "Product updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product." });
  }
});

app.put('/api/seller/update-stock/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { in_stock } = req.body;
  try {
    await pool.query(
      `UPDATE products SET in_stock=$1 WHERE id=$2`,
      [in_stock, id]
    );
    res.json({ message: "Stock status updated!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update stock status." });
  }
});

app.post('/api/modbot', async (req, res) => {
  const { message, history } = req.body;


  const result = await pool.query('SELECT * FROM products');
  const products = result.rows;

  const productList = products.map(
    p => `${p.name} (₹${p.price}) - [View Product](http://localhost:5173/product/${p.id})`
  ).join('\n');

  const chatHistory = (history || [])
    .map(msg => `${msg.from === "user" ? "User" : "ModBot"}: ${msg.text}`)
    .join('\n');

  const isGeneralQuestion = !/(spoiler|exhaust|alloy|headlight|filter|kit|wheel|tyre|seat|audio|stereo|light|bumper|hood|intake|ecu|tune|turbo|supercharger|suspension|brake|mat|cover|amplifier|armrest|beadlock wheels|brake calipers|brake lines|brake pads|brake rotors|camshaft|cat-back exhaust|cold air intake|coilovers|control arms|crankshaft|dashboard trim|decal|diffuser|digital dash|downpipe|drls|equalizer|exhaust manifold|fender flares|floor mats|fog lights|forged wheels|fuel injectors|gauge cluster|gps navigation system|grille|harnesses|lip spoiler|lowering springs|low-profile tires|mud flaps|nitrous kit|off-road tires|oil cooler|parking sensors|pedal covers|pistons|racing seats|roof scoop|roll cage|shift knob|side skirts|spoiler extensions|steering wheel|strut bar|subwoofer|sway bar|taillights|underbody neon lights|vinyl wrap|wheel spacers|wrap)/i.test(message);

const prompt = isGeneralQuestion
  ? `
You are ModBot, a car modification expert for RevCraft.

Instructions:
- ALWAYS format your entire answer using valid Markdown.
- For every list, use Markdown numbered or bulleted lists.
- For every main point, use bold (**text**).
- For sub-points, use indented lists.
- For important terms, use italics (*text*).
- If you give a step-by-step or options, use Markdown lists.
- Do NOT say "Sorry, we don't have that part..." for general advice.
- Only recommend products if the user asks for a specific part or mod.
- Do NOT output plain text. Always use Markdown formatting for all lists and important points.

Chat history:
${chatHistory}

User: ${message}
ModBot:
`
  : `
You are ModBot, a car modification expert for RevCraft.

Instructions:
- If the user asks for a specific part or mod, check the product list below. ONLY recommend products from this list (with their name, price, and a clickable Markdown link).
- If the product is not in the list, reply: "Sorry, we don't have that part for your car right now, but we'll add it soon!"
- Never mention or suggest any other website or external link.
- Always be concise, professional, and human-like.
- When you mention a product, use a clickable Markdown link: [View Product](URL).
- ALWAYS format your entire answer using valid Markdown. Use numbered or bulleted lists, bold for important points, and italics for emphasis when appropriate.
- Do NOT output plain text. Always use Markdown formatting for all lists and important points.

Product list:
${productList}

Chat history:
${chatHistory}

User: ${message}
ModBot:
`;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const resultAI = await model.generateContent(prompt);
    const replyText = resultAI.response.text();

    // Find mentioned products in the AI's reply
    const mentionedProducts = products.filter(p =>
      replyText.toLowerCase().includes(p.name.toLowerCase())
    ).map(p => ({
      name: p.name,
      price: `₹${p.price}`,
      description: p.description,
      url: `http://localhost:5173/product/${p.id}`
    }));

    res.json({
      reply: {
        text: replyText,
        products: mentionedProducts
      }
    });
  } catch (err) {
    res.status(500).json({
      reply: {
        text: "❌ Sorry, ModBot is offline or busy.",
        products: []
      }
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));