import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, UserX, Car, Moon } from 'lucide-react';

const scenarios = [
  {
    icon: Moon,
    title: "Andar sozinha à noite",
    description: "A sensação de alerta constante ao caminhar por ruas pouco iluminadas."
  },
  {
    icon: Car,
    title: "Em aplicativos ou ônibus",
    description: "A incerteza ao entrar em um carro estranho ou transporte público lotado."
  },
  {
    icon: UserX,
    title: "Ser seguida na rua",
    description: "O frio na barriga quando você percebe que alguém está no seu encalço."
  },
  {
    icon: AlertCircle,
    title: "Estacionamentos vazios",
    description: "A vulnerabilidade ao procurar as chaves em locais isolados."
  }
];

export function PainPoints() {
  return (
    <section className="py-24 bg-brand-soft overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-black text-brand-black mb-6 tracking-tighter">
            Não ignore o <span className="text-brand-red italic underline decoration-brand-pink/30 decoration-8">seu instinto.</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-snug font-medium">
            Nós sabemos o que é encarar o medo todos os dias. A realidade é dura, mas a sua proteção agora é uma escolha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="light-card p-10 rounded-[2rem] group hover:-translate-y-2 transition-all duration-500 cursor-default"
            >
              <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-red group-hover:rotate-6 transition-all duration-500">
                <scenario.icon className="w-8 h-8 text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-brand-black mb-4 tracking-tight leading-none">{scenario.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">{scenario.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 relative group"
        >
          {/* Quote Glow Effect */}
          <div className="absolute -inset-4 bg-brand-pink/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="p-12 md:p-20 rounded-[3rem] md:rounded-[4rem] bg-brand-black text-white text-center relative overflow-hidden shadow-2xl border border-white/5">
               {/* Atmospheric Backgrounds */}
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,45,85,0.15)_0%,transparent_70%)]" />
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-pink/5 blur-[100px] rounded-full" />
               
               <p className="text-2xl md:text-5xl font-display font-black italic relative z-10 leading-[1.1] tracking-tighter">
                  "Esteja pronta antes que <br/> 
                  <span className="text-brand-pink text-glow">o inesperado aconteça."</span>
               </p>
               
               <div className="mt-8 flex justify-center gap-2 relative z-10 opacity-30">
                  <div className="w-12 h-1 bg-brand-pink rounded-full" />
                  <div className="w-4 h-1 bg-white/20 rounded-full" />
                  <div className="w-4 h-1 bg-white/20 rounded-full" />
               </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
