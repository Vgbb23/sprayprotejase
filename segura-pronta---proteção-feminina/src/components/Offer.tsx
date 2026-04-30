import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ShieldCheck, Truck, Clock, Zap, Star } from 'lucide-react';

interface OfferProps {
  onBuy: () => void;
}

export function Offer({ onBuy }: OfferProps) {
  return (
    <section id="oferta" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-brand-red/10 blur-[150px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto rounded-[3.5rem] bg-gradient-to-br from-brand-dark to-brand-black border-2 border-brand-pink/20 overflow-hidden shadow-2xl relative">
          
          <div className="flex flex-col lg:flex-row">
            {/* Left: Product Image */}
            <div className="lg:w-1/2 bg-brand-black/50 p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5">
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-pink/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="https://i.ibb.co/6JnZRZCt/Gemini-Generated-Image-2upvp92upvp92upv-3.png" 
                  alt="Product Guardiana Pro" 
                  className="w-full h-auto object-contain max-h-[400px] relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-8 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    "https://i.ibb.co/TxZdtMnX/Gemini-Generated-Image-2upvp92upvp92upv-2.png",
                    "https://i.ibb.co/gMrkJNDq/Gemini-Generated-Image-2upvp92upvp92upv-1.png",
                    "https://i.ibb.co/5hvHW16g/Gemini-Generated-Image-2upvp92upvp92upv.png"
                  ].map((url, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl border border-white/10 overflow-hidden flex-shrink-0 cursor-pointer hover:border-brand-pink/50 opacity-60 hover:opacity-100 transition-all">
                        <img src={url} alt={`Thumb ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
              </div>
            </div>

            {/* Right: Price & Buy */}
            <div className="lg:w-1/2 p-6 md:p-10 lg:p-12 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-brand-red text-[9px] font-black italic px-2 py-1 rounded-sm uppercase tracking-tighter">
                    -45% OFF HOJE
                  </div>
                  <div className="flex items-center gap-1 bg-brand-accent/20 text-brand-accent text-[9px] font-black px-2 py-1 rounded-sm uppercase italic">
                    <Zap className="w-3 h-3 fill-current" /> MAIS VENDIDO
                  </div>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-black leading-none tracking-tighter italic">
                  Guardiana <span className="text-brand-pink">Série Black</span>
                </h2>
                <div className="flex items-center gap-2 pt-1">
                    <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-brand-pink text-brand-pink" />)}
                    </div>
                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">(4.9/5 • 2.8k+)</span>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                <p className="text-gray-500 line-through text-sm font-bold">De R$ 89,90</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-5xl md:text-6xl font-display font-extrabold text-white tracking-tighter leading-none">
                     <span className="text-xl align-top mr-1">R$</span>29,90
                   </p>
                </div>
                <div className="pt-3 flex flex-col gap-2">
                    <p className="text-brand-accent text-[11px] font-black italic flex items-center gap-2">
                        <Clock className="w-4 h-4" /> OFERTA POR TEMPO LIMITADO
                    </p>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: "100%" }}
                            animate={{ width: "15%" }}
                            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                            className="h-full bg-brand-pink"
                        />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                        <span className="text-brand-pink">Últimas peças</span>
                        <span className="text-gray-500">92% vendido</span>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <motion.button
                  onClick={onBuy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white py-5 px-2 rounded-2xl text-[15px] sm:text-lg md:text-xl font-black italic shadow-xl transition-all flex items-center justify-center group whitespace-nowrap"
                >
                  QUERO ME PROTEGER AGORA!
                </motion.button>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                        <Truck className="w-4 h-4 text-brand-pink" />
                        <span className="text-[9px] font-bold text-white/50 uppercase leading-none">Envio para<br/>todo o Brasil</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                        <ShieldCheck className="w-4 h-4 text-brand-pink" />
                        <span className="text-[9px] font-bold text-white/50 uppercase leading-none">7 Dias de<br/>Garantia</span>
                    </div>
                </div>
                

              </div>
            </div>
          </div>
        </div>

        {/* Floating Timer */}
        <div className="mt-12 flex justify-center">
            <div className="bg-brand-dark/80 backdrop-blur px-8 py-3 rounded-full border border-brand-pink/20 flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-pink animate-pulse" />
                <span className="text-sm font-bold text-gray-300">A oferta encerra em: </span>
                <span className="font-display font-black text-brand-pink tabular-nums">04:22:15</span>
            </div>
        </div>
      </div>
    </section>
  );
}
