import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Star } from 'lucide-react';

const benefits = [
    "Sinta-se mais confiante ao sair à noite",
    "Proteção discreta que não pesa na bolsa",
    "Pronto para uso em situações de estresse extremo",
    "Ideal para presentear quem você ama e quer proteger",
    "Dê um basta na sensação de estar indefesa",
    "Eficaz contra agressores de qualquer porte físico"
];

interface BenefitsProps {
  onBuy?: () => void;
}

export function Benefits({ onBuy }: BenefitsProps) {
  return (
    <section className="py-32 bg-white text-brand-black">
      <div className="container mx-auto px-6">
        <div className="relative z-10 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-20">
                <div className="lg:w-1/2 relative">
                    <div className="absolute -inset-4 bg-brand-pink/10 rounded-[3rem] blur-2xl -z-10" />
                    <img 
                        src="https://i.ibb.co/35JrNPFb/image.png" 
                        alt="Guardiana Pro" 
                        className="rounded-[3rem] w-full aspect-[4/5] object-cover shadow-3xl"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl max-w-[240px]">
                        <div className="flex gap-1 mb-2">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-brand-pink text-brand-pink" />)}
                        </div>
                        <p className="text-sm font-black italic text-brand-black leading-tight italic">"Sinto que tenho o controle da minha volta pra casa."</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Beatriz, 24 anos</p>
                    </div>
                </div>
                
                <div className="lg:w-1/2 space-y-10">
                    <div className="space-y-4">
                        <div className="text-brand-pink font-black uppercase tracking-[0.2em] text-xs">Transformação Real</div>
                        <h2 className="font-display text-5xl md:text-6xl font-black leading-[0.9] tracking-tighter">
                            A confiança que você <br />
                            <span className="text-brand-pink italic underline decoration-brand-black/10">precisava.</span>
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-y-6">
                        {benefits.map((benefit, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-pink transition-colors">
                                    <CheckCircle2 className="w-6 h-6 text-brand-pink group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-xl font-bold text-brand-dark tracking-tight leading-tight">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="pt-6">
                        <button 
                            onClick={onBuy}
                            className="w-full md:w-auto bg-brand-black text-white px-10 py-5 rounded-2xl font-black text-lg italic hover:bg-brand-pink transition-all shadow-xl"
                        >
                            QUERO ME PROTEGER AGORA!
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
