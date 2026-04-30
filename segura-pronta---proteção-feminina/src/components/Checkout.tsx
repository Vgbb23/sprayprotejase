import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Smartphone, 
  QrCode, 
  Lock, 
  ShoppingBag,
  Clock,
  Truck,
  MapPin,
  Check
} from 'lucide-react';
import { fruitfyUtmPayload, getMergedMarketingParams, initMarketingParams } from '../utils/marketingParams';

interface CheckoutProps {
  onBack: () => void;
}

const ONLY_DIGITS = /\D/g;

const formatCep = (value: string) => {
  const digits = value.replace(ONLY_DIGITS, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatCpf = (value: string) => {
  const digits = value.replace(ONLY_DIGITS, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatPhone = (value: string) => {
  const digits = value.replace(ONLY_DIGITS, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const isValidCpf = (cpf: string) => {
  const digits = cpf.replace(ONLY_DIGITS, '');
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const calcDigit = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) total += Number(base[i]) * (factor - i);
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const first = calcDigit(digits.slice(0, 9), 10);
  const second = calcDigit(digits.slice(0, 10), 11);
  return first === Number(digits[9]) && second === Number(digits[10]);
};

const extractPixData = (payload: any) => {
  const source = payload?.data ?? payload ?? {};
  const buckets = [source, source.pix, source.charge, source.payment, source.payment_data, source.qr_code].filter(Boolean);

  const read = (keys: string[]) => {
    for (const item of buckets) {
      for (const key of keys) {
        const value = item?.[key];
        if (typeof value === 'string' && value.trim()) return value.trim();
      }
    }
    return '';
  };

  const visited = new Set<any>();
  const deepRead = (value: any, keys: string[]): string => {
    if (!value || typeof value !== 'object' || visited.has(value)) return '';
    visited.add(value);

    for (const key of keys) {
      const keyValue = value?.[key];
      if (typeof keyValue === 'string' && keyValue.trim()) return keyValue.trim();
    }

    for (const nested of Object.values(value)) {
      const found = deepRead(nested, keys);
      if (found) return found;
    }

    return '';
  };

  const pixCodeKeys = [
    'code',
    'pix_code',
    'pixCopyPaste',
    'pix_copy_paste',
    'copy_paste',
    'brcode',
    'qr_code_text',
    'payload',
    'emv',
    'pix_payload',
    'pix_payload_text',
  ];

  const qrKeys = [
    'qr_code_base64',
    'qr_code',
    'qrCode',
    'qr_code_image',
    'qr_code_url',
    'qrcode',
    'image',
    'base64',
  ];

  const pixCode = read(pixCodeKeys) || deepRead(source, pixCodeKeys);
  const qrRaw = read(qrKeys) || deepRead(source, qrKeys);
  const qrCode =
    qrRaw.startsWith('data:image') || qrRaw.startsWith('http')
      ? qrRaw
      : qrRaw
        ? `data:image/png;base64,${qrRaw}`
        : '';

  return { pixCode, qrCode, source };
};

/** UUID do pedido retornado em `POST /api/pix/charge` — usado em `GET /api/order/{order}` para acompanhar o status. */
const extractFruitfyOrderUuid = (payload: any): string => {
  const data = payload?.data ?? {};
  const raw =
    data.order_id ??
    data.uuid ??
    data.order_uuid ??
    data.order?.uuid ??
    data.order?.id ??
    '';
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : '';
};

const POST_PAYMENT_REDIRECT_URL = 'https://rastreiogummy.netlify.app/';
const PIX_STATUS_POLL_MS = 200;

const fruitfyApiHeaders = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_FRUITFY_API_TOKEN ?? ''}`,
  'Store-Id': import.meta.env.VITE_FRUITFY_STORE_ID ?? '',
  Accept: 'application/json',
  'Accept-Language': 'pt_BR',
});

/** Mensagem amigável a partir do JSON da Fruitfy (`message` ou `error`). */
const fruitfyChargeErrorMessage = (result: unknown): string => {
  if (!result || typeof result !== 'object') return 'Falha ao gerar PIX.';
  const r = result as Record<string, unknown>;
  const raw =
    (typeof r.message === 'string' && r.message.trim()) ||
    (typeof r.error === 'string' && r.error.trim()) ||
    '';
  const base = raw || 'Falha ao gerar PIX.';
  if (/invalid session token/i.test(base)) {
    return (
      'Token da API Fruitfy inválido ou expirado. Gere um token novo no painel Fruitfy, defina VITE_FRUITFY_API_TOKEN no arquivo .env na raiz do projeto e reinicie o servidor (Ctrl+C e npm run dev).'
    );
  }
  return base;
};

export function Checkout({ onBack }: CheckoutProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [shippingMethod, setShippingMethod] = useState<'free' | 'sedex'>('free');
  const [quantity, setQuantity] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [selectedOrderBumps, setSelectedOrderBumps] = useState<string[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [fruitfyOrderUuid, setFruitfyOrderUuid] = useState<string | null>(null);
  const [pixCopied, setPixCopied] = useState(false);
  const [pixError, setPixError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const ORDER_BUMPS = [
    {
      id: 'kit-auto-defesa',
      name: 'Kit Auto Defesa Completo',
      description: 'Um conjunto compacto e discreto que acompanha dispositivo portátil de proteção, alarme sonoro de emergência, acessório de impacto, ferramenta multifuncional, chaveiro touchless e estojo portátil.',
      price: 29.90,
      image: 'https://i.ibb.co/Q3XSX9Lm/image.png'
    },
    {
      id: 'aparelho-choque',
      name: 'Aparelho de Choque Teaser',
      description: 'Desenvolvido para oferecer uma solução prática e eficiente de defesa pessoal. Compacto e fácil de transportar, proporciona proteção não letal capaz de incapacitar temporariamente um agressor.',
      price: 39.90,
      image: 'https://i.ibb.co/xKk5HSRN/image.png'
    }
  ];

  // Auto-scroll to top on step change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    initMarketingParams();
  }, []);

  // Customer Info State
  const [customerName, setCustomerName] = useState('');

  // Address State
  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const UNIT_PRICE = 29.90;
  const SHIPPING_COST = shippingMethod === 'sedex' ? 19.53 : 0;
  const orderBumpsTotal = ORDER_BUMPS
    .filter(bump => selectedOrderBumps.includes(bump.id))
    .reduce((acc, bump) => acc + bump.price, 0);
    
  const originalPrice = (quantity * 97.00) + (selectedOrderBumps.length * 60);
  const totalPrice = (quantity * UNIT_PRICE) + SHIPPING_COST + orderBumpsTotal;
  const discountAmount = originalPrice - totalPrice;

  const [cepError, setCepError] = useState(false);

  useEffect(() => {
    if (step !== 4 || !fruitfyOrderUuid) return;

    let stopped = false;
    let inFlight = false;
    let intervalId = 0;

    const stopPolling = () => {
      stopped = true;
      if (intervalId) window.clearInterval(intervalId);
      intervalId = 0;
    };

    const checkOrderStatus = async () => {
      if (stopped || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch(
          `https://api.fruitfy.io/api/order/${encodeURIComponent(fruitfyOrderUuid)}`,
          { method: 'GET', headers: fruitfyApiHeaders() }
        );
        const result = await response.json();
        const order = result?.data ?? result ?? {};
        const status = typeof order.status === 'string' ? order.status : '';

        if (status === 'paid') {
          stopPolling();
          window.location.assign(POST_PAYMENT_REDIRECT_URL);
          return;
        }

        const terminal = new Set([
          'canceled',
          'cancelled',
          'refused',
          'failed',
          'chargeback',
          'refunded',
        ]);
        if (terminal.has(status)) {
          stopPolling();
        }
      } catch {
        // mantém polling; falhas de rede não bloqueiam o cliente
      } finally {
        inFlight = false;
      }
    };

    void checkOrderStatus();
    intervalId = window.setInterval(() => void checkOrderStatus(), PIX_STATUS_POLL_MS);
    return () => {
      stopPolling();
    };
  }, [step, fruitfyOrderUuid]);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(ONLY_DIGITS, '');
    if (cep.length > 8) cep = cep.slice(0, 8);
    
    setAddress(prev => ({ ...prev, cep }));
    setCepError(false);
    setValidationErrors((prev) => ({ ...prev, cep: '' }));
    setShowShippingOptions(false);

    if (cep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }));
          setShowShippingOptions(true);
          // Auto focus on number field after filling address
          setTimeout(() => {
            const numInput = document.getElementById('shipping-number');
            if (numInput) numInput.focus();
          }, 100);
        } else {
          setCepError(true);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setCepError(true);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const digitsPhone = customerPhone.replace(ONLY_DIGITS, '');
    const digitsCpf = customerCpf.replace(ONLY_DIGITS, '');
    const digitsCep = address.cep.replace(ONLY_DIGITS, '');

    if (customerName.trim().length < 3) errors.name = 'Informe o nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) errors.email = 'Informe um e-mail válido.';
    if (digitsPhone.length < 10 || digitsPhone.length > 11) errors.phone = 'Informe um telefone válido.';
    if (!isValidCpf(digitsCpf)) errors.cpf = 'CPF inválido. Confira os números.';
    if (digitsCep.length !== 8 || cepError) errors.cep = 'CEP inválido.';
    if (!address.street.trim()) errors.street = 'Informe o endereço.';
    if (!address.number.trim()) errors.number = 'Informe o número.';
    if (!address.neighborhood.trim()) errors.neighborhood = 'Informe o bairro.';
    if (!address.city.trim()) errors.city = 'Informe a cidade.';
    if (address.state.trim().length !== 2) errors.state = 'UF inválida.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGeneratePix = async () => {
    setPixError('');
    if (!validateForm()) {
      setPixError('Corrija os campos destacados para gerar o PIX.');
      return;
    }

    setIsGeneratingPix(true);
    try {
      const phoneDigits = customerPhone.replace(ONLY_DIGITS, '');
      const phoneForApi = phoneDigits.length === 11 ? `55${phoneDigits}` : phoneDigits;
      const utm = fruitfyUtmPayload(getMergedMarketingParams());
      const pixBody: Record<string, unknown> = {
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: phoneForApi,
        cpf: customerCpf.replace(ONLY_DIGITS, ''),
        items: [
          {
            id: import.meta.env.VITE_FRUITFY_PRODUCT_ID,
            value: Math.round(totalPrice * 100),
            quantity: 1,
          },
        ],
      };
      if (Object.keys(utm).length > 0) {
        pixBody.utm = utm;
      }

      const response = await fetch('https://api.fruitfy.io/api/pix/charge', {
        method: 'POST',
        headers: {
          ...fruitfyApiHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pixBody),
      });

      const result = await response.json();
      if (!response.ok || result?.success === false) {
        throw new Error(fruitfyChargeErrorMessage(result));
      }
      const parsed = extractPixData(result);
      if (!parsed.pixCode) {
        console.error('Resposta PIX incompleta:', parsed.source);
        throw new Error('A API retornou um PIX incompleto. Verifique token, Store-Id e produto na Fruitfy.');
      }
      const orderUuid = extractFruitfyOrderUuid(result);
      if (!orderUuid) {
        console.warn('Resposta PIX sem order_id: não será possível acompanhar o status automaticamente.');
      }
      setFruitfyOrderUuid(orderUuid || null);
      setPixCode(parsed.pixCode);
      setStep(4);
    } catch (error) {
      setPixError(error instanceof Error ? error.message : 'Erro inesperado ao gerar PIX.');
    } finally {
      setIsGeneratingPix(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#333] font-sans pb-20">
      {/* Header - Mercado Pago Style */}
      <header className="bg-white py-4 shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {step < 4 ? (
            <button 
              onClick={step === 1 ? onBack : () => setStep((s) => (s - 1) as any)}
              className="flex items-center gap-1 text-sm font-semibold text-[#009EE3] hover:opacity-70 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          ) : (
            <div className="w-20" /> // Spacer to balance logo
          )}
          
          {/* Logo Section */}
          <div className="flex items-center justify-center">
            <img 
              src="https://i.ibb.co/7NbWnQhS/image.png" 
              alt="Logo" 
              className="h-8 md:h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#009EE3]" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#009EE3]">Seguro</span>
          </div>
        </div>
      </header>

      {/* Product Selection Bar - Ultra Compact & Professional */}
      {step < 4 && (
        <div className="container mx-auto px-4 max-w-5xl pt-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 flex items-center gap-4 transition-all">
            {/* Small Product Thumb */}
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-lg flex items-center justify-center p-1.5 shrink-0 border border-gray-100">
              <img 
                src="https://i.ibb.co/6JnZRZCt/Gemini-Generated-Image-2upvp92upvp92upv-3.png" 
                alt="Produto" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xs md:text-sm font-bold text-[#333] leading-tight truncate uppercase">Guardiana Pro - Defesa Extra Forte</h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Premium 110ml</p>
              
              {/* Mobile-only Price */}
              <p className="text-[#009EE3] text-sm font-black italic sm:hidden mt-1">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </p>
            </div>
  
            {/* Quantity Selector - Compact */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-100 transition-all text-sm font-bold text-[#666] active:scale-95"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-xs text-[#1a1a1b]">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-100 transition-all text-sm font-bold text-[#666] active:scale-95"
              >
                +
              </button>
            </div>
  
            {/* Total Price - Far Right */}
            <div className="text-right hidden sm:block min-w-[100px]">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</p>
              <p className="text-[#009EE3] text-xl font-black italic">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-5xl mx-auto">
          {step === 4 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-[#E1F5FE]/30 p-6 flex items-center justify-center gap-3 text-[#009EE3] border-b border-gray-100">
                  <QrCode className="w-6 h-6" />
                  <h2 className="text-xl font-black uppercase tracking-tight">Pagamento Pendente</h2>
                </div>
                
                <div className="p-8 text-center space-y-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-[#E1F5FE] flex items-center justify-center text-[#009EE3]">
                      <Smartphone className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-gray-800 text-lg md:text-xl">Finalize seu pagamento</p>
                      <p className="text-[11px] md:text-sm text-gray-400 font-medium max-w-sm mx-auto">
                        Abra o app do seu banco, escolha Pix e cole o código abaixo para pagar.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#E8F5E9]/50 p-5 rounded-2xl border border-green-100 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <Truck className="w-4 h-4 shrink-0" />
                      <p className="text-[10px] font-bold uppercase tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        Envio prioritário ainda hoje para:
                      </p>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl border border-white shadow-sm space-y-2">
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tighter text-left">{customerName || 'Cliente'}</p>
                      <div className="flex items-start gap-2 text-gray-500 text-left">
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-medium leading-tight capitalize">
                          {address.street}, {address.number} {address.complement && `- ${address.complement}`} • {address.neighborhood} • {address.city}/{address.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ou copie e cole o código abaixo</p>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input 
                        readOnly 
                        value={pixCode} 
                        className="bg-transparent border-none text-[11px] font-mono text-gray-500 flex-1 overflow-hidden truncate" 
                      />
                      <motion.button 
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        animate={pixCopied ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(pixCode);
                            setPixCopied(true);
                            window.setTimeout(() => setPixCopied(false), 2200);
                          } catch {
                            setPixCopied(false);
                          }
                        }}
                        className={`bg-white p-3 rounded-lg border shadow-sm flex items-center gap-2 min-w-[104px] justify-center transition-colors ${
                          pixCopied ? 'border-green-400 text-green-700' : 'border-gray-200 text-[#009EE3] hover:bg-gray-100'
                        }`}
                      >
                        {pixCopied ? (
                          <Check className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                        ) : (
                          <Smartphone className="w-5 h-5 shrink-0" />
                        )}
                        <span className="font-bold text-xs">{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">1</div>
                      <p className="text-[11px] text-green-800 font-medium leading-relaxed">Seu pedido foi reservado e aguarda apenas o pagamento.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">2</div>
                      <p className="text-[11px] text-blue-800 font-medium leading-relaxed">Assim que o Pix for confirmado, enviaremos o código de rastreio.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-[#009EE3]">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Este código expira em 30:00</p>
                  </div>
                  <button 
                    onClick={onBack}
                    className="text-gray-400 text-xs font-semibold hover:text-[#333] transition-colors"
                  >
                    Voltar para o início
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column: Forms */}
              <div className="lg:col-span-2 space-y-4">
            
            {/* Step 1: Personal Info */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[#009EE3] text-white">1</div>
                  <h2 className="font-semibold text-lg">Dados Pessoais</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="Como no documento" 
                      className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
                    />
                    {validationErrors.name && <p className="text-[11px] text-red-500 mt-1">{validationErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="Para receber o rastreio"
                      className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {validationErrors.email && <p className="text-[11px] text-red-500 mt-1">{validationErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Celular / WhatsApp</label>
                    <input
                      type="text"
                      value={formatPhone(customerPhone)}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value.replace(ONLY_DIGITS, '').slice(0, 11));
                        setValidationErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="(00) 00000-0000"
                      className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {validationErrors.phone && <p className="text-[11px] text-red-500 mt-1">{validationErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CPF</label>
                    <input
                      type="text"
                      value={formatCpf(customerCpf)}
                      onChange={(e) => {
                        const digits = e.target.value.replace(ONLY_DIGITS, '').slice(0, 11);
                        setCustomerCpf(digits);
                        setValidationErrors((prev) => {
                          const next = { ...prev, cpf: '' };
                          if (digits.length === 11 && !isValidCpf(digits)) {
                            next.cpf = 'CPF inválido. Confira os números.';
                          }
                          return next;
                        });
                      }}
                      onBlur={() => {
                        const digits = customerCpf.replace(ONLY_DIGITS, '');
                        if (digits.length === 11 && !isValidCpf(digits)) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            cpf: 'CPF inválido. Confira os números.',
                          }));
                        }
                      }}
                      placeholder="000.000.000-00"
                      className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.cpf ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {validationErrors.cpf && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1.5">{validationErrors.cpf}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Shipping Address */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[#009EE3] text-white">2</div>
                  <h2 className="font-semibold text-lg">Endereço de Entrega</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CEP</label>
                    <input 
                      type="text" 
                      value={formatCep(address.cep)}
                      onChange={handleCepChange}
                      placeholder="00000-000" 
                      className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none transition-all ${(cepError || validationErrors.cep) ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
                    />
                    {loadingCep && <div className="absolute right-3 bottom-3 animate-spin rounded-full h-4 w-4 border-2 border-[#009EE3] border-t-transparent" />}
                    {(cepError || validationErrors.cep) && <span className="text-[10px] text-red-500 font-bold mt-1 absolute -bottom-5 left-0">{validationErrors.cep || 'CEP não encontrado'}</span>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Endereço</label>
                    <input 
                      type="text" 
                      value={address.street}
                      onChange={(e) => {
                        setAddress({...address, street: e.target.value});
                        setValidationErrors((prev) => ({ ...prev, street: '' }));
                      }}
                      placeholder="Rua, Avenida, etc" 
                      className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.street ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
                    />
                    {validationErrors.street && <p className="text-[11px] text-red-500 mt-1">{validationErrors.street}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número</label>
                    <input 
                      id="shipping-number"
                      type="text" 
                      value={address.number}
                      onChange={(e) => {
                        setAddress({...address, number: e.target.value});
                        setValidationErrors((prev) => ({ ...prev, number: '' }));
                      }}
                      placeholder="123" 
                      className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
                    />
                    {validationErrors.number && <p className="text-[11px] text-red-500 mt-1">{validationErrors.number}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Complemento</label>
                    <input 
                      type="text" 
                      value={address.complement}
                      onChange={(e) => setAddress({...address, complement: e.target.value})}
                      placeholder="Apto, Bloco, etc" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bairro</label>
                    <input 
                      type="text" 
                      value={address.neighborhood}
                      onChange={(e) => {
                        setAddress({...address, neighborhood: e.target.value});
                        setValidationErrors((prev) => ({ ...prev, neighborhood: '' }));
                      }}
                      placeholder="Seu bairro" 
                      className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.neighborhood ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
                    />
                    {validationErrors.neighborhood && <p className="text-[11px] text-red-500 mt-1">{validationErrors.neighborhood}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                      <input 
                        type="text" 
                        value={address.city}
                        onChange={(e) => {
                          setAddress({...address, city: e.target.value});
                          setValidationErrors((prev) => ({ ...prev, city: '' }));
                        }}
                        placeholder="Sua Cidade" 
                        className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
                      />
                      {validationErrors.city && <p className="text-[11px] text-red-500 mt-1">{validationErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">UF</label>
                      <input 
                        type="text" 
                        value={address.state}
                        onChange={(e) => {
                          setAddress({...address, state: e.target.value.toUpperCase().slice(0, 2)});
                          setValidationErrors((prev) => ({ ...prev, state: '' }));
                        }}
                        placeholder="SP" 
                        className={`w-full p-3 border rounded-md focus:ring-1 focus:ring-[#009EE3] outline-none ${validationErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
                      />
                      {validationErrors.state && <p className="text-[11px] text-red-500 mt-1">{validationErrors.state}</p>}
                    </div>
                  </div>
                </div>

                {showShippingOptions && (
                  <div className="mt-6 space-y-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Opções de Frete</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => setShippingMethod('free')}
                        className={`flex items-center justify-between p-4 border rounded-xl transition-all ${shippingMethod === 'free' ? 'border-[#009EE3] bg-[#E1F5FE]/20 ring-1 ring-[#009EE3]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'free' ? 'border-[#009EE3]' : 'border-gray-300'}`}>
                            {shippingMethod === 'free' && <div className="w-2.5 h-2.5 rounded-full bg-[#009EE3]" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold">Frete Grátis</p>
                            <p className="text-xs text-gray-500">Entrega em 7 a 10 dias úteis</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Grátis</span>
                      </button>

                      <button 
                        onClick={() => setShippingMethod('sedex')}
                        className={`flex items-center justify-between p-4 border rounded-xl transition-all ${shippingMethod === 'sedex' ? 'border-[#009EE3] bg-[#E1F5FE]/20 ring-1 ring-[#009EE3]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'sedex' ? 'border-[#009EE3]' : 'border-gray-300'}`}>
                            {shippingMethod === 'sedex' && <div className="w-2.5 h-2.5 rounded-full bg-[#009EE3]" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold">Frete SEDEX</p>
                            <p className="text-xs text-gray-500">Entrega em 1 a 2 dias úteis</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 tracking-tighter">R$ 19,53</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Order Bumps Section */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#009EE3]" />
                  <h3 className="text-lg font-semibold text-gray-800">Ofertas Exclusivas</h3>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    {ORDER_BUMPS.map((bump) => (
                      <div 
                        key={bump.id}
                        className={`relative border-2 rounded-xl p-3 sm:p-4 transition-all flex gap-3 sm:gap-4 cursor-pointer ${selectedOrderBumps.includes(bump.id) ? 'border-[#009EE3] bg-[#E1F5FE]/10 ring-1 ring-[#009EE3]' : 'border-dashed border-gray-300 hover:border-gray-400'}`}
                        onClick={() => {
                          if (selectedOrderBumps.includes(bump.id)) {
                            setSelectedOrderBumps(selectedOrderBumps.filter(id => id !== bump.id));
                          } else {
                            setSelectedOrderBumps([...selectedOrderBumps, bump.id]);
                          }
                        }}
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg shrink-0 overflow-hidden border border-gray-100 aspect-square">
                          <img src={bump.image} alt={bump.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-xs sm:text-sm leading-tight text-gray-800">{bump.name}</h4>
                              <div className="text-right shrink-0">
                                <p className="text-[10px] text-gray-400 line-through">R$ {(bump.price * 2.5).toFixed(2).replace('.', ',')}</p>
                                <p className="font-black text-[#009EE3] text-sm tracking-tighter">R$ {bump.price.toFixed(2).replace('.', ',')}</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{bump.description}</p>
                          </div>
                          
                          <button className={`w-full py-1.5 mt-2 rounded-md font-bold text-[9px] sm:text-xs uppercase tracking-widest transition-all ${selectedOrderBumps.includes(bump.id) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            {selectedOrderBumps.includes(bump.id) ? '✓ Adicionado' : '+ Adicionar Agora'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </section>

            {/* Step 3: Payment */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[#009EE3] text-white">3</div>
                <h2 className="font-semibold text-lg">Pagamento</h2>
              </div>
              
              <div className="p-0">
                {/* Pix Information Header */}
                <div className="p-5 border-b border-gray-100 bg-[#E1F5FE]/30 flex items-center gap-3 text-[#009EE3] font-bold">
                  <QrCode className="w-5 h-5" />
                  <span>Pagamento via Pix</span>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-[#E1F5FE] rounded-full flex items-center justify-center text-[#009EE3]">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">Finalizando com Pix</h3>
                      <p className="text-sm text-gray-500 mt-1">Ao clicar no botão abaixo, sua reserva será garantida e o código Pix gerado.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] text-white">✓</span>
                      </div>
                      <p className="text-xs text-green-700 font-medium">Sua compra é protegida e processada instantaneamente.</p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Ambiente 100% Seguro</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold">Resumo do pedido</h3>
              </div>
              
              <div className="p-5 space-y-5">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img 
                        src="https://i.ibb.co/6JnZRZCt/Gemini-Generated-Image-2upvp92upvp92upv-3.png" 
                        alt="Produto" 
                        className="w-16 h-16 object-cover rounded-md border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">{quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-tight">Guardiana Pro - Defesa Extra Forte 110ml</p>
                      <p className="text-xs text-green-600 font-bold mt-1">Lançamento Exclusivo</p>
                    </div>
                  </div>

                  {/* Render Selected Order Bumps in Summary */}
                  {ORDER_BUMPS.filter(bump => selectedOrderBumps.includes(bump.id)).map(bump => (
                    <div key={bump.id} className="flex gap-4 pt-3 mt-3 border-t border-gray-50">
                      <div className="relative">
                        <img 
                          src={bump.image} 
                          alt={bump.name} 
                          className="w-12 h-12 object-cover rounded-md border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-medium leading-tight">{bump.name}</p>
                        <p className="text-xs font-black text-[#009EE3] mt-0.5">R$ {bump.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-3 pt-3 border-t border-gray-50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({quantity}x)</span>
                    <span>R$ {originalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Desconto aplicado</span>
                    <span className="text-green-600">- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Frete {shippingMethod === 'sedex' ? 'SEDEX' : 'Nacional'}</span>
                    {shippingMethod === 'sedex' ? (
                      <span className="font-bold tracking-tighter">R$ 19,53</span>
                    ) : (
                      <span className="text-green-600 font-bold text-[10px] uppercase">Grátis</span>
                    )}
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-gray-200">
                    <span className="font-bold text-lg">Total a pagar</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#009EE3]">R$ {totalPrice.toFixed(2).replace('.', ',')}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Economia de R$ {discountAmount.toFixed(2).replace('.', ',')} hoje</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-md">
                   <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-700">Compra Garantida</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                          Receba seu produto ou seu dinheiro de volta. Site seguro com certificado SSL.
                        </p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleGeneratePix}
                  disabled={isGeneratingPix}
                  className="w-full bg-[#009EE3] disabled:opacity-70 disabled:cursor-not-allowed text-white font-black py-5 rounded-xl hover:bg-[#0089c7] transition-all shadow-lg text-lg uppercase tracking-wider"
                >
                  {isGeneratingPix ? 'Gerando PIX...' : 'Finalizar Compra'}
                </button>
                {pixError && <p className="text-xs text-red-500 font-semibold text-center">{pixError}</p>}
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3 text-gray-400">
                <p className="text-[9px] uppercase tracking-widest font-bold">Processamento seguro por Mercado Pago</p>
            </div>
            </div>
          </div>
          )}
        </div>
      </main>

      {/* Trust Badge Floating */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 bg-white border-t border-gray-100 flex justify-center items-center gap-4 z-40 lg:hidden">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Segurança de ponta a ponta</span>
          </div>
      </footer>
    </div>
  );
}

