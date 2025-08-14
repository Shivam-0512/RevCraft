import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from 'lucide-react';
import { auth } from '../firebaseConfig.ts';
import axios from 'axios';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  updateProfile,
  linkWithCredential,
  PhoneAuthProvider,
  ConfirmationResult
} from "firebase/auth";
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpInputVisible, setIsOtpInputVisible] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    gstNumber: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    address: '',
    city: '',
    pincode: ''
  });

  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        toast.info("reCAPTCHA ready.");
      }
    });
    setRecaptchaVerifier(verifier);
  }, [auth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.phoneNumber) {
      toast.error("Please enter a phone number.");
      return;
    }
    if (!recaptchaVerifier) {
      toast.error("reCAPTCHA not ready. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const confirmation = await signInWithPhoneNumber(auth, formData.phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setIsOtpInputVisible(true);
      toast.success('OTP sent to your phone!');
    } catch (err) {
      toast.error('Failed to send OTP. Please check the phone number.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!otp || !confirmationResult) {
      toast.error("Please enter the OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
  
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const phoneCredential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
      await linkWithCredential(user, phoneCredential);
      await updateProfile(user, { displayName: formData.shopName });

      // Register the seller in your backend
      await axios.post("https://backend-vale.onrender.com/api/seller/register", {
        seller_id: user.uid, 
        shop_name: formData.shopName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        gst_number: formData.gstNumber,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      });

      // The AuthContext handles session, so no localStorage is needed here.
      toast.success('Registration successful!');
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("seller_id", user.uid);
      setStep(4);
      setTimeout(() => navigate('/sellerdashboard'), 3000);

    } catch (err: any) {
      if (err.code === 'auth/invalid-verification-code') {
        toast.error('Invalid OTP. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        toast.error('This email address is already registered.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
      console.error("Registration Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      if (step === 2) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          return;
        }
      }
      setStep(step + 1);
    } else if (step === 3) {
      if (!isOtpInputVisible) {
        handleSendOtp();
      } else {
        handleFinalSubmit();
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* UI and JSX remains the same */}
      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your seller account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-zinc-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center">
                {[1, 2, 3, 4].map((i, index, arr) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= i ? 'bg-orange-600' : 'bg-zinc-600'}`}>
                        {step > i ? <CheckCircleIcon className="w-5 h-5 text-white" /> : <span className="text-white font-bold">{i}</span>}
                      </div>
                      <span className={`text-xs mt-1 transition-colors duration-300 ${step >= i ? 'text-white' : 'text-gray-400'}`}>
                        {i === 1 && 'Basic Info'}
                        {i === 2 && 'Password'}
                        {i === 3 && 'Business'}
                        {i === 4 && 'Complete'}
                      </span>
                    </div>
                    {index < arr.length - 1 && <div className="flex-1 h-1 mx-2 bg-zinc-600"><div className="h-1 bg-orange-600 transition-all duration-500" style={{ width: step > i ? '100%' : '0%' }}></div></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <input name="email" type="email" placeholder="Email Address" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.email} onChange={handleChange} />
                  <input name="phoneNumber" type="tel" placeholder="Phone Number (+91...)" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.phoneNumber} onChange={handleChange} />
                  <input name="gstNumber" type="text" placeholder="GST Number" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.gstNumber} onChange={handleChange} />
                  <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Continue</button>
                </>
              )}
              {step === 2 && (
                <>
                  <input id="password" name="password" type="password" placeholder="Create Password" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.password} onChange={handleChange} />
                  <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.confirmPassword} onChange={handleChange} />
                </>
              )}
              {step === 3 && (
                <>
                  <input id="shopName" name="shopName" type="text" placeholder="Shop Name" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.shopName} onChange={handleChange} disabled={isOtpInputVisible} />
                  <input id="address" name="address" type="text" placeholder="Address" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.address} onChange={handleChange} disabled={isOtpInputVisible} />
                  <div className="grid grid-cols-2 gap-4">
                    <input id="city" name="city" type="text" placeholder="City" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.city} onChange={handleChange} disabled={isOtpInputVisible} />
                    <input id="pincode" name="pincode" type="text" placeholder="Pincode" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={formData.pincode} onChange={handleChange} disabled={isOtpInputVisible} />
                  </div>
                  {isOtpInputVisible && (
                    <input id="otp" name="otp" type="text" placeholder="Enter OTP from your phone" required className="bg-zinc-700 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-zinc-600 rounded-md text-white py-2 px-3" value={otp} onChange={e => setOtp(e.target.value)} />
                  )}
                </>
              )}
              {step === 4 && (
                <div className="text-center py-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"><CheckCircleIcon className="h-6 w-6 text-green-600" /></div>
                  <h3 className="mt-2 text-lg font-medium text-white">Registration Successful!</h3>
                  <p className="mt-1 text-sm text-gray-300">Redirecting you to the dashboard...</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {step > 1 && step < 4 && (
                  <button type="button" onClick={() => step === 3 && isOtpInputVisible ? setIsOtpInputVisible(false) : setStep(step - 1)} className="py-2 px-4 border border-zinc-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Back</button>
                )}
                {step === 2 && (
                  <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Continue</button>
                )}
                {step === 3 && (
                  <button type="submit" disabled={isSubmitting} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : (isOtpInputVisible ? 'Verify & Register' : 'Complete Registration')}
                  </button>
                )}
              </div>
              <div id="recaptcha-container"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
