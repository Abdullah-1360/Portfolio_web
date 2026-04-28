'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, fadeLeft, fadeRight, staggerContainer } from '@/lib/motion';
import type { PersonalInfo } from '@/types';

const schema = z.object({
  name:    z.string().min(1, 'Required'),
  email:   z.string().email('Invalid email'),
  subject: z.string().min(1, 'Required'),
  message: z.string().min(10, 'At least 10 characters'),
});
type F = z.infer<typeof schema>;

export default function ContactSection({ personalInfo }: { personalInfo: PersonalInfo }) {
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: F) => {
    setStatus('loading');
    try {
      const api = process.env.NEXT_PUBLIC_API_URL ?? 'https://portfolio-backend-nu-seven.vercel.app/api';
      const res = await fetch(`${api}/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success'); reset();
    } catch (err) {
      console.error('[Contact form]', err);
      setStatus('error');
    }
  };

  const inp = `w-full px-4 py-2.5 rounded-sm bg-[var(--bg-3)] border border-[var(--border)]
    text-[var(--text)] placeholder-[var(--text-faint)] text-sm
    focus:outline-none focus:border-[var(--border-accent)] transition-colors`;

  return (
    <SectionWrapper id="contact">
      <SectionHeader number="05" title="Get In Touch" />

      <motion.p variants={fadeUp} className="text-[var(--text-muted)] max-w-xl mb-12 text-sm leading-relaxed">
        I&apos;m always interested in new opportunities and exciting projects. Whether you have a
        question or just want to say hi, I&apos;ll try my best to get back to you!
      </motion.p>

      <div className="grid md:grid-cols-[1fr_1.7fr] gap-6 md:gap-10">

        {/* Info */}
        <motion.div variants={staggerContainer(0.08)} className="space-y-3">
          <motion.h3 variants={fadeLeft} className="font-semibold text-[var(--text)] mb-5">
            Contact Information
          </motion.h3>
          {[
            { icon: <Mail size={14} />,  label: 'Email',    value: personalInfo.email,    href: `mailto:${personalInfo.email}` },
            { icon: <Phone size={14} />, label: 'Phone',    value: personalInfo.phone,    href: `tel:${personalInfo.phone}` },
            { icon: <MapPin size={14} />,label: 'Location', value: personalInfo.location, href: null },
            { icon: <Clock size={14} />, label: 'Response', value: 'Within 1 hour',       href: null },
          ].map(({ icon, label, value, href }) => (
            <motion.div key={label} variants={fadeLeft} className="card p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)] shrink-0">
                {icon}
              </div>
              <div>
                <p className="mono mb-0.5" style={{ fontSize: '0.6rem' }}>{label}</p>
                {href
                  ? <a href={href} className="text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors">{value}</a>
                  : <p className="text-sm text-[var(--text)]">{value}</p>}
              </div>
            </motion.div>
          ))}

          <motion.div variants={fadeLeft} className="flex gap-3 pt-2">
            {[
              { icon: <FaGithub size={15} />,   href: personalInfo.github,   label: 'GitHub' },
              { icon: <FaLinkedin size={15} />, href: personalInfo.linkedin, label: 'LinkedIn' },
            ].map(({ icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label} whileHover={{ y: -2 }}
                className="w-9 h-9 rounded-sm border border-[var(--border)] flex items-center
                           justify-center text-[var(--text-faint)] hover:text-[var(--accent)]
                           hover:border-[var(--border-accent)] transition-colors">
                {icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Form */}
        <motion.div variants={fadeRight}>
          <form onSubmit={handleSubmit(onSubmit)} className="card p-4 md:p-7 space-y-4">
            <h3 className="font-semibold text-[var(--text)]">Send me a message</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <input {...register('name')} placeholder="Name" className={inp} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <input {...register('email')} placeholder="Email" className={inp} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <input {...register('subject')} placeholder="Subject" className={inp} />
              {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <textarea {...register('message')} placeholder="Your message…" rows={5}
                className={`${inp} resize-none`} />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <motion.button type="submit" disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full disabled:opacity-50">
              {status === 'loading'
                ? <span className="w-4 h-4 border-2 border-[#0d1b2e] border-t-transparent rounded-full animate-spin" />
                : <Send size={13} strokeWidth={1.8} />}
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </motion.button>

            {status === 'success' && <p className="text-green-400 text-xs text-center mono">✓ Message sent!</p>}
            {status === 'error'   && <p className="text-red-400 text-xs text-center mono">✗ Something went wrong.</p>}
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div variants={fadeUp} className="mt-20 text-center">
        <div className="w-12 h-px mx-auto mb-5"
             style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
        <p className="mono">© {new Date().getFullYear()} Abdullah Shahid — Built with Next.js & NestJS</p>
        <p className="mono mt-1">Designed & Developed with ❤️</p>
      </motion.div>
    </SectionWrapper>
  );
}
