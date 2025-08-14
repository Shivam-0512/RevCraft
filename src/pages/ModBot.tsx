import React, { useEffect, useState, useRef } from 'react';
import { SendIcon, PaperclipIcon, SmileIcon, XIcon, ArrowLeftIcon, MessageCircleIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ModBot = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [showChat, setShowChat] = useState(false); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("modbot_chat_history");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("modbot_chat_history", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: input,
      timestamp: new Date()
    };
    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, { id: messages.length + 2, sender: 'bot', message: '', timestamp: new Date(), products: [] }]);
    setInput('');

    try {
      const res = await axios.post("https://backend-vale.onrender.com/api/modbot", {
        message: input,
        history: newMessages.map(m => ({ from: m.sender, text: m.message }))
      });

      const botReply = res.data.reply;
      setMessages((msgs) => {
        const updated = [...msgs];
        updated[updated.length - 1] = {
          id: messages.length + 2,
          sender: 'bot',
          message: typeof botReply === "string" ? botReply : (botReply.text || ""),
          timestamp: new Date(),
          products: botReply.products || []
        };
        return updated;
      });

    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { id: messages.length + 2, sender: 'bot', message: "❌ Sorry, something went wrong.", timestamp: new Date(), products: [] }
      ]);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full bg-zinc-900 min-h-screen">
      {showChat ? (
        <div className="fixed inset-0 bg-zinc-900 z-50 flex flex-col md:pt-16">
          {/* Chat Header */}
          <div className="bg-zinc-800 border-b border-zinc-700 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => setShowChat(false)} className="md:hidden mr-2 p-2 rounded-full hover:bg-zinc-700">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <MessageCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">ModBot</h3>
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="hidden md:block p-2 rounded-full hover:bg-zinc-700">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-zinc-800 border border-zinc-700 rounded-bl-none'}`}>
                    <div className="text-sm prose-invert">
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3">
                        {msg.products.map((p: any, i: number) => (
                          <ProductCard
                            key={i}
                            id={p.id}
                            name={p.name}
                            price={p.price}
                            image={p.image}
                            category={p.category}
                            rating={p.rating}
                            inChat={true}
                          />
                        ))}
                      </div>
                    )}
                    <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Chat Input */}
          <div className="bg-zinc-800 border-t border-zinc-700 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center bg-zinc-700 rounded-lg px-4 py-2">
                <button className="text-gray-400 hover:text-gray-300 p-1">
                  <PaperclipIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask ModBot about car modifications..."
                  className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 mx-2"
                />
                <button className="text-gray-400 hover:text-gray-300 p-1">
                  <SmileIcon className="h-5 w-5" />
                </button>
                <button onClick={handleSendMessage} className="ml-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors">
                  <SendIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="text-xs text-center text-gray-400 mt-2">
                ModBot can provide modification advice, compatibility
                information, and product recommendations.
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Info/Landing Page
        <div className="container mx-auto px-4 pt-28 pb-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">ModBot AI Assistant</h1>
            <p className="text-gray-300 mb-8">
              Get expert advice on car modifications, compatibility information,
              and personalized recommendations from our AI-powered assistant.
            </p>
            <div className="bg-zinc-800 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                How ModBot Can Help You
              </h2>
              <ul className="space-y-3">
                {[
                  'Get personalized modification recommendations based on your vehicle',
                  'Check compatibility between parts and your specific car model',
                  'Receive installation guidance and technical advice',
                  'Find the best performance upgrades within your budget',
                  'Troubleshoot issues with existing modifications',
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center mr-3 mt-0.5">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-orange-500 mb-2">
                    What modifications will give me the best horsepower gains?
                  </h3>
                  <p className="text-gray-300">
                    The most effective modifications for horsepower gains
                    typically include cold air intakes, performance exhaust
                    systems, ECU tuning, and forced induction (turbochargers or
                    superchargers). The best choice depends on your specific
                    vehicle and budget.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-orange-500 mb-2">
                    Will installing aftermarket parts void my warranty?
                  </h3>
                  <p className="text-gray-300">
                    In many cases, aftermarket modifications can affect your
                    vehicle's warranty, but only for components directly related
                    to the modification. This is covered under the Magnuson-Moss
                    Warranty Act. Ask ModBot about specific modifications and
                    their warranty implications.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-orange-500 mb-2">
                    What's the best modification for better fuel efficiency?
                  </h3>
                  <p className="text-gray-300">
                    For improved fuel efficiency, consider a quality ECU tune,
                    lightweight wheels, low rolling resistance tires, and ensuring
                    proper maintenance. Some intake and exhaust modifications can
                    also help with fuel economy when driven conservatively.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(true)}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <MessageCircleIcon className="h-5 w-5 mr-2" /> Chat with ModBot
                Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModBot;