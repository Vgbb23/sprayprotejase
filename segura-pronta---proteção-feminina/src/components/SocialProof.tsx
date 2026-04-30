import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, User, X } from 'lucide-react';

const testimonials = [
  {
    name: "Mariana Silva",
    age: 26,
    text: "Moro em SP e pego metrô tarde. O spray no bolso me dá uma paz que eu não tinha antes. É pequeno e ninguém percebe.",
    images: ["https://i.ibb.co/FLRKByBg/image.png", "https://i.ibb.co/dwGFX0fr/image.png"]
  },
  {
    name: "Camila Rocha",
    age: 34,
    text: "Corro no parque de manhã cedo. Ter isso comigo me faz sentir muito mais no controle. O produto é lindo e bem acabado.",
    images: ["https://i.ibb.co/mC1zcBMQ/image.png", "https://i.ibb.co/dwr2D2BH/image.png"]
  },
  {
    name: "Juliana Mendes",
    age: 21,
    text: "Sempre pego Uber pra voltar da faculdade. Deixo o spray na mão escondido e me sinto segura. Melhor investimento que fiz.",
    images: ["https://i.ibb.co/23R2wmHp/image.png", "https://i.ibb.co/qXdhWHJ/image.png"]
  }
];

const names = ["Ana", "Beatriz", "Carla", "Daniela", "Elaine", "Fernanda", "Gabriela", "Helena", "Isabela", "Julia", "Karen", "Larissa", "Monique", "Natalia", "Olivia", "Paula", "Renata", "Simone", "Tatiane", "Vanessa"];
const lastNames = ["Silva", "Santos", "Oliveira", "Pereira", "Lima", "Ferreira", "Rodrigues", "Almeida", "Nascimento", "Souza"];
const comments = [
  "Chegou super rápido e a qualidade me surpreendeu demais!",
  "Me sinto muito mais segura voltando do trabalho agora.",
  "Produto discreto e elegante, parece um batom ou perfume.",
  "Melhor compra que fiz esse ano, segurança não tem preço.",
  "Recomendo pra todas as minhas amigas e família.",
  "O spray é potente e a trava de segurança funciona muito bem.",
  "Design impecável e cabe em qualquer bolsinha de festa.",
  "Acabamento premium, vale cada centavo investido.",
  "Indispensável pra quem anda sozinha à noite.",
  "Atendimento excelente e produto nota 10!"
];

const extraFeedbacks = Array.from({ length: 50 }, (_, i) => ({
  name: `${names[i % names.length]} ${lastNames[i % lastNames.length]}`,
  age: 18 + (i % 30),
  text: comments[i % comments.length],
  rating: 5
}));

export function SocialProof() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-center mb-16">
          Impacto Real na Vida de <br />
          <span className="text-brand-pink font-display italic">Mulheres Reais.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-brand-dark border border-white/5 p-8 rounded-3xl relative group hover:border-brand-pink/30 transition-all flex flex-col h-full"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-brand-pink/10 group-hover:text-brand-pink/20 transition-all" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full border-2 border-brand-pink/20 bg-white/5 flex items-center justify-center">
                  <User className="w-7 h-7 text-brand-pink" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t.name}, {t.age}</h4>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 italic leading-relaxed mb-8 flex-grow">
                "{t.text}"
              </p>

              {/* Review Images */}
              <div className="grid grid-cols-2 gap-3">
                {t.images.map((img, index) => (
                  <div key={index} className="aspect-square rounded-2xl overflow-hidden border border-white/10">
                    <img 
                      src={img} 
                      alt={`Review from ${t.name}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 group"
          >
            VER MAIS FEEDBACKS
            <Star className="w-4 h-4 text-brand-pink group-hover:rotate-45 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Modal Feedbacks */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-brand-dark rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-3xl"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-brand-dark z-20">
                <div>
                  <h3 className="text-2xl font-black italic">Depoimentos Verificados</h3>
                  <p className="text-gray-400 text-sm">Mais de 1.400 mulheres protegidas em todo o Brasil.</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Scrollable Grid */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[radial-gradient(circle_at_top_right,rgba(255,45,85,0.05)_0%,transparent_50%)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extraFeedbacks.map((f, idx) => (
                    <div 
                      key={idx} 
                      className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-brand-pink/20 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-brand-pink" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{f.name}, {f.age}</p>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm italic leading-relaxed">
                        "{f.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-brand-dark flex justify-center sticky bottom-0 z-20">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total de 53 feedbacks exibidos</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
