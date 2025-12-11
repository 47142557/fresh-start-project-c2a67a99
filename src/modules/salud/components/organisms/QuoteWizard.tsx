import React, { useState, useEffect } from 'react';
import { X, User, Users, Minus, Plus, CheckCircle, ArrowRight, Lock, Phone, MessageCircle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface QuoteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (data: any) => void;
}

export const QuoteWizard = ({ isOpen, onClose, onComplete }: QuoteWizardProps) => {
  const [step, setStep] = useState(1);
  const [workMode, setWorkMode] = useState<'priv' | 'rel'>('rel');
  const [salary, setSalary] = useState('');
  const [ages, setAges] = useState({ titular: 30, pareja: 30, hijos: 0 });
  const [familyType, setFamilyType] = useState<'individual' | 'pareja'>('individual');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'call'>('whatsapp');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1); setSalary(''); setWorkMode('rel');
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = step === 1 ? '33%' : step === 2 ? '66%' : '100%';

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) { setSalary(''); return; }
    setSalary(new Intl.NumberFormat('es-AR').format(parseInt(rawValue, 10)));
  };

  const handleFinish = () => {
    if (onComplete) onComplete({ familyType, ages, workMode, salary, contact: { ...formData, method: contactMethod } });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative flex flex-col min-h-[550px] animate-in zoom-in-95 duration-300">
        {/* HEADER */}
        <div className="px-8 pt-6 pb-2 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {step === 1 && "Grupo Familiar"}
              {step === 2 && "Forma de Ingreso"}
              {step === 3 && "Tus Datos"}
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 transition-all duration-500 ease-out rounded-full" style={{ width: progress }} />
          </div>
        </div>

        {/* BODY */}
        <div className="p-8 flex-grow flex flex-col justify-between overflow-y-auto">
          {step === 1 && (
            <div className="flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-300">
              <p className="text-sm text-slate-500 mb-6 font-medium">Seleccioná quiénes estarán cubiertos.</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button onClick={() => setFamilyType('individual')} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${familyType === 'individual' ? 'border-teal-600 bg-teal-50 shadow-sm' : 'border-slate-100 bg-white hover:border-teal-200 text-slate-400'}`}>
                  <User size={32} className={familyType === 'individual' ? 'text-teal-600' : 'text-current'} />
                  <span className={`text-sm font-bold ${familyType === 'individual' ? 'text-teal-900' : 'text-slate-600'}`}>Individual</span>
                </button>
                <button onClick={() => setFamilyType('pareja')} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${familyType === 'pareja' ? 'border-teal-600 bg-teal-50 shadow-sm' : 'border-slate-100 bg-white hover:border-teal-200 text-slate-400'}`}>
                  <Users size={32} className={familyType === 'pareja' ? 'text-teal-600' : 'text-current'} />
                  <span className={`text-sm font-bold ${familyType === 'pareja' ? 'text-teal-900' : 'text-slate-600'}`}>Pareja</span>
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700 text-sm">Tu Edad</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setAges({...ages, titular: Math.max(18, ages.titular - 1)})} className="w-9 h-9 rounded-full bg-white border border-slate-200 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition shadow-sm"><Minus size={16} strokeWidth={3} /></button>
                        <span className="text-xl font-bold text-slate-900 w-8 text-center">{ages.titular}</span>
                        <button onClick={() => setAges({...ages, titular: ages.titular + 1})} className="w-9 h-9 rounded-full bg-white border border-slate-200 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition shadow-sm"><Plus size={16} strokeWidth={3} /></button>
                    </div>
                </div>
                {familyType === 'pareja' && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2 fade-in">
                        <span className="font-bold text-slate-700 text-sm">Edad Pareja</span>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setAges({...ages, pareja: Math.max(18, ages.pareja - 1)})} className="w-9 h-9 rounded-full bg-white border border-slate-200 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition shadow-sm"><Minus size={16} strokeWidth={3} /></button>
                            <span className="text-xl font-bold text-slate-900 w-8 text-center">{ages.pareja}</span>
                            <button onClick={() => setAges({...ages, pareja: ages.pareja + 1})} className="w-9 h-9 rounded-full bg-white border border-slate-200 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition shadow-sm"><Plus size={16} strokeWidth={3} /></button>
                        </div>
                    </div>
                )}
              </div>
              <div className="mt-auto pt-8">
                <Button onClick={() => setStep(2)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-xl text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">Siguiente <ArrowRight size={20} /></Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-300">
               <p className="text-sm text-slate-500 mb-6 font-medium">¿Cómo vas a contratar el plan?</p>
               <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-xl mb-10">
                  <button onClick={() => setWorkMode('rel')} className={`py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${workMode === 'rel' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Rel. Dependencia</button>
                  <button onClick={() => setWorkMode('priv')} className={`py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${workMode === 'priv' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Particular</button>
               </div>
               {workMode === 'rel' ? (
                 <div className="animate-in fade-in zoom-in-95 duration-300">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-6 text-center">Ingresá tu Sueldo Bruto</label>
                    <div className="relative max-w-[280px] mx-auto group">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-300 group-focus-within:text-teal-500 transition-colors">$</span>
                        <input type="tel" value={salary} onChange={handleSalaryChange} placeholder="0" autoFocus className="w-full pl-8 pr-4 py-2 text-4xl font-bold text-center text-teal-900 border-b-2 border-slate-200 focus:border-teal-600 outline-none bg-transparent placeholder:text-slate-200 transition-colors" />
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-6 max-w-xs mx-auto">Usaremos este dato para calcular cuánto derivás de aportes.</p>
                 </div>
               ) : (
                 <div className="text-center py-8 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in zoom-in-95">
                    <Info size={24} className="text-blue-600 mx-auto mb-3" />
                    <h3 className="text-blue-900 font-bold mb-1">Modo Particular</h3>
                    <p className="text-sm font-medium text-blue-700/80 px-4">Abonarás el 100% del valor de la cuota + IVA.</p>
                 </div>
               )}
               <div className="mt-auto pt-6 flex gap-3">
                  <Button onClick={() => setStep(1)} variant="ghost" className="w-1/3 h-14 rounded-xl text-slate-500 font-bold hover:bg-slate-100">Atrás</Button>
                  <Button onClick={() => setStep(3)} className="w-2/3 h-14 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-100 transition-all active:scale-95">Ver Precios</Button>
               </div>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-300">
               <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-600 rounded-full mb-4 shadow-sm"><CheckCircle size={28} strokeWidth={3} /></div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">¡Cotización Lista!</h3>
                  <p className="text-sm text-slate-500 mt-1">Encontramos <span className="text-teal-600 font-bold">14 planes</span> ideales para vos.</p>
               </div>
               <div className="space-y-5">
                  <div className="relative group">
                    <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="peer w-full bg-slate-50 border border-slate-200 rounded-xl px-4 pt-5 pb-2 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder-shown:pt-3.5" placeholder=" " />
                    <label htmlFor="name" className="absolute left-4 top-3.5 text-slate-400 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-placeholder-shown:top-3.5 pointer-events-none peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-bold peer-focus:-translate-y-2.5 peer-focus:text-teal-600">Nombre Completo</label>
                  </div>
                  <div className="relative group">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-300 pr-2 h-6"><span className="text-lg leading-none">🇦🇷</span><span className="text-sm font-bold text-slate-600">+54</span></div>
                     <input type="tel" id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="peer w-full bg-slate-50 border border-slate-200 rounded-xl pl-24 pr-4 pt-5 pb-2 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder-shown:pt-3.5" placeholder=" " />
                     <label htmlFor="phone" className="absolute left-24 top-3.5 text-slate-400 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-placeholder-shown:top-3.5 pointer-events-none peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-bold peer-focus:-translate-y-2.5 peer-focus:text-teal-600">Cod. Área + Celular</label>
                  </div>
               </div>
               <div className="mt-8 mb-4">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">¿Cómo preferís recibir los precios?</p>
                 <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer relative group">
                       <input type="radio" name="contact" className="peer sr-only" checked={contactMethod === 'whatsapp'} onChange={() => setContactMethod('whatsapp')} />
                       <div className="p-3 rounded-xl border-2 border-slate-100 bg-white peer-checked:border-green-500 peer-checked:bg-green-50 flex items-center justify-center gap-2 transition-all hover:border-slate-300"><MessageCircle className="text-green-600 w-5 h-5" /><span className="text-sm font-bold text-slate-600 peer-checked:text-green-800">WhatsApp</span></div>
                    </label>
                    <label className="cursor-pointer relative group">
                       <input type="radio" name="contact" className="peer sr-only" checked={contactMethod === 'call'} onChange={() => setContactMethod('call')} />
                       <div className="p-3 rounded-xl border-2 border-slate-100 bg-white peer-checked:border-blue-500 peer-checked:bg-blue-50 flex items-center justify-center gap-2 transition-all hover:border-slate-300"><Phone className="text-blue-600 w-5 h-5" /><span className="text-sm font-bold text-slate-600 peer-checked:text-blue-800">Llamado</span></div>
                    </label>
                 </div>
               </div>
               <div className="mt-auto pt-2">
                 <Button onClick={handleFinish} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 rounded-xl text-lg transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2 active:scale-95">Ver Precios Ahora</Button>
                 <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1.5 opacity-80"><Lock size={10} /> Tus datos están 100% protegidos.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};