import React, { useState, useEffect } from 'react';
import { CATEGORIES, AVAILABLE_HOURS, Booking, BlockedSlot, Service, ServiceCategory, Campaign } from '../types';
import {
  Calendar, CheckCircle, AlertCircle, XCircle, Trash2, TrendingUp, DollarSign,
  User, Sparkles, ShieldAlert, Key, ClipboardList, Ban, Plus, Clock, ExternalLink, RefreshCw, Edit,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin
} from 'lucide-react';
import { getEmbedUrl } from '../utils/map';

const formatPhone = (val: string) => {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

interface AdminPanelProps {
  bookings: Booking[];
  blockedSlots: BlockedSlot[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDeleteBooking: (id: string) => void;
  onAddBlockedSlot: (slot: BlockedSlot) => void;
  onRemoveBlockedSlot: (slot: BlockedSlot) => void;
  onAddManualBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  services: Service[];
  onAddService: (service: Service) => void;
  onDeleteService: (serviceId: string) => void;
  campaigns?: Campaign[];
  onAddCampaign?: (campaign: Campaign) => void;
  onDeleteCampaign?: (campaignId: string) => void;
  onClearAllBookings?: () => void;
  onClearAllServices?: () => void;
  ownerPhoto?: string;
  onUpdateOwnerPhoto?: (photoUrl: string, scale?: number, posX?: number, posY?: number) => void;
  photoScale?: number;
  photoX?: number;
  photoY?: number;
  address?: string;
  mapUrl?: string;
  onUpdateLocation?: (address: string, mapUrl: string) => void;
}

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

export default function AdminPanel({
  bookings,
  blockedSlots,
  onUpdateStatus,
  onDeleteBooking,
  onAddBlockedSlot,
  onRemoveBlockedSlot,
  onAddManualBooking,
  services,
  onAddService,
  onDeleteService,
  campaigns = [],
  onAddCampaign = () => {},
  onDeleteCampaign = () => {},
  onClearAllBookings = () => {},
  onClearAllServices = () => {},
  ownerPhoto = '',
  onUpdateOwnerPhoto = () => {},
  photoScale = 1,
  photoX = 0,
  photoY = 0,
  address = 'Quadra 14, Lote 19 - Lunabel 3A, Novo Gama - GO',
  mapUrl = 'https://www.google.com/maps/place/16%C2%B004\'36.2%22S+48%C2%B003\'49.1%22W/@-16.0787166,-48.073028,15.25z/data=!4m4!3m3!8m2!3d-16.0767072!4d-48.0636244?hl=pt-BR&entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D',
  onUpdateLocation = () => {},
}: AdminPanelProps) {
  // Owner photo local adjustment states
  const [localScale, setLocalScale] = useState(photoScale);
  const [localX, setLocalX] = useState(photoX);
  const [localY, setLocalY] = useState(photoY);

  // Location and address local states
  const [localAddress, setLocalAddress] = useState(address);
  const [localMapUrl, setLocalMapUrl] = useState(mapUrl);
  const [isLocationSaving, setIsLocationSaving] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    setLocalScale(photoScale);
    setLocalX(photoX);
    setLocalY(photoY);
  }, [photoScale, photoX, photoY]);

  useEffect(() => {
    setLocalAddress(address);
    setLocalMapUrl(mapUrl);
  }, [address, mapUrl]);

  // Authentication with robust password (removed one-click demo option)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Confirmation state for clearing all bookings
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Confirmation state for clearing all services
  const [showServicesResetConfirm, setShowServicesResetConfirm] = useState(false);

  // Service editing states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Admin filter states
  const [statusFilter, setStatusFilter] = useState<'todos' | Booking['status']>('todos');
  const [dateSearch, setDateSearch] = useState('');

  // Manual blocking slot form
  const [blockDate, setBlockDate] = useState('');
  const [blockTime, setBlockTime] = useState('');

  // Manual booking form state
  const [showManualForm, setShowManualForm] = useState(false);
  const [mServiceId, setMServiceId] = useState('');
  const [mClientName, setMClientName] = useState('');
  const [mClientPhone, setMClientPhone] = useState('');
  const [mClientEmail, setMClientEmail] = useState('');
  const [mDate, setMDate] = useState('');
  const [mTime, setMTime] = useState('');
  const [mNotes, setMNotes] = useState('');
  const [mErrors, setMErrors] = useState<string>('');

  // New service form state
  const [newServiceId, setNewServiceId] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceCategory>('facial');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [newServicePopular, setNewServicePopular] = useState(false);
  const [newServiceIsPackage, setNewServiceIsPackage] = useState(false);
  const [newServiceSessionsCount, setNewServiceSessionsCount] = useState('');
  const [newServiceIsCampaign, setNewServiceIsCampaign] = useState(false);
  const [newServiceCampDates, setNewServiceCampDates] = useState<string[]>([]);
  const [newServiceCampDateInput, setNewServiceCampDateInput] = useState('');
  const [newServiceCampHours, setNewServiceCampHours] = useState<string[]>([...AVAILABLE_HOURS]);
  const [serviceError, setServiceError] = useState('');
  const [serviceSuccess, setServiceSuccess] = useState('');

  // Campaign form states
  const [campServiceId, setCampServiceId] = useState('');
  const [campDateInput, setCampDateInput] = useState('');
  const [campDates, setCampDates] = useState<string[]>([]);
  const [campNotes, setCampNotes] = useState('');
  const [campError, setCampError] = useState('');
  const [campSuccess, setCampSuccess] = useState('');

  useEffect(() => {
    if (services.length > 0 && !campServiceId) {
      const hasLaser = services.find((s) => s.id === 'laser-day');
      setCampServiceId(hasLaser ? hasLaser.id : services[0].id);
    }
  }, [services, campServiceId]);

  useEffect(() => {
    if (services.length > 0 && !mServiceId) {
      setMServiceId(services[0].id);
    }
  }, [services, mServiceId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'AnaCarolEstetica#2026') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Senha de acesso incorreta! Use a senha forte definida.');
    }
  };

  const handleEditServiceClick = (s: Service) => {
    setEditingServiceId(s.id);
    setNewServiceId(s.id);
    setNewServiceName(s.name);
    setNewServiceDescription(s.description);
    setNewServiceCategory(s.category);
    setNewServicePrice(s.price.toString());
    setNewServiceDuration(s.duration.toString());
    setNewServicePopular(s.popular || false);
    setNewServiceIsPackage(s.isPackage || false);
    setNewServiceSessionsCount(s.sessionsCount ? s.sessionsCount.toString() : '');

    const camp = campaigns.find((c) => c.serviceId === s.id);
    if (camp) {
      setNewServiceIsCampaign(true);
      setNewServiceCampDates(camp.dates || []);
      setNewServiceCampHours(camp.hours || [...AVAILABLE_HOURS]);
    } else {
      setNewServiceIsCampaign(false);
      setNewServiceCampDates([]);
      setNewServiceCampHours([...AVAILABLE_HOURS]);
    }

    const formElement = document.getElementById('submit-new-service-btn');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setNewServiceId('');
    setNewServiceName('');
    setNewServiceDescription('');
    setNewServiceCategory('facial');
    setNewServicePrice('');
    setNewServiceDuration('');
    setNewServicePopular(false);
    setNewServiceIsPackage(false);
    setNewServiceSessionsCount('');
    setNewServiceIsCampaign(false);
    setNewServiceCampDates([]);
    setNewServiceCampDateInput('');
    setNewServiceCampHours([...AVAILABLE_HOURS]);
  };

  // Financial and statistics calculations
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pendente').length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmado').length;
  
  // Calculate total projected/confirmed revenue
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmado' || b.status === 'concluido')
    .reduce((sum, b) => {
      const s = services.find((service) => service.id === b.serviceId);
      return sum + (s ? s.price : 0);
    }, 0);

  // Find most popular service
  const serviceStats: Record<string, number> = {};
  bookings.forEach((b) => {
    serviceStats[b.serviceId] = (serviceStats[b.serviceId] || 0) + 1;
  });
  let mostPopularServiceId = '';
  let maxCount = 0;
  Object.entries(serviceStats).forEach(([id, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostPopularServiceId = id;
    }
  });
  const popularService = services.find((s) => s.id === mostPopularServiceId);

  // Filtered Bookings list for table
  const filteredBookings = bookings
    .filter((b) => {
      const matchesStatus = statusFilter === 'todos' || b.status === statusFilter;
      const matchesDate = !dateSearch || b.date === dateSearch;
      return matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // Sort bookings: pending first, then by date, then by time
      if (a.status === 'pendente' && b.status !== 'pendente') return -1;
      if (a.status !== 'pendente' && b.status === 'pendente') return 1;
      return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    });

  // Handle blocking off date/time
  const handleBlockSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;
    onAddBlockedSlot({
      date: blockDate,
      time: blockTime || undefined,
    });
    setBlockDate('');
    setBlockTime('');
  };

  // Handle adding manual booking (telephone/whatsapp client)
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mClientName || !mClientPhone || !mDate || !mTime) {
      setMErrors('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    onAddManualBooking({
      serviceId: mServiceId,
      clientName: mClientName,
      clientPhone: mClientPhone,
      clientEmail: mClientEmail || 'Não informado',
      date: mDate,
      time: mTime,
      status: 'confirmado', // Manually added are auto-confirmed by owner
      notes: mNotes ? `${mNotes} (Adicionado manualmente)` : 'Adicionado manualmente',
    });

    // Reset Form
    setMClientName('');
    setMClientPhone('');
    setMClientEmail('');
    setMDate('');
    setMTime('');
    setMNotes('');
    setMErrors('');
    setShowManualForm(false);
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServiceError('');
    setServiceSuccess('');

    if (!newServiceName.trim() || !newServiceDescription.trim() || !newServicePrice || !newServiceDuration) {
      setServiceError('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    let cleanId = '';
    if (editingServiceId) {
      cleanId = editingServiceId;
    } else {
      // Auto-generate safe slug from the name
      cleanId = newServiceName
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]/g, '-')     // replace non-alphanumeric with hyphens
        .replace(/-+/g, '-')             // compress consecutive hyphens
        .replace(/^-|-$/g, '');          // trim leading/trailing hyphens

      if (!cleanId) {
        cleanId = 's-' + Math.random().toString(36).substr(2, 9);
      } else {
        // If it exists, append a unique key to prevent clashes
        const idExists = services.some((s) => s.id === cleanId);
        if (idExists) {
          cleanId = `${cleanId}-${Math.random().toString(36).substr(2, 4)}`;
        }
      }
    }

    if (newServiceIsCampaign) {
      if (newServiceCampDates.length === 0) {
        setServiceError('Como você marcou este serviço como campanha, adicione pelo menos uma data de disponibilidade.');
        return;
      }
      if (newServiceCampHours.length === 0) {
        setServiceError('Por favor, selecione pelo menos um horário de atendimento para a campanha.');
        return;
      }
    }

    const priceNum = parseFloat(newServicePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setServiceError('Por favor, insira um preço válido.');
      return;
    }

    const durationNum = parseInt(newServiceDuration);
    if (isNaN(durationNum) || durationNum <= 0) {
      setServiceError('Por favor, insira uma duração válida em minutos.');
      return;
    }

    let sessionsCountNum: number | undefined = undefined;
    if (newServiceIsPackage) {
      const parsed = parseInt(newServiceSessionsCount);
      if (isNaN(parsed) || parsed <= 0) {
        setServiceError('Por favor, insira uma quantidade de sessões válida (maior que 0) para o pacote.');
        return;
      }
      sessionsCountNum = parsed;
    }

    const newService: Service = {
      id: cleanId,
      name: newServiceName.trim(),
      description: newServiceDescription.trim(),
      category: newServiceCategory,
      price: priceNum,
      duration: durationNum,
      popular: newServicePopular,
      isPackage: newServiceIsPackage,
    };

    if (newServiceIsPackage && sessionsCountNum !== undefined) {
      newService.sessionsCount = sessionsCountNum;
    }

    onAddService(newService);

    // Sync Special Agenda (Campaign)
    if (newServiceIsCampaign) {
      const existingCamp = campaigns.find((c) => c.serviceId === cleanId);
      const campId = existingCamp ? existingCamp.id : 'c-' + Math.random().toString(36).substr(2, 9);
      const newCamp: Campaign = {
        id: campId,
        serviceId: cleanId,
        dates: [...newServiceCampDates],
        hours: [...newServiceCampHours],
        notes: existingCamp?.notes || `Equipamento/agenda especial disponível exclusivamente nestas datas.`
      };
      onAddCampaign(newCamp);
    } else {
      const existingCamp = campaigns.find((c) => c.serviceId === cleanId);
      if (existingCamp) {
        onDeleteCampaign(existingCamp.id);
      }
    }

    setServiceSuccess(editingServiceId ? 'Serviço atualizado com sucesso no catálogo!' : 'Serviço adicionado com sucesso ao catálogo!');

    // Reset Form & Editing State
    setEditingServiceId(null);
    setNewServiceId('');
    setNewServiceName('');
    setNewServiceDescription('');
    setNewServiceCategory('facial');
    setNewServicePrice('');
    setNewServiceDuration('');
    setNewServicePopular(false);
    setNewServiceIsPackage(false);
    setNewServiceSessionsCount('');
    setNewServiceIsCampaign(false);
    setNewServiceCampDates([]);
    setNewServiceCampDateInput('');
    setNewServiceCampHours([...AVAILABLE_HOURS]);

    // Auto-clear success message after 3 seconds
    setTimeout(() => {
      setServiceSuccess('');
    }, 3000);
  };

  const handleAddNewServiceCampDate = () => {
    if (!newServiceCampDateInput) return;
    if (newServiceCampDates.includes(newServiceCampDateInput)) {
      setServiceError('Esta data já foi adicionada à lista desta campanha de serviço.');
      return;
    }
    setNewServiceCampDates([...newServiceCampDates, newServiceCampDateInput].sort());
    setNewServiceCampDateInput('');
    setServiceError('');
  };

  const handleRemoveNewServiceCampDate = (dateToRemove: string) => {
    setNewServiceCampDates(newServiceCampDates.filter((d) => d !== dateToRemove));
  };

  const handleToggleNewServiceCampHour = (hour: string) => {
    if (newServiceCampHours.includes(hour)) {
      setNewServiceCampHours(newServiceCampHours.filter((h) => h !== hour));
    } else {
      setNewServiceCampHours([...newServiceCampHours, hour].sort());
    }
  };

  const handleToggleAllNewServiceCampHours = () => {
    if (newServiceCampHours.length === AVAILABLE_HOURS.length) {
      setNewServiceCampHours([]);
    } else {
      setNewServiceCampHours([...AVAILABLE_HOURS]);
    }
  };

  const handleAddCampaignDate = () => {
    if (!campDateInput) return;
    if (campDates.includes(campDateInput)) {
      setCampError('Esta data já foi adicionada à lista desta campanha.');
      return;
    }
    setCampDates([...campDates, campDateInput].sort());
    setCampDateInput('');
    setCampError('');
  };

  const handleRemoveCampaignDate = (dateToRemove: string) => {
    setCampDates(campDates.filter((d) => d !== dateToRemove));
  };

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCampError('');
    setCampSuccess('');

    if (!campServiceId) {
      setCampError('Por favor, selecione um serviço para a campanha.');
      return;
    }

    if (campDates.length === 0) {
      setCampError('Por favor, adicione pelo menos uma data para a campanha.');
      return;
    }

    const newCamp: Campaign = {
      id: 'c-' + Math.random().toString(36).substr(2, 9),
      serviceId: campServiceId,
      dates: [...campDates],
      notes: campNotes.trim() || undefined,
    };

    onAddCampaign(newCamp);
    setCampSuccess('Campanha adicionada com sucesso!');
    
    // Reset Form
    setCampDates([]);
    setCampNotes('');
    setCampDateInput('');

    setTimeout(() => {
      setCampSuccess('');
    }, 3000);
  };

  // Helper to open WhatsApp conversation
  const getWhatsAppLink = (phone: string, clientName: string, date: string, time: string, serviceName: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const dateFormatted = new Date(date).toLocaleDateString('pt-BR');
    const msg = encodeURIComponent(
      `Olá ${clientName}, aqui é a Ana Caroline! Estou entrando em contato para confirmar seu agendamento de ${serviceName} para o dia ${dateFormatted} às ${time}. Está tudo certo para você?`
    );
    return `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${msg}`;
  };

  // UI layout for logged-out state (Login form)
  if (!isAuthenticated) {
    return (
      <div className="py-24 px-6 max-w-md mx-auto">
        <div className="bg-white border border-gold-100 rounded-3xl shadow-lg p-8 space-y-7 text-center">
          <div className="w-14 h-14 rounded-full bg-gold-50 border border-gold-100 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6 text-gold-500" />
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-2xl text-gold-950 font-light tracking-[0.1em] uppercase">
              Área Restrita
            </h4>
            <p className="text-xs font-sans text-gold-800 font-light leading-relaxed">
              Este painel de controle é restrito para a profissional <strong className="font-semibold text-gold-900">Ana Caroline</strong> para gerenciar seus agendamentos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-sans font-bold text-gold-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-gold-500" />
                <span>Senha de Acesso</span>
              </label>
              <input
                type="password"
                placeholder="Insira a senha de administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gold-100 focus:border-gold-500 focus:outline-hidden rounded-2xl px-4 py-3.5 text-xs transition-all shadow-2xs"
              />
              {loginError && <p className="text-[10px] text-red-500 font-sans mt-1">{loginError}</p>}
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              className="w-full bg-gold-900 hover:bg-gold-950 text-white font-sans text-[10px] uppercase tracking-widest font-bold py-3.5 rounded-full transition shadow-sm cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 md:px-12 bg-gold-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-gold-100 pb-8">
          <div className="space-y-2">
            <span className="text-[10px] font-sans tracking-[0.25em] text-gold-500 uppercase font-bold">
              Painel Gestor
            </span>
            <h3 className="font-serif text-3xl text-gold-950 font-light tracking-wide flex items-center space-x-2.5">
              <ClipboardList className="w-7 h-7 text-gold-500" />
              <span>Olá, Ana Caroline!</span>
            </h3>
            <p className="text-xs text-gold-800/80 font-sans font-light">
              Gerencie seus agendamentos online, controle seus bloqueios de horários e acompanhe seu faturamento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              id="add-manual-booking-toggle"
              className="flex items-center space-x-1.5 bg-gold-900 hover:bg-gold-950 text-white font-sans text-[10px] uppercase tracking-widest font-bold px-6 py-3 rounded-full shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Agendamento</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              id="admin-logout-btn"
              className="text-[10px] uppercase tracking-widest font-bold text-gold-800 bg-white border border-gold-100 px-6 py-3 rounded-full hover:bg-gold-50 transition cursor-pointer"
            >
              Sair do Painel
            </button>
          </div>
        </div>

        {/* Manual Booking Form Modal/Section */}
        {showManualForm && (
          <div className="bg-white border border-gold-100 rounded-3xl p-6 md:p-8 shadow-lg max-w-2xl mx-auto animate-fade-in text-left space-y-5">
            <div className="flex justify-between items-center border-b border-gold-100 pb-4">
              <h5 className="font-serif text-xl text-gold-950 font-normal tracking-wide">Novo Agendamento Manual</h5>
              <button
                onClick={() => setShowManualForm(false)}
                className="text-xs text-gold-500 hover:text-gold-850 font-sans font-bold cursor-pointer"
              >
                Fechar [X]
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Service */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Serviço *</label>
                <select
                  value={mServiceId}
                  onChange={(e) => setMServiceId(e.target.value)}
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - R$ {s.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Name */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Nome da Cliente *</label>
                <input
                  type="text"
                  maxLength={60}
                  placeholder="Ex: Clara Mendes"
                  value={mClientName}
                  onChange={(e) => setMClientName(e.target.value)}
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                  required
                />
              </div>

              {/* Client Phone */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  placeholder="Ex: (11) 98888-7777"
                  value={mClientPhone}
                  onChange={(e) => setMClientPhone(formatPhone(e.target.value))}
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                  required
                />
              </div>

              {/* Client Email */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">E-mail (opcional)</label>
                <input
                  type="email"
                  placeholder="Ex: clara@email.com"
                  value={mClientEmail}
                  onChange={(e) => setMClientEmail(e.target.value)}
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Data *</label>
                <input
                  type="date"
                  value={mDate}
                  onChange={(e) => setMDate(e.target.value)}
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                  required
                />
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Horário *</label>
                <select
                  value={mTime}
                  onChange={(e) => setMTime(e.target.value)}
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                  required
                >
                  <option value="">Selecione...</option>
                  {AVAILABLE_HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Observações adicionais</label>
                <input
                  type="text"
                  placeholder="Ex: Preferência por maca perto da janela, observações etc."
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                />
              </div>

              {mErrors && <p className="text-[11px] text-red-500 font-sans md:col-span-2">{mErrors}</p>}

              <div className="md:col-span-2 flex justify-end space-x-2.5 pt-3.5 border-t border-gold-100">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="text-[10px] uppercase tracking-wider font-bold text-gold-700 bg-gold-50 hover:bg-gold-100 px-5 py-2.5 rounded-full transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="submit-manual-booking"
                  className="text-[10px] uppercase tracking-wider font-bold text-white bg-gold-900 hover:bg-gold-950 px-6 py-2.5 rounded-full shadow-sm transition cursor-pointer"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bento Grid: Statistics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Box 1: Total Revenue */}
          <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-[9px] font-sans tracking-[0.12em] text-gold-500 uppercase block font-bold">Faturamento Estimado</span>
              <strong className="text-2xl font-serif text-gold-950 block mt-1">R$ {totalRevenue.toFixed(2).replace('.', ',')}</strong>
              <span className="text-[9px] text-emerald-600 font-sans font-medium mt-0.5 block">Confirmados & Concluídos</span>
            </div>
          </div>

          {/* Box 2: Total Bookings */}
          <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <span className="text-[9px] font-sans tracking-[0.12em] text-gold-500 uppercase block font-bold">Total de Reservas</span>
              <strong className="text-2xl font-serif text-gold-950 block mt-1">{totalBookingsCount}</strong>
              <span className="text-[9px] text-gold-600 font-sans font-medium mt-0.5 block">{pendingBookingsCount} pendentes de aprovação</span>
            </div>
          </div>

          {/* Box 3: Most Popular Service */}
          <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <span className="text-[9px] font-sans tracking-[0.12em] text-gold-500 uppercase block font-bold">Serviço Popular</span>
              <strong className="text-sm font-sans font-bold text-gold-950 block mt-1.5 leading-tight line-clamp-1">{popularService ? popularService.name : 'Nenhum ainda'}</strong>
              <span className="text-[9px] text-gold-600 font-sans font-medium mt-0.5 block">Destaque do mês</span>
            </div>
          </div>

          {/* Box 4: Active Slots Blocking Info */}
          <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <Ban className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[9px] font-sans tracking-[0.12em] text-gold-500 uppercase block font-bold">Datas Bloqueadas</span>
              <strong className="text-2xl font-serif text-gold-950 block mt-1">{blockedSlots.length}</strong>
              <span className="text-[9px] text-amber-600 font-sans font-medium mt-0.5 block">Indisponíveis para escolha</span>
            </div>
          </div>
        </div>

        {/* Management Controls Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Bookings Table & Filter (Col-span 8) */}
          <div className="lg:col-span-8 bg-white border border-gold-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h5 className="font-serif text-xl font-normal text-gold-950 tracking-wide">Lista de Agendamentos</h5>
                  {bookings.length > 0 && (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      id="reset-bookings-btn"
                      className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-full text-[9px] font-bold tracking-wider uppercase px-3.5 py-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Zerar Lista</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-gold-800 font-light">Gerencie e altere o status das solicitações.</p>
              </div>

              {/* Table Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-white border border-gold-100 text-xs rounded-full px-4 py-2 focus:border-gold-500 font-sans focus:outline-hidden"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>

                {/* Date Search */}
                <input
                  type="date"
                  value={dateSearch}
                  onChange={(e) => setDateSearch(e.target.value)}
                  className="bg-white border border-gold-100 text-xs rounded-full px-4 py-2 focus:border-gold-500 font-sans focus:outline-hidden"
                />
                
                {dateSearch && (
                  <button
                    onClick={() => setDateSearch('')}
                    className="text-[10px] font-sans font-bold text-gold-600 hover:text-gold-900 uppercase tracking-wider"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Reset confirmation prompt */}
            {showResetConfirm && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in text-left">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h6 className="font-sans text-xs font-bold text-red-800 uppercase tracking-wider">Zerar lista de agendamentos?</h6>
                    <p className="text-xs text-red-700 font-light leading-relaxed">
                      Tem certeza que quer fazer isso? Esta ação é definitiva e apagará permanentemente todos os {bookings.length} agendamentos registrados.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-600 bg-white border border-neutral-200 px-4 py-2 rounded-full hover:bg-neutral-50 transition cursor-pointer"
                  >
                    Não, cancelar
                  </button>
                  <button
                    onClick={() => {
                      onClearAllBookings();
                      setShowResetConfirm(false);
                    }}
                    id="confirm-reset-bookings-btn"
                    className="text-[10px] font-sans font-bold uppercase tracking-wider text-white bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition cursor-pointer shadow-sm"
                  >
                    Sim, zerar tudo!
                  </button>
                </div>
              </div>
            )}

            {/* Bookings Card List */}
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((b) => {
                  const s = services.find((service) => service.id === b.serviceId);
                  const isPending = b.status === 'pendente';
                  const isConfirmed = b.status === 'confirmado';
                  const isCompleted = b.status === 'concluido';
                  const isCanceled = b.status === 'cancelado';
                  
                  return (
                    <div
                      key={b.id}
                      id={`admin-booking-row-${b.id}`}
                      className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between gap-4 transition duration-200 ${
                        isPending
                          ? 'border-amber-200 bg-amber-50/10'
                          : isCanceled
                          ? 'border-red-100 bg-red-50/5'
                          : 'border-gold-100 bg-white'
                      }`}
                    >
                      {/* Booking Primary Details */}
                      <div className="space-y-3 text-left">
                        <div className="flex items-center space-x-2">
                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-[8px] font-sans uppercase font-bold tracking-widest ${
                              isPending
                                ? 'bg-amber-100 text-amber-800'
                                : isConfirmed
                                ? 'bg-indigo-100 text-indigo-800'
                                : isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {b.status}
                          </span>

                          <span className="text-[10px] font-mono text-gold-400">
                            AC-{b.id.toUpperCase().replace('TEMP-', '')}
                          </span>
                        </div>

                        {/* Client details & requested service */}
                        <div className="space-y-1.5">
                          <h6 className="font-sans text-sm font-bold text-gold-950 flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>{b.clientName}</span>
                          </h6>
                          <p className="text-xs text-gold-800 font-light">
                            Serviço: <strong className="text-gold-950 font-semibold">{s ? s.name : 'Serviço desconhecido'}</strong>
                          </p>
                          <p className="text-xs font-sans text-gold-800 font-light">
                            Agendado para:{' '}
                            <strong className="text-gold-900 font-semibold">
                              {new Date(b.date).toLocaleDateString('pt-BR')} às {b.time}
                            </strong>{' '}
                            ({s ? s.duration : 0} min)
                          </p>
                          {b.notes && (
                            <div className="mt-2 bg-gold-50 rounded-xl p-3 text-xs italic text-gold-800 max-w-lg leading-relaxed font-light">
                              Obs: {b.notes}
                            </div>
                          )}
                        </div>

                        {/* Contacts row */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-sans text-gold-700 pt-1">
                          <span>WhatsApp: <strong className="text-gold-900">{b.clientPhone}</strong></span>
                          {b.clientEmail !== 'Não informado' && (
                            <span>E-mail: <strong className="text-gold-900">{b.clientEmail}</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Admin Actions column */}
                      <div className="flex sm:flex-col justify-end items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gold-50">
                        {/* Cost visualizer */}
                        <span className="font-serif text-sm font-bold text-gold-900 mb-2.5 hidden sm:block">
                          R$ {s ? s.price.toFixed(2).replace('.', ',') : '0,00'}
                        </span>

                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {/* WhatsApp fast message confirm button */}
                          {s && (
                            <a
                              href={getWhatsAppLink(b.clientPhone, b.clientName, b.date, b.time, s.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[9px] font-bold tracking-wider uppercase px-3 py-2 transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Confirmar WhatsApp</span>
                            </a>
                          )}

                          {/* Confirm action */}
                          {isPending && (
                            <button
                              onClick={() => onUpdateStatus(b.id, 'confirmado')}
                              id={`admin-btn-confirm-${b.id}`}
                              className="bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-[9px] font-bold tracking-wider uppercase px-3 py-2 transition cursor-pointer"
                            >
                              Confirmar
                            </button>
                          )}

                          {/* Complete action */}
                          {isConfirmed && (
                            <button
                              onClick={() => onUpdateStatus(b.id, 'concluido')}
                              id={`admin-btn-complete-${b.id}`}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-bold tracking-wider uppercase px-3 py-2 transition cursor-pointer"
                            >
                              Concluir
                            </button>
                          )}

                          {/* Cancel action */}
                          {(isPending || isConfirmed) && (
                            <button
                              onClick={() => onUpdateStatus(b.id, 'cancelado')}
                              id={`admin-btn-cancel-${b.id}`}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-lg text-[9px] font-bold tracking-wider uppercase px-3 py-2 transition cursor-pointer"
                            >
                              Cancelar
                            </button>
                          )}

                          {/* Delete action */}
                          <button
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir permanentemente o registro deste agendamento?')) {
                                onDeleteBooking(b.id);
                              }
                            }}
                            id={`admin-btn-delete-${b.id}`}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Excluir Registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 border border-dashed border-gold-100 rounded-3xl text-center space-y-3 max-w-md mx-auto">
                <AlertCircle className="w-10 h-10 text-gold-300 mx-auto" />
                <h6 className="font-serif text-lg font-normal text-gold-950">Nenhum agendamento listado</h6>
                <p className="text-xs text-gold-800 font-light px-8 leading-relaxed">
                  Nenhum registro corresponde aos filtros de status ou data ativos neste momento.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Slot Blocking Controls & blocked list (Col-span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Blocking Control Panel Card */}
            <div className="bg-white border border-gold-100 rounded-3xl p-6 shadow-xs space-y-5 text-left">
              <div className="space-y-1.5">
                <h5 className="font-serif text-xl font-normal text-gold-950 flex items-center space-x-2">
                  <Ban className="w-5.5 h-5.5 text-gold-500" />
                  <span>Bloquear Horário</span>
                </h5>
                <p className="text-xs text-gold-800 font-light leading-relaxed">
                  Evite agendamentos em feriados ou ausências específicas em que você estará indisponível.
                </p>
              </div>

              {/* Form to add blocked slot */}
              <form onSubmit={handleBlockSlot} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Data de Bloqueio *</label>
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Horário Específico (opcional)</label>
                  <select
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                  >
                    <option value="">Dia Inteiro Indisponível</option>
                    {AVAILABLE_HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  id="submit-blockage-btn"
                  className="w-full bg-gold-900 hover:bg-gold-950 text-white text-[10px] uppercase tracking-widest font-bold font-sans py-3 rounded-full transition cursor-pointer"
                >
                  Confirmar Bloqueio
                </button>
              </form>
            </div>

            {/* Blocked List Card */}
            <div className="bg-white border border-gold-100 rounded-3xl p-6 shadow-xs space-y-4 text-left">
              <h5 className="font-serif text-sm font-bold text-gold-950">Histórico de Indisponibilidades</h5>
              
              {blockedSlots.length > 0 ? (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {blockedSlots.map((slot, idx) => {
                    const formattedDate = new Date(`${slot.date}T00:00:00`).toLocaleDateString('pt-BR');
                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gold-50 border border-gold-100 p-3 rounded-xl text-xs text-gold-900 font-sans"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-gold-950">{formattedDate}</p>
                          <p className="text-[10px] text-gold-500 font-mono">
                            {slot.time ? `Bloqueado às ${slot.time}` : 'Dia inteiro fechado'}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveBlockedSlot(slot)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-md transition cursor-pointer"
                          title="Desbloquear"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gold-500 font-sans italic text-center py-4 font-light">
                  Nenhuma data ou horário bloqueado no momento. Todo o catálogo de dias comerciais está ativo!
                </p>
              )}
            </div>

            {/* Owner Photo Settings Card */}
            <div className="bg-white border border-gold-100 rounded-3xl p-6 shadow-xs space-y-5 text-left">
              <div className="space-y-1.5">
                <h5 className="font-serif text-lg font-normal text-gold-950 flex items-center space-x-2">
                  <User className="w-5 h-5 text-gold-500" />
                  <span>Foto da Ana Caroline</span>
                </h5>
                <p className="text-xs text-gold-800/80 font-light leading-relaxed">
                  Altere a foto que é exibida na seção "Sobre Nós" no site público e ajuste seu enquadramento.
                </p>
              </div>
 
              {/* Photo Preview with active transformations */}
              <div className="flex flex-col items-center justify-center py-4 bg-gold-50/30 rounded-2xl border border-gold-100/50 space-y-3">
                <div className="w-32 h-40 rounded-2xl bg-linear-to-tr from-gold-100 to-gold-200/40 flex items-center justify-center overflow-hidden border-2 border-gold-200 shadow-xs">
                  {ownerPhoto ? (
                    <img
                      src={ownerPhoto}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover origin-center"
                      style={{
                        objectPosition: `${50 + localX}% ${50 + localY}%`,
                        transform: `scale(${localScale})`
                      }}
                    />
                  ) : (
                    <span className="text-gold-500 font-serif text-3xl font-light italic select-none">AC</span>
                  )}
                </div>
                <span className="text-[10px] text-gold-600 font-sans">
                  {ownerPhoto ? 'Foto personalizada ativa' : 'Utilizando letras iniciais fallback'}
                </span>
              </div>

              {/* Photo Framing Adjustment Sliders */}
              {ownerPhoto && (
                <div className="bg-gold-50/20 border border-gold-100/60 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-gold-100/50 pb-2">
                    <span className="text-xs font-semibold text-gold-950">Ajustar Enquadramento</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLocalScale(1);
                        setLocalX(0);
                        setLocalY(0);
                      }}
                      className="text-[9px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-800 transition cursor-pointer"
                    >
                      Resetar
                    </button>
                  </div>

                  {/* Quick Directional & Zoom Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-4 bg-gold-50/50 p-3 rounded-xl border border-gold-100">
                    {/* Direction Pad */}
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] uppercase tracking-wider text-gold-600 font-bold mb-1.5">Posição (Setas)</span>
                      <div className="grid grid-cols-3 gap-1 w-24 h-24">
                        <div></div>
                        <button
                          type="button"
                          onClick={() => setLocalY(prev => Math.max(-50, prev - 5))}
                          className="flex items-center justify-center bg-white hover:bg-gold-50 text-gold-800 border border-gold-200/80 rounded-lg shadow-2xs active:scale-95 transition cursor-pointer"
                          title="Mover para Cima"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <div></div>

                        <button
                          type="button"
                          onClick={() => setLocalX(prev => Math.max(-50, prev - 5))}
                          className="flex items-center justify-center bg-white hover:bg-gold-50 text-gold-800 border border-gold-200/80 rounded-lg shadow-2xs active:scale-95 transition cursor-pointer"
                          title="Mover para Esquerda"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center justify-center text-[10px] text-gold-400 font-bold bg-white/40 border border-dashed border-gold-100 rounded-lg">
                          5%
                        </div>
                        <button
                          type="button"
                          onClick={() => setLocalX(prev => Math.min(50, prev + 5))}
                          className="flex items-center justify-center bg-white hover:bg-gold-50 text-gold-800 border border-gold-200/80 rounded-lg shadow-2xs active:scale-95 transition cursor-pointer"
                          title="Mover para Direita"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div></div>
                        <button
                          type="button"
                          onClick={() => setLocalY(prev => Math.min(50, prev + 5))}
                          className="flex items-center justify-center bg-white hover:bg-gold-50 text-gold-800 border border-gold-200/80 rounded-lg shadow-2xs active:scale-95 transition cursor-pointer"
                          title="Mover para Baixo"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        <div></div>
                      </div>
                    </div>

                    {/* Zoom Quick Buttons */}
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] uppercase tracking-wider text-gold-600 font-bold mb-1.5">Zoom (Escala)</span>
                      <div className="flex items-center gap-1.5 h-24">
                        <button
                          type="button"
                          onClick={() => setLocalScale(prev => Math.max(0.2, parseFloat((prev - 0.1).toFixed(2))))}
                          className="flex flex-col items-center justify-center bg-white hover:bg-gold-50 text-gold-800 border border-gold-200/80 w-11 h-11 rounded-xl shadow-2xs active:scale-95 transition cursor-pointer"
                          title="Diminuir Zoom"
                        >
                          <ZoomOut className="w-4 h-4 text-gold-700" />
                          <span className="text-[8px] font-bold mt-0.5">-10%</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocalScale(prev => Math.min(3, parseFloat((prev + 0.1).toFixed(2))))}
                          className="flex flex-col items-center justify-center bg-white hover:bg-gold-50 text-gold-800 border border-gold-200/80 w-11 h-11 rounded-xl shadow-2xs active:scale-95 transition cursor-pointer"
                          title="Aumentar Zoom"
                        >
                          <ZoomIn className="w-4 h-4 text-gold-700" />
                          <span className="text-[8px] font-bold mt-0.5">+10%</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Save button with state feedback */}
                  {(photoScale !== localScale || photoX !== localX || photoY !== localY) ? (
                    <button
                      type="button"
                      onClick={() => onUpdateOwnerPhoto(ownerPhoto, localScale, localX, localY)}
                      className="w-full bg-gold-600 hover:bg-gold-700 text-white text-[10px] uppercase tracking-widest font-bold py-2.5 rounded-full transition cursor-pointer shadow-xs"
                    >
                      Salvar Enquadramento
                    </button>
                  ) : (
                    <div className="text-center text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 py-2 rounded-xl font-medium">
                      ✓ Enquadramento salvo!
                    </div>
                  )}
                </div>
              )}

              {/* Upload controls */}
              <div className="space-y-3 text-left">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500 block">Carregar Nova Foto</label>
                  <label className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gold-50 border border-gold-200 hover:border-gold-300 px-4 py-2.5 rounded-xl transition cursor-pointer text-xs font-semibold text-gold-900 shadow-2xs">
                    <RefreshCw className="w-4 h-4 text-gold-500 animate-spin-slow" />
                    <span>Selecionar do Aparelho</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            alert("A imagem selecionada é muito grande! Por favor, escolha um arquivo menor que 10MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            if (typeof reader.result === 'string') {
                              try {
                                const compressed = await compressImage(reader.result);
                                onUpdateOwnerPhoto(compressed, 1, 0, 0);
                              } catch (err) {
                                console.error("Erro ao processar imagem:", err);
                                onUpdateOwnerPhoto(reader.result, 1, 0, 0);
                              }
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[9px] text-gold-500 font-sans leading-relaxed">
                    Escolha qualquer foto (formato quadrado ou retrato) de até 10MB. Ela será otimizada automaticamente para carregamento ultrarrápido!
                  </p>
                </div>

                {ownerPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Deseja realmente remover sua foto personalizada e voltar para as letras iniciais "AC"?')) {
                        onUpdateOwnerPhoto('', 1, 0, 0);
                      }
                    }}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10px] uppercase tracking-widest font-bold py-2.5 rounded-full transition cursor-pointer"
                  >
                    Remover Foto Personalizada
                  </button>
                )}
              </div>
            </div>



          </div>

        </div>

        {/* Manage Service Catalog Section */}
        <div className="bg-white border border-gold-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-gold-100 pb-5">
            <h4 className="font-serif text-2xl text-gold-950 font-light tracking-wide flex items-center space-x-2.5">
              <Sparkles className="w-6 h-6 text-gold-500" />
              <span>Gerenciar Catálogo de Serviços</span>
            </h4>
            <p className="text-xs text-gold-800 font-light mt-1">
              Adicione novos tratamentos, remova procedimentos antigos ou gerencie o destaque do seu menu de serviços.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Form to Add Service (Col Chunk) */}
            <div className="lg:col-span-5 bg-gold-50/40 border border-gold-100 p-6 rounded-2xl space-y-5">
              <h5 className="font-serif text-lg font-normal text-gold-950 flex items-center space-x-2">
                {editingServiceId ? (
                  <Edit className="w-5 h-5 text-gold-500" />
                ) : (
                  <Plus className="w-5 h-5 text-gold-500" />
                )}
                <span>{editingServiceId ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</span>
              </h5>

              <form onSubmit={handleAddServiceSubmit} className="space-y-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Categoria *</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value as any)}
                    className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Nome do Procedimento *</label>
                  <input
                    type="text"
                    placeholder="Ex: Peeling Químico Iluminador"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Descrição do Tratamento *</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva detalhadamente o que inclui o procedimento, os benefícios e para quem é indicado..."
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden leading-relaxed resize-none"
                    required
                  />
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Ex: 150.00"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Duração (Minutos) *</label>
                    <input
                      type="number"
                      min="5"
                      placeholder="Ex: 60"
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(e.target.value)}
                      className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                {/* Popular Highlight */}
                <div className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id="newServicePopular"
                    checked={newServicePopular}
                    onChange={(e) => setNewServicePopular(e.target.checked)}
                    className="rounded border-gold-100 text-gold-900 focus:ring-gold-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="newServicePopular" className="text-xs text-gold-900 font-sans cursor-pointer select-none">
                    destacar como Popular
                  </label>
                </div>

                {/* Package Option */}
                <div className="space-y-3 p-3 bg-gold-50/50 rounded-xl border border-gold-100/50 text-left">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="newServiceIsPackage"
                      checked={newServiceIsPackage}
                      onChange={(e) => {
                        setNewServiceIsPackage(e.target.checked);
                        if (!e.target.checked) setNewServiceSessionsCount('');
                      }}
                      className="rounded border-gold-100 text-gold-900 focus:ring-gold-500 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="newServiceIsPackage" className="text-xs text-gold-900 font-sans font-semibold cursor-pointer select-none">
                      Este serviço é um Pacote (múltiplas sessões)
                    </label>
                  </div>

                  {newServiceIsPackage && (
                    <div className="pl-6 space-y-1.5 animate-fade-in">
                      <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Quantidade de Sessões no Pacote *</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Ex: 8"
                        value={newServiceSessionsCount}
                        onChange={(e) => setNewServiceSessionsCount(e.target.value)}
                        className="w-full max-w-xs bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                        required={newServiceIsPackage}
                      />
                    </div>
                  )}
                </div>

                {/* Campaign Highlight */}
                <div className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id="newServiceIsCampaign"
                    checked={newServiceIsCampaign}
                    onChange={(e) => setNewServiceIsCampaign(e.target.checked)}
                    className="rounded border-gold-100 text-gold-900 focus:ring-gold-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="newServiceIsCampaign" className="text-xs text-gold-900 font-sans font-medium cursor-pointer select-none text-amber-800">
                    Este serviço será uma campanha (agenda/equipamento especial)
                  </label>
                </div>

                {/* If Checked, Show Calendar & Hour availability config */}
                {newServiceIsCampaign && (
                  <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl space-y-4 animate-fade-in text-left">
                    <span className="text-[10px] font-sans tracking-wider text-amber-800 uppercase font-bold block border-b border-amber-100 pb-1">
                      Configuração da Agenda Especial
                    </span>

                    {/* Choose Dates */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-amber-700 block">Adicionar Datas de Atendimento *</label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={newServiceCampDateInput}
                          onChange={(e) => setNewServiceCampDateInput(e.target.value)}
                          className="flex-1 bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-2.5 py-2 text-xs focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewServiceCampDate}
                          className="bg-gold-900 hover:bg-gold-950 text-white text-[9px] uppercase tracking-wider font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                        >
                          Inserir
                        </button>
                      </div>

                      {/* List of chosen dates */}
                      {newServiceCampDates.length > 0 ? (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {newServiceCampDates.map((dStr) => {
                            const parts = dStr.split('-');
                            const formatted = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dStr;
                            return (
                              <span
                                key={dStr}
                                className="inline-flex items-center space-x-1 bg-gold-900 text-white text-[9px] font-semibold px-2 py-0.5 rounded-md"
                              >
                                <span>{formatted}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewServiceCampDate(dStr)}
                                  className="hover:text-red-300 font-bold focus:outline-hidden text-[9px] ml-1 shrink-0"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[9px] text-amber-700/70 font-sans italic">
                          Nenhuma data adicionada ainda. Selecione e insira acima.
                        </p>
                      )}
                    </div>

                    {/* Choose Hours */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-amber-700">Horários de Atendimento Disponíveis *</label>
                        <button
                          type="button"
                          onClick={handleToggleAllNewServiceCampHours}
                          className="text-[9px] text-gold-600 hover:text-gold-900 underline font-sans"
                        >
                          {newServiceCampHours.length === AVAILABLE_HOURS.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                        </button>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {AVAILABLE_HOURS.map((h) => {
                          const isChecked = newServiceCampHours.includes(h);
                          return (
                            <button
                              key={h}
                              type="button"
                              onClick={() => handleToggleNewServiceCampHour(h)}
                              className={`text-[10px] font-mono py-1 rounded-md text-center transition font-semibold cursor-pointer border ${
                                isChecked
                                  ? 'bg-amber-600 border-amber-600 text-white shadow-3xs'
                                  : 'bg-white border-amber-100 text-amber-900 hover:bg-amber-50/50'
                              }`}
                            >
                              {h}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {serviceError && <p className="text-[10px] text-red-500 font-sans">{serviceError}</p>}
                {serviceSuccess && <p className="text-[10px] text-emerald-600 font-sans font-medium">{serviceSuccess}</p>}

                <div className="flex flex-col sm:flex-row gap-2">
                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gold-100 hover:bg-gold-200 text-gold-900 text-[10px] uppercase tracking-widest font-bold font-sans py-3 rounded-full transition cursor-pointer text-center"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    id="submit-new-service-btn"
                    className="flex-1 bg-gold-900 hover:bg-gold-950 text-white text-[10px] uppercase tracking-widest font-bold font-sans py-3 rounded-full transition cursor-pointer shadow-sm text-center"
                  >
                    {editingServiceId ? 'Salvar Alterações' : 'Adicionar ao Catálogo'}
                  </button>
                </div>
              </form>
            </div>

            {/* List of Existing Services (Col Chunk) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h5 className="font-serif text-lg font-normal text-gold-950">Serviços Ativos ({services.length})</h5>
                {services.length > 0 && (
                  <button
                    onClick={() => setShowServicesResetConfirm(true)}
                    id="reset-services-btn"
                    className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-full text-[9px] font-bold tracking-wider uppercase px-3.5 py-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Zerar Lista</span>
                  </button>
                )}
              </div>

              {/* Services Reset confirmation prompt */}
              {showServicesResetConfirm && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in text-left">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h6 className="font-sans text-xs font-bold text-red-800 uppercase tracking-wider">Zerar catálogo de serviços?</h6>
                      <p className="text-xs text-red-700 font-light leading-relaxed">
                        Tem certeza que quer fazer isso? Esta ação é definitiva e apagará permanentemente todos os {services.length} serviços do catálogo.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setShowServicesResetConfirm(false)}
                      className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-600 bg-white border border-neutral-200 px-4 py-2 rounded-full hover:bg-neutral-50 transition cursor-pointer"
                    >
                      Não, cancelar
                    </button>
                    <button
                      onClick={() => {
                        onClearAllServices();
                        setShowServicesResetConfirm(false);
                      }}
                      id="confirm-reset-services-btn"
                      className="text-[10px] font-sans font-bold uppercase tracking-wider text-white bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition cursor-pointer shadow-sm"
                    >
                      Sim, zerar tudo!
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {services.map((s) => (
                  <div
                    key={s.id}
                    id={`admin-service-row-${s.id}`}
                    className="bg-white border border-gold-100 hover:border-gold-200 p-4 rounded-2xl flex justify-between items-start gap-4 transition shadow-2xs"
                  >
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[8px] font-sans tracking-widest text-gold-500 uppercase font-bold bg-gold-50 border border-gold-100 px-2.5 py-0.5 rounded-full">
                          {CATEGORIES.find((cat) => cat.id === s.category)?.label || s.category}
                        </span>
                        {s.popular && (
                          <span className="bg-amber-100 text-amber-800 text-[8px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                            Estrela
                          </span>
                        )}
                        {s.isPackage && (
                          <span className="bg-purple-100 text-purple-800 text-[8px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                            Pacote ({s.sessionsCount} sessões)
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-gold-400 font-light">ID: {s.id}</span>
                      </div>

                      <div className="space-y-1">
                        <h6 className="font-sans text-sm font-bold text-gold-950">{s.name}</h6>
                        <p className="text-[11px] text-gold-800 font-light leading-relaxed line-clamp-2">
                          {s.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4 text-[11px] font-sans text-gold-600">
                        <span>Investimento: <strong className="text-gold-900">R$ {s.price.toFixed(2).replace('.', ',')}</strong></span>
                        <span className="flex items-center space-x-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-gold-400" />
                          <span>{s.duration} min</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleEditServiceClick(s)}
                        className="text-gold-600 hover:text-gold-800 p-2 hover:bg-gold-50 rounded-xl transition cursor-pointer"
                        title="Editar Serviço"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja realmente remover o serviço "${s.name}" do catálogo? Clientes não poderão mais agendá-lo.`)) {
                            onDeleteService(s.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        title="Excluir Serviço"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Manage Campaigns Section */}
        <div className="bg-white border border-gold-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-gold-100 pb-5">
            <h4 className="font-serif text-2xl text-gold-950 font-light tracking-wide flex items-center space-x-2.5">
              <Calendar className="w-6 h-6 text-gold-500" />
              <span>Gerenciar Campanhas / Agenda Especial</span>
            </h4>
            <p className="text-xs text-gold-800 font-light mt-1">
              Defina as datas de disponibilidade de serviços que dependem do aluguel temporário de aparelhos (ex: Laser Day) ou eventos promocionais especiais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Form to Add Campaign (Col-span 5) */}
            <div className="lg:col-span-5 bg-gold-50/40 border border-gold-100 p-6 rounded-2xl space-y-5">
              <h5 className="font-serif text-lg font-normal text-gold-950 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-gold-500" />
                <span>Criar Nova Campanha</span>
              </h5>

              <form onSubmit={handleCampaignSubmit} className="space-y-4">
                {/* Select Service */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Selecione o Serviço *</label>
                  <select
                    value={campServiceId}
                    onChange={(e) => setCampServiceId(e.target.value)}
                    className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                    required
                  >
                    <option value="">Selecione o serviço...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Dates Block */}
                <div className="space-y-2">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500 block">Adicionar Datas de Atendimento *</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={campDateInput}
                      onChange={(e) => setCampDateInput(e.target.value)}
                      className="flex-1 bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddCampaignDate}
                      className="bg-gold-900 hover:bg-gold-950 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Adicionar
                    </button>
                  </div>

                  {/* List of pending campaign dates */}
                  {campDates.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {campDates.map((dStr) => {
                        const parts = dStr.split('-');
                        const formatted = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dStr;
                        return (
                          <span
                            key={dStr}
                            className="inline-flex items-center space-x-1 bg-gold-900 text-white text-[10px] font-medium px-2.5 py-1 rounded-lg shadow-2xs"
                          >
                            <span>{formatted}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCampaignDate(dStr)}
                              className="hover:text-red-300 font-bold focus:outline-hidden text-[10px] ml-1 shrink-0"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gold-500 font-sans italic leading-relaxed pt-1">
                      Nenhuma data adicionada. Use o seletor acima para adicionar os dias que o laser estará disponível.
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Observações / Detalhes (Opcional)</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Máquina alugada de laser de diodo / Vagas super limitadas"
                    value={campNotes}
                    onChange={(e) => setCampNotes(e.target.value)}
                    className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden leading-relaxed resize-none"
                  />
                </div>

                {campError && <p className="text-[10px] text-red-500 font-sans">{campError}</p>}
                {campSuccess && <p className="text-[10px] text-emerald-600 font-sans font-medium">{campSuccess}</p>}

                <button
                  type="submit"
                  id="submit-new-campaign-btn"
                  className="w-full bg-gold-900 hover:bg-gold-950 text-white text-[10px] uppercase tracking-widest font-bold font-sans py-3 rounded-full transition cursor-pointer shadow-sm"
                >
                  Salvar Campanha
                </button>
              </form>
            </div>

            {/* List of Existing Campaigns (Col-span 7) */}
            <div className="lg:col-span-7 space-y-4">
              <h5 className="font-serif text-lg font-normal text-gold-950">Campanhas Ativas ({campaigns.length})</h5>

              {campaigns.length > 0 ? (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {campaigns.map((camp) => {
                    const s = services.find((service) => service.id === camp.serviceId);
                    return (
                      <div
                        key={camp.id}
                        id={`admin-campaign-row-${camp.id}`}
                        className="bg-white border border-gold-100 hover:border-gold-200 p-5 rounded-2xl flex justify-between items-start gap-4 transition shadow-2xs text-left"
                      >
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[8px] font-sans tracking-widest text-amber-800 uppercase font-bold bg-amber-50 border border-amber-200/50 px-2.5 py-0.5 rounded-full inline-block">
                              Agenda Ativa
                            </span>
                            <h6 className="font-sans text-base font-bold text-gold-950">
                              {s ? s.name : 'Serviço não encontrado'}
                            </h6>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500 block">
                              Dias de Disponibilidade:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {camp.dates.map((dStr) => {
                                const parts = dStr.split('-');
                                const formatted = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dStr;
                                return (
                                  <span key={dStr} className="bg-gold-50 border border-gold-200 text-gold-900 font-sans font-semibold text-[10px] px-2.5 py-1 rounded-lg">
                                    {formatted}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {camp.notes && (
                            <p className="text-xs text-gold-700 font-light italic leading-relaxed">
                              * {camp.notes}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (confirm('Deseja realmente excluir esta campanha especial? As datas de laser day não aparecerão mais para os clientes.')) {
                              onDeleteCampaign(camp.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition cursor-pointer shrink-0"
                          title="Remover Campanha"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 border border-dashed border-gold-100 rounded-3xl text-center space-y-3 max-w-md mx-auto">
                  <AlertCircle className="w-10 h-10 text-gold-300 mx-auto" />
                  <h6 className="font-serif text-lg font-normal text-gold-950">Nenhuma campanha cadastrada</h6>
                  <p className="text-xs text-gold-800 font-light px-8 leading-relaxed">
                    Você não possui nenhuma campanha de equipamento alugado ou datas especiais no momento. Use o formulário à esquerda para cadastrar uma!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manage Location Section */}
        <div className="bg-white border border-gold-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-gold-100 pb-5">
            <h4 className="font-serif text-2xl text-gold-950 font-light tracking-wide flex items-center space-x-2.5">
              <MapPin className="w-6 h-6 text-gold-500" />
              <span>Endereço e Localização</span>
            </h4>
            <p className="text-xs text-gold-800 font-light mt-1">
              Caso seu consultório mude de endereço ou você queira atualizar o mapa interativo do site, edite as informações abaixo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Inputs & Controls (Col-span 5) */}
            <div className="lg:col-span-5 bg-gold-50/40 border border-gold-100 p-6 rounded-2xl space-y-4">
              {/* Endereço Físico */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Endereço Escrito *</label>
                <textarea
                  rows={2}
                  value={localAddress}
                  onChange={(e) => setLocalAddress(e.target.value)}
                  placeholder="Ex: Quadra 14, Lote 19 - Lunabel 3A, Novo Gama - GO"
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden resize-none font-sans"
                  required
                />
              </div>

              {/* URL do Google Maps */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500">Link do Google Maps *</label>
                <input
                  type="text"
                  value={localMapUrl}
                  onChange={(e) => setLocalMapUrl(e.target.value)}
                  placeholder="Cole o link completo de compartilhamento do Google Maps"
                  className="w-full bg-white border border-gold-100 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden font-sans"
                  required
                />
                <p className="text-[9px] text-gold-500 font-sans leading-relaxed">
                  Você pode copiar o link do navegador ou clicar em "Compartilhar" no Google Maps e copiar o link. O sistema gerará o mapa interativo automaticamente!
                </p>
              </div>

              {/* Save Feedback and Buttons */}
              {locationSuccess && (
                <p className="text-[11px] text-emerald-600 font-sans font-medium bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-center">
                  {locationSuccess}
                </p>
              )}
              {locationError && (
                <p className="text-[11px] text-red-500 font-sans font-medium bg-red-50 border border-red-100 p-2.5 rounded-xl text-center">
                  {locationError}
                </p>
              )}

              <button
                type="button"
                onClick={async () => {
                  if (!localAddress.trim() || !localMapUrl.trim()) {
                    setLocationError('Por favor, preencha todos os campos obrigatórios!');
                    return;
                  }
                  setIsLocationSaving(true);
                  setLocationError('');
                  setLocationSuccess('');
                  try {
                    await onUpdateLocation(localAddress.trim(), localMapUrl.trim());
                    setLocationSuccess('✓ Informações de endereço e mapa salvas com sucesso!');
                    setTimeout(() => setLocationSuccess(''), 4000);
                  } catch (err) {
                    console.error(err);
                    setLocationError('Erro ao salvar as configurações.');
                  } finally {
                    setIsLocationSaving(false);
                  }
                }}
                disabled={isLocationSaving}
                className="w-full bg-gold-900 hover:bg-gold-950 text-white text-[10px] uppercase tracking-widest font-bold py-3 rounded-full transition cursor-pointer shadow-xs flex items-center justify-center space-x-2 disabled:opacity-55"
              >
                <span>{isLocationSaving ? 'Salvando...' : 'Salvar Endereço e Mapa'}</span>
              </button>
            </div>

            {/* Live Preview of Map (Col-span 7) */}
            <div className="lg:col-span-7 space-y-2">
              <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold-500 block">Prévia do Mapa Interativo</span>
              <div className="w-full h-[320px] rounded-2xl border border-gold-100 overflow-hidden relative shadow-md bg-gold-50/20">
                <iframe
                  src={getEmbedUrl(localMapUrl, localAddress)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Prévia do Mapa"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
