import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { DollarSign, Upload, Calendar, Check, X, ShieldAlert, CreditCard } from 'lucide-react';

export const SaleRegistrationModal: React.FC = () => {
  const { activeModal, modalLead, closeModal, courses, registerSale } = useCRM();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [totalAmount, setTotalAmount] = useState<number>(courses[0]?.regularPrice || 850);
  const [amountPaid, setAmountPaid] = useState<number>(150);
  const [enrollmentAmount, setEnrollmentAmount] = useState<number>(50);
  const [discount, setDiscount] = useState<number>(100);
  const [metodoPago, setMetodoPago] = useState<'transfer' | 'cash' | 'card'>('transfer');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [saleOrigin, setSaleOrigin] = useState<'llamada' | 'whatsapp' | 'evento' | 'otro'>('whatsapp');
  const [cohortName, setCohortName] = useState(courses[0]?.cohortName || '');
  const [installmentsCount, setInstallmentsCount] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  useEffect(() => {
    if (selectedCourse) {
      const promoDisc = selectedCourse.activePromoDiscount || 0;
      setDiscount(promoDisc);
      const finalPrice = selectedCourse.regularPrice - promoDisc;
      setTotalAmount(finalPrice);
      setEnrollmentAmount(selectedCourse.enrollmentFee);
      setCohortName(selectedCourse.cohortName);
    }
  }, [selectedCourseId, selectedCourse]);

  if (activeModal !== 'sale' || !modalLead) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const remainingBalance = Math.max(0, totalAmount - amountPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptNumber.trim()) {
      alert('El número de comprobante es obligatorio (incluso para pagos en efectivo).');
      return;
    }

    registerSale({
      leadId: modalLead.id,
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      amountPaid: Number(amountPaid),
      totalAmount: Number(totalAmount),
      enrollmentAmount: Number(enrollmentAmount),
      discount: Number(discount),
      receiptNumber: receiptNumber.trim(),
      receiptImage: receiptPreview || undefined,
      metodoPago,
      saleOrigin,
      cohortName,
      notes: notes.trim(),
      installmentsCount: Number(installmentsCount),
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-[#E50914] dark:bg-[#E50914]/15 dark:text-[#E50914] border border-red-200 dark:border-[#E50914]/25">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F9FAFB]">Registrar Cierre de Venta</h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Cliente: <strong className="text-slate-900 dark:text-white font-bold">{modalLead.fullName}</strong> · {modalLead.phoneNumber}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 dark:text-[#94A3B8] hover:text-slate-700 dark:hover:text-[#F9FAFB] hover:bg-slate-100 dark:hover:bg-[#1A2337]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Course selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Servicio / Programa Krake
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20 cursor-pointer"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} (${course.regularPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Cohorte / Generación Académica
              </label>
              <input
                type="text"
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* Pricing grid */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2B3E] grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-500 dark:text-[#64748B] font-semibold block mb-1">Precio Regular</span>
              <div className="font-mono text-sm font-bold text-slate-400 dark:text-[#94A3B8] line-through tabular-nums">
                ${selectedCourse?.regularPrice}
              </div>
            </div>

            <div>
              <span className="text-slate-500 dark:text-[#64748B] font-semibold block mb-1">Descuento Promo</span>
              <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                -${discount}
              </div>
            </div>

            <div>
              <span className="text-slate-700 dark:text-[#94A3B8] font-bold block mb-1">Total a Pagar</span>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#121927] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded p-1.5 font-mono text-sm font-bold tabular-nums"
              />
            </div>

            <div>
              <span className="text-slate-700 dark:text-[#94A3B8] font-bold block mb-1">Abono Inicial ($)</span>
              <input
                type="number"
                required
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#121927] border border-red-400 dark:border-[#E50914]/50 rounded p-1.5 font-mono text-sm font-bold text-[#E50914] tabular-nums"
              />
            </div>
          </div>

          {/* Payment Method & Mandatory Receipt Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Método de Pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as any)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              >
                <option value="transfer">Transferencia Bancaria</option>
                <option value="card">Tarjeta de Crédito / Débito</option>
                <option value="cash">Efectivo (Depósito en Caja)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase">
                  N° Comprobante / Depósito <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  Obligatorio (Incluso en efectivo)
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="Ej: TRANSF-PICHINCHA-982341 / CAJA-0041"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* Installments & Origin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Canal de Cierre
              </label>
              <select
                value={saleOrigin}
                onChange={(e) => setSaleOrigin(e.target.value as any)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              >
                <option value="whatsapp">💬 Conversación WhatsApp</option>
                <option value="llamada">📞 Llamada Telefónica</option>
                <option value="evento">🎟️ Masterclass / Evento</option>
                <option value="otro">🌐 Otro Canal</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Plan de Pagos (Saldo Restante: ${remainingBalance})
              </label>
              <select
                value={installmentsCount}
                onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              >
                <option value={1}>Pago Único de Contado (Sin cuotas pendientes)</option>
                <option value={2}>2 Cuotas Mensuales (${Math.round(remainingBalance / 2)} c/u)</option>
                <option value={3}>3 Cuotas Mensuales (${Math.round(remainingBalance / 3)} c/u)</option>
                <option value={4}>4 Cuotas Mensuales (${Math.round(remainingBalance / 4)} c/u)</option>
              </select>
            </div>
          </div>

          {/* Simulated File Upload for Voucher */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
              Adjuntar Comprobante de Pago (Voucher / Foto / PDF)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-[#1F2B3E] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-slate-400 dark:hover:border-[#2D3F5C] transition-colors bg-slate-50 dark:bg-[#0B0F19]">
              <Upload className="w-6 h-6 text-slate-400 dark:text-[#64748B] mb-1" />
              <p className="text-xs font-semibold text-slate-700 dark:text-[#F9FAFB]">
                {receiptPreview ? '✅ Comprobante cargado correctamente' : 'Haz clic para seleccionar comprobante'}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-[#64748B] mt-0.5">Formatos JPG, PNG o PDF</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="opacity-0 absolute w-full h-full cursor-pointer inset-0"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
              Notas Adicionales de la Venta
            </label>
            <textarea
              rows={2}
              placeholder="Detalles sobre facilidades de pago o acuerdos de fecha..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-white dark:bg-[#1A2337] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1F2B3E] font-semibold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
            >
              <Check className="w-4 h-4" />
              <span>Registrar Venta Oficial</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
