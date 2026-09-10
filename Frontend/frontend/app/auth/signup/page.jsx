'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Topography from '../../components/backgrounds/Topography';
import { authAPI } from '../../lib/api';
import { useToast } from '../../components/ToastContext';

const Page = () => {
  const containerRef = useRef(null);
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      '.gsap-card',
      { scale: 0.9, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' }
    );
    gsap.fromTo(
      '.gsap-input',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
    );
  }, { scope: containerRef });

  React.useEffect(() => {
    const token = localStorage.getItem('ss_token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.register({ name, email, password });
      localStorage.setItem('ss_token', data.token);
      localStorage.setItem('ss_user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
      router.push('/auth/onboarding');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-screen h-screen flex items-center justify-center relative font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-[-10]">
        <Topography
          lowColor="#5227FF"
          midColor="#FF9FFC"
          speed={0.35}
          morphAmount={3}
          morphSpeed={0.05}
          bands={2}
          thickness={0.01}
          scale={2}
          pixelSize={1}
          glow={0.5}
          colorMode="elevation"
          contrast={3}
          brightness={1}
          fillBands={false}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseRadius={0.3}
          mouseStrength={0.4}
        />
      </div>

      {/* Card */}
      <div className="gsap-card w-[90%] sm:w-[80%] md:w-[45%] lg:w-[32%] min-h-[90vh] bg-white/95 backdrop-blur-xl z-10 rounded-3xl gap-4 flex flex-col items-center justify-center text-black shadow-[0_20px_60px_-15px_rgba(82,39,255,0.4)] border border-white/40 px-6 sm:px-8 py-8">
        {/* Title */}
        <div className="w-full text-center mb-4">
          <h1 className="font-bold font-mono text-3xl tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm font-mono mt-2">
            Sign up to get started with your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="inputs w-full flex flex-col items-center justify-center gap-5">
          {/* Name */}
          <div className="gsap-input relative w-[85%]">
            <input
              required
              type="text"
              id="name"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full h-[6.5vh] outline-none border-b-2 border-gray-200 text-base transition-colors duration-300 focus:border-[#00ff62]"
            />
            <label
              htmlFor="name"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-base opacity-0 transition-all duration-300 peer-placeholder-shown:opacity-100 peer-focus:opacity-100 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#00ff62] peer-focus:font-bold"
            >
              Name
            </label>
          </div>

          {/* Email */}
          <div className="gsap-input relative w-[85%]">
            <input
              required
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full h-[6.5vh] outline-none border-b-2 border-gray-200 text-base transition-colors duration-300 focus:border-[#00ff62]"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-base opacity-0 transition-all duration-300 peer-placeholder-shown:opacity-100 peer-focus:opacity-100 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#00ff62] peer-focus:font-bold"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="gsap-input relative w-[85%]">
            <input
              required
              type="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full h-[6.5vh] outline-none border-b-2 border-gray-200 text-base transition-colors duration-300 focus:border-[#00ff62]"
            />
            <label
              htmlFor="password"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-base opacity-0 transition-all duration-300 peer-placeholder-shown:opacity-100 peer-focus:opacity-100 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#00ff62] peer-focus:font-bold"
            >
              Password
            </label>
          </div>

          {/* Confirm Password */}
          <div className="gsap-input relative w-[85%]">
            <input
              required
              type="password"
              id="confirm-password"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer w-full h-[6.5vh] outline-none border-b-2 border-gray-200 text-base transition-colors duration-300 focus:border-[#00ff62]"
            />
            <label
              htmlFor="confirm-password"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-base opacity-0 transition-all duration-300 peer-placeholder-shown:opacity-100 peer-focus:opacity-100 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#00ff62] peer-focus:font-bold"
            >
              Confirm Password
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="gsap-input w-[60%] min-h-[5.5vh] bg-[#00ff62] text-black rounded-xl font-mono font-bold text-base hover:bg-[#00cc4e] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(0,255,98,0.5)] cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Divider */}
          <div className="flex items-center w-[85%] gap-4 my-1">
            <div className="flex-1 h-[1px] bg-gray-200" />
            <span className="text-gray-300 text-xs font-mono">or</span>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => toast.info('Google Auth integration ready')}
            className="flex items-center justify-center min-w-[7vh] min-h-[7vh] border-2 border-gray-100 bg-white rounded-full hover:border-[#00ff62] hover:shadow-[0_8px_20px_-5px_rgba(0,255,98,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.12 15.89-5.77l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
          </button>
        </form>

        {/* Footer */}
        <div className="w-full text-center mt-auto pt-4">
          <span className="text-sm font-mono text-gray-400">
            Already have an account?{' '}
            <a
              href="/auth/login"
              className="text-[#00ff62] font-bold hover:underline transition ml-1"
            >
              Login
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;

