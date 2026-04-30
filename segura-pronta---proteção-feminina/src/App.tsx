/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Hero } from './components/Hero';
import { PainPoints } from './components/PainPoints';
import { Solution } from './components/Solution';
import { Benefits } from './components/Benefits';
import { SocialProof } from './components/SocialProof';
import { FAQ } from './components/FAQ';
import { Offer } from './components/Offer';
import { Footer } from './components/Footer';
import { Checkout } from './components/Checkout';
import { Shield, Zap } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { initMarketingParams } from './utils/marketingParams';

export default function App() {
  const [view, setView] = useState<'landing' | 'checkout'>('landing');

  useEffect(() => {
    initMarketingParams();
  }, [view]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (view === 'checkout') {
    return <Checkout onBack={() => {
      setView('landing');
      window.scrollTo(0, 0);
    }} />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-brand-pink selection:text-white bg-brand-black">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-pink z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-brand-black/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-pink rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,45,85,0.4)]">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-display font-black text-lg md:text-xl tracking-tighter">GUARDIANA</span>
              <span className="text-[8px] md:text-[10px] font-bold text-brand-pink uppercase tracking-widest">Proteção Premium</span>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-brand-pink text-brand-pink" />
              Oferta Acaba em 04:22:15
            </div>
            <button 
              onClick={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-brand-pink hover:bg-brand-pink/90 text-white px-5 py-2.5 rounded-xl text-xs font-black italic transition-all transform hover:scale-105 shadow-lg"
            >
              COMPRAR
            </button>
          </div>
        </div>
      </header>

      <main>
        <Hero onBuy={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })} />
        <div className="bg-brand-soft overflow-hidden">
            <PainPoints />
        </div>
        <Solution onBuy={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })} />
        <div className="bg-white text-brand-black overflow-hidden">
            <Benefits onBuy={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })} />
        </div>
        <SocialProof />
        <div className="bg-brand-soft text-brand-black border-y border-gray-200 overflow-hidden">
            <FAQ />
        </div>
        <Offer onBuy={() => setView('checkout')} />
      </main>

      <Footer />
    </div>
  );
}
