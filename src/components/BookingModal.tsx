import React, { useState, useEffect } from 'react';
import { Service, Booking, BlockedSlot, Campaign, AVAILABLE_HOURS } from '../types';
import { X, Calendar, Clock, User, Phone, AlignLeft, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  campaigns: Campaign[];
  blockedSlots: BlockedSlot[];
  bookings: Booking[];
  onSubmitBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
  initialServiceId?: string | null;
  initialDate?: string;
  initialTime?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  services,
  campaigns,
  blockedSlots,
  bookings,
  onSubmitBooking,
  initialServiceId,
  initialDate,
  initialTime,
}: BookingModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const parseDateSafe = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date();
  };

  const getMonthName = (monthIndex: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthIndex];
  };

  // Initialize form fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setClientName('');
      setClientPhone('');
      setNotes('');
      setIsSuccess(false);
      setIsSubmitting(false);

      // Pre-fill service, date, time if provided
      const targetServiceId = initialServiceId || (services.length > 0 ? services[0].id : '');
      setSelectedServiceId(targetServiceId);

      // Set date and time
      setSelectedDate(initialDate || '');
      setSelectedTime(initialTime || '');

      const baseDate = initialDate ? parseDateSafe(initialDate) : new Date();
      setViewDate(baseDate);
    }
  }, [isOpen, initialServiceId, initialDate, initialTime, services]);

  if (!isOpen) return null;

  const activeService = services.find(s => s.id === selectedServiceId);
  const activeCampaign = campaigns.find(c => c.serviceId === selectedServiceId);

  // Helper: check if a full day is blocked
  const isDayBlocked = (dateStr: string) => {
    return blockedSlots.some(slot => slot.date === dateStr && !slot.time);
  };

  // Helper: check if a specific time is blocked
  const isTimeBlocked = (dateStr: string, timeStr: string) => {
    const isSpecificBlocked = blockedSlots.some(slot => slot.date === dateStr && slot.time === timeStr);
    const isAlreadyBooked = bookings.some(
      b => b.date === dateStr && b.time === timeStr && b.status !== 'cancelado'
    );
    return isSpecificBlocked || isAlreadyBooked;
  };

  // Generate the next 365 available days for booking (releasing all days, including Sundays, up to 1 year in the future)
  const getAvailableDates = () => {
    if (activeCampaign) {
      // Campaigns have predefined dates
      return activeCampaign.dates.map(d => ({
        value: d,
        label: formatLabelDate(d),
        isCampaign: true,
      }));
    }

    const list = [];
    const today = new Date();
    
    for (let i = 0; i <= 365; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const day = String(nextDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      if (isDayBlocked(dateStr)) continue; // Skip fully blocked days

      list.push({
        value: dateStr,
        label: formatLabelDate(dateStr),
        isCampaign: false,
      });
    }
    return list;
  };

  const formatLabelDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const dayAndMonth = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `${dayAndMonth} (${weekday})`;
  };

  // Get available times for selected date
  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    
    const times = activeCampaign?.hours && activeCampaign.hours.length > 0
      ? activeCampaign.hours
      : AVAILABLE_HOURS;

    return times.map(time => ({
      value: time,
      isBlocked: isTimeBlocked(selectedDate, time),
    }));
  };

  // If service changes and campaign status changes, reset date and time if they aren't compatible
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !selectedServiceId || !selectedDate || !selectedTime) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitBooking({
        serviceId: selectedServiceId,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: '',
        date: selectedDate,
        time: selectedTime,
        status: 'pendente',
        notes: notes.trim(),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao registrar seu agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimes();

  // Create a set for quick available date lookups
  const availableDatesSet = new Set(availableDates.map(d => d.value));

  // Determine current calendar view variables
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // First day of view month (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in view month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Build calendar cells
  const calendarDays: Array<{ day: number; dateStr: string } | null> = [];
  
  // Empty padding cells for preceding month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }

  // Real days of the month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    calendarDays.push({
      day,
      dateStr,
    });
  }

  // Check navigation range
  const todayDateObj = new Date();
  const minMonthDate = new Date(todayDateObj.getFullYear(), todayDateObj.getMonth(), 1);

  const maxAvailableDate = availableDates.reduce((max, curr) => {
    const currDate = parseDateSafe(curr.value);
    return currDate > max ? currDate : max;
  }, todayDateObj);
  const maxMonthDate = new Date(maxAvailableDate.getFullYear(), maxAvailableDate.getMonth(), 1);

  const canGoPrev = new Date(year, month, 1) > minMonthDate;
  const canGoNext = new Date(year, month, 1) < maxMonthDate;

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gold-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gold-100 overflow-hidden animate-fade-in z-10 my-8"
        id="public-booking-modal"
      >
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gold-500 hover:text-gold-900 hover:bg-gold-50 transition cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif text-2xl text-gold-950 font-normal">Agendamento Solicitado!</h4>
              <p className="text-xs text-gold-800 font-light leading-relaxed max-w-md mx-auto">
                Registramos seu pré-agendamento no nosso sistema. Agora, clique no botão abaixo para nos enviar a confirmação diretamente no WhatsApp.
              </p>
            </div>

            <div className="bg-gold-50/50 rounded-2xl p-4 border border-gold-100 text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <p className="text-gold-900"><strong>Procedimento:</strong> {activeService?.name}</p>
              <p className="text-gold-900"><strong>Data:</strong> {formatLabelDate(selectedDate)}</p>
              <p className="text-gold-900"><strong>Horário:</strong> {selectedTime}</p>
              <p className="text-gold-900"><strong>Cliente:</strong> {clientName}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gold-900 hover:bg-gold-950 text-white font-sans text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition shadow-md"
            >
              Concluir
            </button>
          </div>
        ) : (
          /* Booking Form Screen */
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="space-y-1.5 text-left">
              <span className="text-[9px] font-sans tracking-[0.25em] text-gold-500 uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-500" />
                Agendar Horário
              </span>
              <h4 className="font-serif text-2xl text-gold-950 font-normal tracking-wide">Escolha seu procedimento</h4>
              <p className="text-xs text-gold-800 font-light">
                Agende online em poucos segundos. Registraremos sua vaga e abriremos o WhatsApp para finalizar.
              </p>
            </div>

            <div className="space-y-4">
              {/* Client Name */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-900 block">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Oliveira"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-gold-50/30 border border-gold-100 focus:border-gold-500 focus:outline-hidden rounded-xl py-2.5 pl-10 pr-4 text-xs text-gold-950"
                  />
                </div>
              </div>

              {/* Client Phone */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-900 block">
                  Seu Telefone (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Ex: (61) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-gold-50/30 border border-gold-100 focus:border-gold-500 focus:outline-hidden rounded-xl py-2.5 pl-10 pr-4 text-xs text-gold-950"
                  />
                </div>
              </div>

              {/* Service selection */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-900 block">
                  Procedimento Desejado *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 focus:outline-hidden rounded-xl py-2.5 px-3 text-xs text-gold-950 cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - R$ {s.price.toFixed(2).replace('.', ',')} ({s.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-900 block">
                  {activeCampaign ? '1. Escolha um Dia da Agenda Especial *' : '1. Escolha o Dia do Atendimento *'}
                </label>
                {availableDates.length > 0 ? (
                  <div className="border border-gold-100 rounded-2xl p-4 bg-white/50 shadow-xs space-y-4">
                    {/* Month Header */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        disabled={!canGoPrev}
                        onClick={handlePrevMonth}
                        className={`p-1.5 rounded-full border border-gold-100 text-gold-900 transition-all ${
                          !canGoPrev ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gold-50 cursor-pointer'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-serif text-xs font-medium text-gold-950 uppercase tracking-wider">
                        {getMonthName(month)} {year}
                      </span>
                      <button
                        type="button"
                        disabled={!canGoNext}
                        onClick={handleNextMonth}
                        className={`p-1.5 rounded-full border border-gold-100 text-gold-900 transition-all ${
                          !canGoNext ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gold-50 cursor-pointer'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weekdays header */}
                    <div className="grid grid-cols-7 gap-1 text-center select-none" translate="no">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                        <span key={d} className="text-[9px] font-sans font-bold text-gold-500 uppercase tracking-widest notranslate" translate="no">
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {calendarDays.map((dayObj, index) => {
                        if (dayObj === null) {
                          return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const isAvailable = availableDatesSet.has(dayObj.dateStr);
                        const isSelected = selectedDate === dayObj.dateStr;

                        return (
                          <button
                            key={dayObj.dateStr}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => {
                              setSelectedDate(dayObj.dateStr);
                              setSelectedTime(''); // Reset time on date change
                            }}
                            className={`aspect-square flex flex-col items-center justify-center text-xs rounded-full transition-all relative ${
                              isAvailable
                                ? isSelected
                                  ? 'bg-gold-900 text-white font-bold shadow-md cursor-pointer scale-105 border border-gold-900'
                                  : 'bg-gold-50/50 border border-gold-100/50 text-gold-950 font-medium hover:bg-gold-100 cursor-pointer'
                                : 'text-neutral-300 font-light cursor-not-allowed hover:bg-neutral-50/10'
                            }`}
                          >
                            <span>{dayObj.day}</span>
                            {isAvailable && !isSelected && (
                              <span className="absolute bottom-1 w-1 h-1 bg-gold-400 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-red-500 font-light">Nenhum dia disponível nos próximos dias. Por favor, fale conosco no WhatsApp.</p>
                )}
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="space-y-2 text-left animate-fade-in">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-900 block">
                    2. Escolha o Horário Disponível *
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 p-1 border border-gold-100/50 rounded-xl bg-gold-50/20">
                    {availableTimes.map((timeObj) => {
                      const isSelected = selectedTime === timeObj.value;
                      return (
                        <button
                          key={timeObj.value}
                          type="button"
                          disabled={timeObj.isBlocked}
                          onClick={() => setSelectedTime(timeObj.value)}
                          className={`text-[10px] font-mono py-2 rounded-lg transition-all font-semibold ${
                            timeObj.isBlocked
                              ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed line-through opacity-60'
                              : isSelected
                              ? 'bg-gold-900 text-white shadow-xs cursor-pointer'
                              : 'bg-white border border-gold-100 text-gold-900 hover:bg-gold-50 cursor-pointer'
                          }`}
                        >
                          {timeObj.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-900 block">
                  Observações ou Restrições (Opcional)
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gold-400" />
                  <textarea
                    placeholder="Ex: Alergias, preferência por profissional, detalhes adicionais..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-gold-50/30 border border-gold-100 focus:border-gold-500 focus:outline-hidden rounded-xl py-2 pl-10 pr-4 text-xs text-gold-950 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* CTA Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedDate || !selectedTime}
              className="w-full bg-gold-900 hover:bg-gold-950 disabled:bg-neutral-300 disabled:text-neutral-500 text-white font-sans text-xs font-bold tracking-widest uppercase py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Registrando...' : 'Confirmar e Abrir WhatsApp'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
