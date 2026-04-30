import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: "É difícil de usar?",
    a: "Não! O spray foi projetado para uso sob estresse. Possui um gatilho intuitivo e uma trava de segurança simples que você libera com um polegar em frações de segundo."
  },
  {
    q: "Funciona mesmo contra agressores maiores?",
    a: "Sim. A fórmula é baseada em óleoresina de capsicum de alta intensidade, que causa cegueira temporária, tosse involuntária e sensação de queimação, paralisando o agressor independente do seu porte físico."
  },
  {
    q: "Posso levar para qualquer lugar?",
    a: "O spray é portátil e discreto. Recomendamos o uso em ambientes urbanos, parques e transporte público. Verifique restrições específicas em aeroportos ou prédios governamentais conforme as normas locais."
  },
  {
    q: "Qual o alcance do spray?",
    a: "O spray tem um jato direcionado que alcança até 3 metros de distância, permitindo que você mantenha o agressor longe antes mesmo dele chegar perto."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-brand-soft">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-4">
                <HelpCircle className="w-8 h-8 text-brand-pink" />
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-black text-brand-black tracking-tighter">Respostas Honestas</h2>
            <p className="text-gray-500 font-medium">Tudo o que você precisa saber para sentir segurança no seu investimento.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="light-card rounded-[1.5rem] overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-8 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-black text-xl text-brand-black tracking-tight">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center transition-all duration-300 ${openIndex === i ? 'bg-brand-pink border-brand-pink rotate-180' : ''}`}>
                    <ChevronDown className={`w-5 h-5 ${openIndex === i ? 'text-white' : 'text-brand-pink'}`} />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-gray-600 font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
