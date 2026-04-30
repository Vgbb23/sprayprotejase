import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';

interface HeroProps {
  onBuy: () => void;
}

export function Hero({ onBuy }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[95vh] flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl aspect-square bg-brand-pink/20 blur-[120px] rounded-full -z-10 opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-black to-transparent -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-brand-pink text-[10px] md:text-sm font-black uppercase tracking-[0.25em] mb-4 shadow-xl">
            <Zap className="w-3 h-3 md:w-4 md:h-4 fill-current" />
            Vendas Abertas - Brasil
          </div>
          
          <h1 className="font-display text-4xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter sm:px-4">
            NÃO SEJA MAIS <br />
            <span className="text-brand-pink text-glow italic">UMA VÍTIMA.</span>
          </h1>
          
          <p className="text-gray-300 text-base md:text-2xl lg:text-3xl max-w-2xl mx-auto font-medium leading-tight px-4">
            Recupere sua liberdade com o spray de proteção pessoal mais potente e elegante do mercado.
          </p>

          {/* Product Preview - Scaled for better mobile fit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative z-10 py-6 md:py-12"
          >
            <div className="relative max-w-[280px] md:max-w-xl mx-auto group">
               <div className="absolute inset-0 bg-brand-pink/20 blur-[60px] md:blur-[100px] -z-10 rounded-full group-hover:bg-brand-pink/30 transition-all duration-700" />
               <img 
                 src="https://i.ibb.co/ksvQw8px/image.png" 
                 alt="Personal Safety Device" 
                 className="rounded-2xl md:rounded-3xl w-full object-contain max-h-[400px] md:max-h-none transform group-hover:scale-[1.05] transition-transform duration-700"
                 referrerPolicy="no-referrer"
               />
               
               {/* Product Floating Badges - Scaled down for mobile */}
               <div className="absolute -top-3 -right-3 md:-top-4 md:-right-8 bg-brand-black p-3 md:p-6 rounded-xl md:rounded-2xl border border-brand-pink/30 shadow-2xl space-y-0.5 md:space-y-1 transform rotate-3">
                  <p className="text-white/60 text-[7px] md:text-[10px] font-bold uppercase tracking-widest leading-none">Apenas hoje</p>
                  <p className="text-xl md:text-4xl font-display font-black text-white italic tracking-tighter">R$ 29,90</p>
                  <div className="flex gap-0.5 justify-center">
                      {[1,2,3,4,5].map(i => <Zap key={i} className="w-2 md:w-3 h-2 md:h-3 fill-brand-pink text-brand-pink" />)}
                  </div>
               </div>
            </div>
          </motion.div>
          
          <div className="pt-2 md:pt-4 flex flex-col items-center gap-6">
            <motion.button
              onClick={onBuy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-brand-pink hover:bg-brand-pink/90 text-white px-8 md:px-12 py-4 md:py-7 rounded-xl md:rounded-2xl text-base md:text-2xl font-black italic transition-all shadow-[0_20px_50px_-10px_rgba(255,45,85,0.6)] flex items-center gap-3"
            >
              QUERO ME PROTEGER AGORA!
              <ArrowRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
            </motion.button>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white/50 text-[10px] font-black uppercase tracking-[0.15em] border-t border-white/10 pt-8 w-full max-w-xs md:max-w-none">
                <span className="flex items-center gap-2 underline decoration-brand-pink decoration-2"><ShieldCheck className="w-4 h-4 text-green-500" /> Site 100% Blindado</span>
                <span className="hidden md:block w-1.5 h-1.5 bg-white/20 rounded-full" />
                <span className="text-brand-accent">Estoque renovado hoje</span>
                <span className="hidden md:block w-1.5 h-1.5 bg-white/20 rounded-full" />
                <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-brand-pink" /> Envio para todo o Brasil</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
