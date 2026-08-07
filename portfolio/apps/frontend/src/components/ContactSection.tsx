'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, fadeLeft, fadeRight, staggerContainer } from '@/lib/motion';
import type { PersonalInfo } from '@/types';

const schema = z.object({
  name:    z.string().min(1, 'Name is required'),
  email:   z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'At least 10 characters'),
});
type F = z.infer<typeof schema>;

const inp = `w-full px-4 py-3 rounded-xl bg-[var(--bg-3)] border border-[var(--border)]
  text-[var(--text)] placeholder-[var(--text-faint)] text-sm
  focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--bg-4)]
  transition-all duration-200`;

export default function ContactSection({ personalInfo }: { personalInfo: PersonalInfo }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: F) => {
    setStatus('loading');
    try {
      const api = 'https://portfolio-web-tau-ten-80.vercel.app/api';
      const res = await fetch(`${api}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      setStatus('success'); reset();
    } catch { setStatus('error'); }
  };

  const CONTACTS = [
    { icon: <Mail size={14} strokeWidth={2} />,  label: 'Email',    value: personalInfo.email,    href: `mailto:${personalInfo.email}` },
    { icon: <Phone size={14} strokeWidth={2} />, label: 'Phone',    value: personalInfo.phone,    href: `tel:${personalInfo.phone}` },
    { icon: <MapPin size={14} strokeWidth={2} />,label: 'Location', value: personalInfo.location, href: null },
  ];

  return (
    <SectionWrapper id="contact">
      <SectionHeader number="05" title="Get In Touch"
        subtitle="Have a project in mind or want to collaborate? I'd love to hear from you." />

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* Left */}
        <motion.div variants={staggerContainer(0.08)} className="space-y-4">
          {CONTACTS.map(({ icon, label, value, href }) => (
            <motion.div key={label} variants={fadeLeft}>
              {href ? (
                <a href={href}
                   className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)]
                              glass-card hover:border-[var(--border-accent)] transition-all duration-200 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-3)] flex items-center justify-center
                                  text-[var(--accent)] group-hover:bg-[var(--accent-dim)] transition-colors shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-faint)] mb-0.5"
                       style={{ fontFamily: 'JetBrains Mono, monospace' }}>{label}</p>
                    <p className="text-sm font-medium text-[var(--text)]"
                       style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] glass-card">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-3)] flex items-center justify-center text-[var(--accent)] shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-faint)] mb-0.5"
                       style={{ fontFamily: 'JetBrains Mono, monospace' }}>{label}</p>
                    <p className="text-sm font-medium text-[var(--text)]"
                       style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          <motion.div variants={fadeLeft} className="flex gap-3 pt-2">
            {[
              { icon: <FaGithub size={15} />,   href: personalInfo.github,   label: 'GitHub' },
              { icon: <FaLinkedin size={15} />, href: personalInfo.linkedin, label: 'LinkedIn' },
            ].map(({ icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label} whileHover={{ y: -3, scale: 1.08 }} whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center
                           text-[var(--text-muted)] hover:text-[var(--accent)]
                           hover:border-[var(--border-accent)] hover:bg-[var(--accent-dim)]
                           transition-colors cursor-pointer">
                {icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Form */}
        <motion.div variants={fadeRight}>
          <form onSubmit={handleSubmit(onSubmit)}
            className="glass-card rounded-2xl p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
                       style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Name</label>
                <input {...register('name')} placeholder="Your name" className={inp}
                       style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
                       style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Email</label>
                <input {...register('email')} placeholder="your@email.com" className={inp}
                       style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
                     style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Subject</label>
              <input {...register('subject')} placeholder="What's this about?" className={inp}
                     style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
              {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
                     style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Message</label>
              <textarea {...register('message')} rows={5} placeholder="Tell me about your project..."
                        className={`${inp} resize-none`}
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
              {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-sm"
                   style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <CheckCircle size={14} />Message sent! I'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm"
                   style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <AlertCircle size={14} />Something went wrong. Please try again.
              </div>
            )}

            <motion.button type="submit" disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'loading' ? (
                <><div className="w-4 h-4 border-2 border-[#0A0F1E]/30 border-t-[#0A0F1E] rounded-full animate-spin" />Sending...</>
              ) : (
                <><Send size={14} strokeWidth={2} />Send Message</>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div variants={fadeUp}
        className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row
                   items-center justify-between gap-3 text-xs text-[var(--text-faint)]"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        <span>© {new Date().getFullYear()} Abdullah Shahid. All rights reserved.</span>
        <span className="flex items-center gap-1.5">
          Built with <span className="text-[var(--accent)] font-semibold">Next.js</span>
          &amp; <span className="text-[var(--purple)] font-semibold">Framer Motion</span>
        </span>
      </motion.div>
    </SectionWrapper>
  );
}
