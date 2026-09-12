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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
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
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('ss_token', data.token);
      localStorage.setItem('ss_user', JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name || 'User'}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-screen h-screen flex items-center justify-center relative font-sans">
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

      <div className="gsap-card w-[90%] sm:w-[80%] md:w-[45%] lg:w-[32%] min-h-[85vh] bg-white/95 backdrop-blur-xl z-10 rounded-3xl gap-4 flex flex-col items-center justify-center text-black shadow-[0_20px_60px_-15px_rgba(82,39,255,0.4)] border border-white/40 px-6 sm:px-8 py-8">
        <div className="w-full text-center mb-6">
          <h1 className="font-bold font-mono text-3xl tracking-tight">
            Welcome, Back
          </h1>
          <p className="text-gray-400 text-sm font-mono mt-2">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="inputs w-full flex flex-col items-center justify-center gap-6">
          <div className="gsap-input relative w-[85%]">
            <input
              required
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full h-[7vh] outline-none border-b-2 border-gray-200 text-base transition-colors duration-300 focus:border-[#00ff62]"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-base opacity-0 transition-all duration-300 peer-placeholder-shown:opacity-100 peer-focus:opacity-100 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#00ff62] peer-focus:font-bold"
            >
              Email
            </label>
          </div>

          <div className="gsap-input relative w-[85%]">
            <input
              required
              type="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full h-[7vh] outline-none border-b-2 border-gray-200 text-base transition-colors duration-300 focus:border-[#00ff62]"
            />
            <label
              htmlFor="password"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-base opacity-0 transition-all duration-300 peer-placeholder-shown:opacity-100 peer-focus:opacity-100 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#00ff62] peer-focus:font-bold"
            >
              Password
            </label>
          </div>

          <div className="gsap-input w-[85%] flex justify-end">
            <a
              href="#"
              className="text-xs font-mono text-gray-400 hover:text-[#00ff62] transition-colors duration-300"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gsap-input w-[60%] min-h-[5.5vh] bg-[#00ff62] text-black rounded-xl font-mono font-bold text-base hover:bg-[#00cc4e] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(0,255,98,0.5)] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>


        </form>

        <div className="w-full text-center mt-auto pt-4">
          <span className="text-sm font-mono text-gray-400">
            Don't have an account?{' '}
            <a
              href="/auth/signup"
              className="text-[#00ff62] font-bold hover:underline transition ml-1"
            >
              Sign up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;
