'use client';

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BorderGlow from '../components/BorderGlow';
import GhostFibers from '../components/GhostFibers';
import { contactAPI } from '../lib/api';
import { RiMailSendLine, RiMessage3Line, RiCustomerService2Line, RiQuestionAnswerLine, RiCheckLine } from 'react-icons/ri';


export default function ContactUsPage() {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = ['General Inquiry', 'Technical Support', 'Partnerships', 'Feedback & Ideas'];

  useGSAP(() => {
    gsap.fromTo(
      '.gsap-hero',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2 }
    );
    gsap.fromTo(
      '.gsap-info-card',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.3 }
    );
    gsap.fromTo(
      '.gsap-form-card',
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.4 }
    );
  }, { scope: containerRef });


  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSubmitting(true);
    try {
      // 1. Send via Backend API endpoint
      await contactAPI.send(formData);
    } catch (err) {
      console.log('Backend API notice:', err.message);
    } finally {
      // 2. Also trigger direct mailto dispatch so mail client opens if preferred
      const targetEmail = 'audwitiyabandyopadhyay74@zohomail.in';
      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(`[SkillSwap ${formData.category}] ${formData.subject || 'Contact Inquiry'}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\n\nMessage:\n${formData.message}`)}`;
      
      // Trigger mailto client
      window.location.href = mailtoUrl;

      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', category: 'General Inquiry', subject: '', message: '' });
      }, 5000);
    }
  };


  return (
    <div ref={containerRef} className="min-h-screen bg-[#07070b] text-white flex flex-col relative overflow-hidden font-sans">
      <Navbar />

      {/* 3D GhostFibers Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-45 overflow-hidden">
        <GhostFibers
          lineColor="#00ff62"
          glowColor="#38BDF8"
          speed={0.2}
          scale={2.2}
          rotation={0}
          rotationSpeed={0.2}
          layers={4}
          waveAmplitude={0.015}
          waveFrequency={3}
          waveSpeed={0.15}
          layerSpeed={0.08}
          twist={0.1}
          twistFrequency={5}
          twistSpeed={1.2}
          lineFrequency={5}
          lineSpacing={2}
          lineSharpness={16}
          glowFalloff={10}
          glowIntensity={1.5}
          brightness={2}
          blueBoost={1.2}
          vignette={0.8}
          grain={0.04}
        />
      </div>

      {/* Hero Header */}
      <section className="relative pt-36 pb-16 px-6 max-w-6xl mx-auto w-full text-center z-10">
        <span className="gsap-hero text-xs font-mono font-bold uppercase tracking-widest text-[#00ff62] bg-[#00ff62]/10 px-4 py-1.5 rounded-full border border-[#00ff62]/30 mb-6 inline-block">
          Get in Touch
        </span>
        <h1 className="gsap-hero text-4xl md:text-6xl font-black tracking-tight leading-tight text-white mb-6">
          We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff62] to-[#38BDF8]">Hear From You</span>
        </h1>
        <p className="gsap-hero text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Have a question about SkillSwap, need technical help, or want to partner with us? Send us a message and our team will get back to you promptly.
        </p>
      </section>

      {/* Main Grid */}
      <section className="px-6 max-w-6xl mx-auto w-full mb-24 z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Information Column */}
        <div className="lg:col-span-5 space-y-6 gsap-info-card">
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 space-y-6">
            <h3 className="text-2xl font-extrabold text-white">Contact Information</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Our community support team is active 24/7 across multiple channels. Feel free to reach out anytime.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#00ff62]/10 flex items-center justify-center border border-[#00ff62]/30 text-[#00ff62]">
                  <RiMailSendLine size={24} />
                </div>
                <div>
                  <p className="text-xs font-mono text-white/50 uppercase">Email Us</p>
                  <a href="mailto:audwitiyabandyopadhyay74@zohomail.in" className="text-sm font-bold text-[#00ff62] hover:underline transition">
                    audwitiyabandyopadhyay74@zohomail.in
                  </a>
                </div>

              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center border border-[#A78BFA]/30 text-[#A78BFA]">
                  <RiCustomerService2Line size={24} />
                </div>
                <div>
                  <p className="text-xs font-mono text-white/50 uppercase">Live Community Discord</p>
                  <p className="text-sm font-bold text-white">discord.gg/skillswap</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#FF79C6]/10 flex items-center justify-center border border-[#FF79C6]/30 text-[#FF79C6]">
                  <RiQuestionAnswerLine size={24} />
                </div>
                <div>
                  <p className="text-xs font-mono text-white/50 uppercase">Response Time</p>
                  <p className="text-sm font-bold text-white">Under 2 Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 gsap-form-card">
          <BorderGlow color="#00ff62" glowIntensity={0.4} className="rounded-3xl">
            <div className="p-8 md:p-10 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 space-y-6">
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#00ff62]/20 border border-[#00ff62] text-[#00ff62] flex items-center justify-center mx-auto text-3xl shadow-[0_0_30px_rgba(0,255,98,0.4)]">
                    <RiCheckLine />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Message Sent Successfully!</h3>
                  <p className="text-sm text-white/70 max-w-md mx-auto">
                    Thank you for contacting SkillSwap. Our support team has received your message and will reply to <span className="text-[#00ff62] font-semibold">{formData.email}</span> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-extrabold text-white">Send Us a Message</h3>

                  {/* Category Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-white/60">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                            formData.category === cat
                              ? 'bg-[#00ff62] text-black border-[#00ff62] shadow-[0_0_15px_rgba(0,255,98,0.3)]'
                              : 'bg-white/5 text-white/70 border-white/10 hover:border-white/25'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-white/60">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00ff62] transition text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-white/60">Your Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00ff62] transition text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-white/60">Subject</label>
                    <input
                      type="text"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00ff62] transition text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-white/60">Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00ff62] transition text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-[#00ff62] text-black font-extrabold text-sm hover:bg-emerald-400 transition shadow-[0_0_25px_rgba(0,255,98,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RiMessage3Line size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </BorderGlow>
        </div>
      </section>

      <Footer />
    </div>
  );
}

