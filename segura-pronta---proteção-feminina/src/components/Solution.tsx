import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pocket, Zap, EyeOff, Shield, X, Info } from 'lucide-react';

const features = [
  {
    icon: EyeOff,
    title: "100% Discreto",
    description: "Design elegante que se assemelha a um frasco de perfume ou batom. Ninguém saberá o que é."
  },
  {
    icon: Zap,
    title: "Ação Imediata",
    description: "Sistema de gatilho rápido. Em menos de 2 segundos você está pronta para neutralizar qualquer ameaça."
  },
  {
    icon: Pocket,
    title: "Ultra Portátil",
    description: "Cabe perfeitamente no seu bolso, na bolsa pequena de festa ou em qualquer compartimento."
  },
  {
    icon: Shield,
    title: "Segurança Certificada",
    description: "Fórmula de alta eficiência que causa irritação imediata mas sem danos permanentes."
  }
];

interface SolutionProps {
  onBuy?: () => void;
}

export function Solution({ onBuy }: SolutionProps) {
  const [showTechModal, setShowTechModal] = useState(false);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-brand-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="lg:w-1/2 order-2 lg:order-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:bg-white/10 hover:border-brand-pink/30 transition-all duration-500 group"
                >
                  <div className="w-12 h-12 bg-brand-pink/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-pink group-hover:scale-110 transition-all duration-500">
                    <feature.icon className="w-6 h-6 text-brand-pink group-hover:text-white" />
                  </div>
                  <h4 className="text-xl font-black mb-3 tracking-tight leading-none text-white">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2 space-y-8 text-center lg:text-left">
            <div className="inline-block px-5 py-2 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-[10px] font-black uppercase tracking-[0.25em] mb-4">
              Tecnologia de Defesa
            </div>
            <h2 className="font-display text-4xl md:text-7xl font-black leading-[0.95] tracking-tighter">
              A sua arma contra <br />
              <span className="text-white italic underline decoration-brand-pink/30">o medo.</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              O Guardiana Pro foi milimetricamente desenhado para ser sua primeira e mais eficaz linha de defesa. Confiança que cabe na palma da sua mão.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBuy}
                className="px-8 py-5 bg-brand-pink rounded-2xl text-white font-black italic shadow-xl transition-all uppercase tracking-tighter flex items-center justify-center gap-3"
              >
                QUERO ME PROTEGER AGORA!
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTechModal(true)}
                className="px-8 py-5 bg-brand-black border-2 border-white/10 rounded-2xl text-white font-black italic hover:border-brand-pink/50 transition-all uppercase tracking-tighter flex items-center justify-center gap-3 group"
              >
                FICHA TÉCNICA
                <Info className="w-5 h-5 text-brand-pink" />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 pt-6 max-w-sm mx-auto lg:mx-0">
                {[
                    "Zero força física necessária",
                    "Efeito paralisante imediato",
                    "Até 3 metros de distância segura"
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-pink shadow-[0_0_10px_rgba(255,45,85,0.8)]" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">{item}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tech Details Modal */}
      <AnimatePresence>
        {showTechModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTechModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-brand-dark rounded-[2rem] border border-white/10 overflow-hidden shadow-3xl flex flex-col"
            >
              <div className="p-6 md:p-10 overflow-y-auto">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black italic leading-none mb-2">Detalhes Técnicos</h3>
                    <div className="w-16 md:w-20 h-1 bg-brand-pink rounded-full" />
                  </div>
                  <button 
                    onClick={() => setShowTechModal(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6 text-white/50" />
                  </button>
                </div>

                <div className="space-y-4 md:space-y-6 text-gray-300 leading-relaxed text-base md:text-lg">
                  <p className="font-bold text-white">
                    Spray de Defesa Pessoal 110ml Pimenta Extra Forte
                  </p>
                  <p className="text-sm md:text-base">
                    O Spray de Defesa Pessoal 110ml Pimenta Extra Forte é a solução ideal para quem busca segurança em situações de emergência. Com um alcance máximo de 2 metros, ele proporciona uma defesa eficaz, permitindo que você se sinta protegido em qualquer lugar.
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
                    <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] md:text-[10px] text-brand-pink font-black uppercase tracking-widest mb-1">Volumetria</p>
                      <p className="font-bold text-sm md:text-base whitespace-nowrap">110 mL</p>
                    </div>
                    <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] md:text-[10px] text-brand-pink font-black uppercase tracking-widest mb-1">Alcance</p>
                      <p className="font-bold text-sm md:text-base whitespace-nowrap">Até 2 metros</p>
                    </div>
                    <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] md:text-[10px] text-brand-pink font-black uppercase tracking-widest mb-1">Modelo</p>
                      <p className="font-bold text-sm md:text-base whitespace-nowrap">Série Police</p>
                    </div>
                    <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] md:text-[10px] text-brand-pink font-black uppercase tracking-widest mb-1">Segurança</p>
                      <p className="font-bold text-sm md:text-base whitespace-nowrap italic">Não Tóxico</p>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400 italic bg-white/3 p-4 rounded-xl border-l-2 border-brand-pink">
                    "Este produto, da marca Defesa, é fácil de transportar e utilizar, tornando-se um item indispensável para ter sempre à mão. Sua composição de pimenta extra forte garante uma resposta rápida e eficaz em momentos críticos."
                  </p>
                </div>

                <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-brand-pink" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Produto 100% Original e Lacrado</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowTechModal(false)}
                      className="w-full sm:w-auto px-8 py-3 bg-brand-pink rounded-xl text-white font-black italic text-sm"
                    >
                      ENTENDI
                    </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
