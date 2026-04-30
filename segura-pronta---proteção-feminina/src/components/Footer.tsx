import React from 'react';
import { Shield, ShieldAlert, BadgeCheck, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-black pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Shield className="w-8 h-8 text-brand-pink" />
              <span className="font-display font-extrabold text-2xl tracking-tighter">PROTEJA-SE</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0 leading-relaxed">
              Nossa missão é devolver a liberdade e a segurança para todas as mulheres, através de tecnologia discreta e eficaz.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 bg-white/5 p-8 rounded-3xl border border-white/10">
             <BadgeCheck className="w-10 h-10 text-brand-pink" />
             <div className="text-center">
                <h4 className="font-bold text-lg">7 dias de Garantia</h4>
                <p className="text-xs text-gray-500 mt-1">Se você não se sentir mais segura, <br/> devolvemos 100% do seu dinheiro.</p>
             </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center gap-6">
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">
                        <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">SSL</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Safe</span>
                </div>
            </div>
            <p className="text-[11px] text-white/10 font-medium">© 2026 Guardiana Pro. Todos os direitos reservados.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] text-white/20 font-bold uppercase tracking-widest border-t border-white/5 pt-10">
            <a href="#" className="hover:text-brand-pink transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-brand-pink transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-brand-pink transition-colors">Contato</a>
            <a href="#" className="hover:text-brand-pink transition-colors">Trocas e Devoluções</a>
        </div>
      </div>
    </footer>
  );
}
