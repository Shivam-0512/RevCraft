import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneIcon } from 'lucide-react';
import { auth } from '../firebaseConfig.ts';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { toast } from 'sonner';
import axios from 'axios';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {},
      'expired-callback': () => {
        toast.error("reCAPTCHA expired. Please try again.");
      }
    });
    setRecaptchaVerifier(verifier);
  }, [auth]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !recaptchaVerifier) {
      toast.error("Phone number or reCAPTCHA not ready.");
      return;
    }
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (err: any) {
      toast.error('Failed to send OTP. Please check the phone number and try again.');
      console.error("Firebase Error:", err);
    }
  };


 const handleVerifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!otp || !confirmationResult) return;
  try {
    const userCredential = await confirmationResult.confirm(otp);
    const user = userCredential.user;

    if (user) {

      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      
   
      const response = await axios.post('https://backend-vale.onrender.com/api/seller/verify', {
        phone_number: user.phoneNumber
      });
      if (response.data.isSeller) {
        localStorage.setItem("seller_id", response.data.seller.seller_id);
        toast.success('Logged in successfully!');
        navigate('/sellerdashboard');
      } else {
        toast.error("This phone number is not registered as a seller.");
      }
    }
  } catch (err) {
    toast.error('Invalid OTP or failed to verify seller status.');
  }
};

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="relative z-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Login to your seller account
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-zinc-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={step === 'phone' ? handleSendOtp : handleVerifyOtp}>
                        {step === 'phone' ? (
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                    Phone Number
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3"
                                        placeholder="+91 98765 43210"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition"
                                >
                                    Send OTP
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition"
                                >
                                    Login
                                </button>
                            </div>
                        )}
                        <div id="recaptcha-container"></div>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-zinc-800 text-gray-400">Or</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link
                                to="/sellerregister"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition"
                            >
                                Register as a new seller
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;
