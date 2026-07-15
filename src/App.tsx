import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServiceList from './components/ServiceList';
import AdminPanel from './components/AdminPanel';
import AboutUs from './components/AboutUs';
import BookingModal from './components/BookingModal';
import { Booking, BlockedSlot, INITIAL_BOOKINGS, Service, SERVICES, Campaign } from './types';
import { Phone, MapPin, Clock, Instagram, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalInitialServiceId, setBookingModalInitialServiceId] = useState<string | null>(null);
  const [bookingModalInitialDate, setBookingModalInitialDate] = useState<string | undefined>(undefined);
  const [bookingModalInitialTime, setBookingModalInitialTime] = useState<string | undefined>(undefined);

  // Load & Sync Blocked Slots + Seeding Control from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'blocked_slots'), (snapshot) => {
      const hasSeededMarker = snapshot.docs.some(d => d.id === 'system_seeded');

      if (!hasSeededMarker && snapshot.empty) {
        // Initialize/Seed Database once globally
        console.log("Database empty! Running one-time global database seeding...");
        
        // Write seeded marker
        setDoc(doc(db, 'blocked_slots', 'system_seeded'), { date: '2000-01-01' })
          .catch(err => console.error("Error seeding system marker:", err));

        // Seed default blocked slots
        const defaultBlocks = [{ date: '2026-07-25' }];
        defaultBlocks.forEach((slot) => {
          setDoc(doc(db, 'blocked_slots', slot.date), slot)
            .catch(err => console.error("Error seeding slot:", err));
        });

        // Seed default services
        SERVICES.forEach((s) => {
          setDoc(doc(db, 'services', s.id), s)
            .catch(err => console.error("Error seeding service:", err));
        });

        // Seed default bookings
        INITIAL_BOOKINGS.forEach((b) => {
          setDoc(doc(db, 'bookings', b.id), b)
            .catch(err => console.error("Error seeding booking:", err));
        });
      }

      const loaded: BlockedSlot[] = [];
      snapshot.forEach((doc) => {
        if (doc.id !== 'system_seeded') {
          loaded.push(doc.data() as BlockedSlot);
        }
      });
      setBlockedSlots(loaded);
    }, (error) => {
      console.error("Error fetching blocked slots from Firestore, falling back to local:", error);
      const storedBlocks = localStorage.getItem('ana_carolina_blocked_slots');
      if (storedBlocks) {
        try {
          setBlockedSlots(JSON.parse(storedBlocks));
        } catch {
          setBlockedSlots([]);
        }
      } else {
        setBlockedSlots([]);
      }
    });

    return () => unsub();
  }, []);

  // Load & Sync Services from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snapshot) => {
      const loaded: Service[] = [];
      snapshot.forEach((doc) => {
        loaded.push(doc.data() as Service);
      });
      setServices(loaded);
    }, (error) => {
      console.error("Error fetching services from Firestore, falling back to local state:", error);
      const storedServices = localStorage.getItem('ana_carolina_services');
      if (storedServices) {
        try {
          setServices(JSON.parse(storedServices));
        } catch {
          setServices(SERVICES);
        }
      } else {
        setServices(SERVICES);
      }
    });

    return () => unsub();
  }, []);

  // Load & Sync Bookings from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const loaded: Booking[] = [];
      snapshot.forEach((doc) => {
        loaded.push(doc.data() as Booking);
      });
      loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(loaded);
    }, (error) => {
      console.error("Error fetching bookings from Firestore, falling back to local:", error);
      const storedBookings = localStorage.getItem('ana_carolina_bookings');
      if (storedBookings) {
        try {
          setBookings(JSON.parse(storedBookings));
        } catch {
          setBookings(INITIAL_BOOKINGS);
        }
      } else {
        setBookings(INITIAL_BOOKINGS);
      }
    });

    return () => unsub();
  }, []);

  // Load & Sync Campaigns from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
      if (snapshot.empty) {
        const defaultCampaigns: Campaign[] = [
          {
            id: 'c-laser',
            serviceId: 'laser-day',
            dates: ['2026-07-24', '2026-07-25'],
            notes: 'Equipamento de última geração com tecnologia de Diodo alugado especialmente para estas datas.'
          }
        ];
        defaultCampaigns.forEach((c) => {
          setDoc(doc(db, 'campaigns', c.id), c).catch(err => console.error("Error seeding campaign:", err));
        });
        setCampaigns(defaultCampaigns);
      } else {
        const loaded: Campaign[] = [];
        snapshot.forEach((doc) => {
          loaded.push(doc.data() as Campaign);
        });
        setCampaigns(loaded);
      }
    }, (error) => {
      console.error("Error fetching campaigns from Firestore:", error);
      const storedCampaigns = localStorage.getItem('ana_carolina_campaigns');
      if (storedCampaigns) {
        try {
          setCampaigns(JSON.parse(storedCampaigns));
        } catch {
          setCampaigns([]);
        }
      } else {
        setCampaigns([]);
      }
    });

    return () => unsub();
  }, []);

  // State actions synced to Firestore
  const handleAddBooking = async (newBookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const bookingId = 'b-' + Math.random().toString(36).substr(2, 9);
    const newBooking: Booking = {
      id: bookingId,
      ...newBookingData,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'bookings', bookingId), newBooking);
    } catch (e) {
      console.error("Error adding booking to Firestore:", e);
      setBookings(prev => [newBooking, ...prev]);
    }
  };

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (e) {
      console.error("Error updating booking status:", e);
      setBookings(prev => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (e) {
      console.error("Error deleting booking:", e);
      setBookings(prev => prev.filter((b) => b.id !== id));
    }
  };

  const handleClearAllBookings = async () => {
    try {
      localStorage.setItem('ana_carolina_bookings_seeded', 'true');
      const deletePromises = bookings.map((b) => deleteDoc(doc(db, 'bookings', b.id)));
      await Promise.all(deletePromises);
      setBookings([]);
    } catch (e) {
      console.error("Error clearing all bookings:", e);
      setBookings([]);
    }
  };

  const handleClearAllServices = async () => {
    try {
      const deletePromises = services.map((s) => deleteDoc(doc(db, 'services', s.id)));
      await Promise.all(deletePromises);
      setServices([]);
    } catch (e) {
      console.error("Error clearing all services:", e);
      setServices([]);
    }
  };

  const handleAddBlockedSlot = async (slot: BlockedSlot) => {
    const slotId = slot.date + (slot.time ? '_' + slot.time.replace(':', '-') : '');
    try {
      await setDoc(doc(db, 'blocked_slots', slotId), slot);
    } catch (e) {
      console.error("Error adding blocked slot:", e);
      setBlockedSlots(prev => [...prev, slot]);
    }
  };

  const handleRemoveBlockedSlot = async (slot: BlockedSlot) => {
    const slotId = slot.date + (slot.time ? '_' + slot.time.replace(':', '-') : '');
    try {
      await deleteDoc(doc(db, 'blocked_slots', slotId));
    } catch (e) {
      console.error("Error removing blocked slot:", e);
      setBlockedSlots(prev => prev.filter((s) => !(s.date === slot.date && s.time === slot.time)));
    }
  };

  const handleAddService = async (newService: Service) => {
    try {
      await setDoc(doc(db, 'services', newService.id), newService);
    } catch (e) {
      console.error("Error adding service:", e);
      setServices(prev => [...prev, newService]);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (e) {
      console.error("Error deleting service:", e);
      setServices(prev => prev.filter((s) => s.id !== serviceId));
    }
  };

  const handleAddCampaign = async (campaign: Campaign) => {
    try {
      await setDoc(doc(db, 'campaigns', campaign.id), campaign);
    } catch (e) {
      console.error("Error adding campaign:", e);
      setCampaigns(prev => [...prev, campaign]);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteDoc(doc(db, 'campaigns', campaignId));
    } catch (e) {
      console.error("Error deleting campaign:", e);
      setCampaigns(prev => prev.filter((c) => c.id !== campaignId));
    }
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle opening the public booking modal instead of directly opening WhatsApp
  const handleOpenBookingModal = (serviceId?: string, date?: string, time?: string) => {
    setBookingModalInitialServiceId(serviceId || null);
    setBookingModalInitialDate(date);
    setBookingModalInitialTime(time);
    setIsBookingModalOpen(true);
  };

  // Submit handler for public bookings: saves in Firestore and then redirects to WhatsApp
  const handleConfirmPublicBooking = async (newBookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const bookingId = 'b-' + Math.random().toString(36).substr(2, 9);
    const newBooking: Booking = {
      id: bookingId,
      ...newBookingData,
      status: 'pendente', // Public bookings are initially pending
      createdAt: new Date().toISOString(),
    };
    
    // Save to Firestore so it shows up in Ana's dashboard immediately
    await setDoc(doc(db, 'bookings', bookingId), newBooking);

    // Format highly polished WhatsApp text
    const service = services.find((s) => s.id === newBookingData.serviceId);
    let message = `Olá Dra. Ana Caroline, acabo de solicitar um agendamento pelo seu site!\n\n✨ *DADOS DO AGENDAMENTO* ✨\n\n👤 *Nome:* ${newBookingData.clientName}\n📞 *WhatsApp:* ${newBookingData.clientPhone}`;
    if (service) {
      message += `\n🌸 *Procedimento:* ${service.name}`;
    }
    if (newBookingData.date) {
      const parts = newBookingData.date.split('-');
      const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : newBookingData.date;
      message += `\n📅 *Data:* ${formattedDate}`;
    }
    if (newBookingData.time) {
      message += `\n⏰ *Horário:* ${newBookingData.time}`;
    }
    if (newBookingData.notes) {
      message += `\n📝 *Observações:* ${newBookingData.notes}`;
    }
    message += `\n\nPor favor, confirme se está tudo certinho com o horário solicitado!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5561993133493&text=${encodedMessage}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] selection:bg-gold-200 selection:text-gold-900">
      
      {/* Universal Sticky Header */}
      <Header
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        onBookNow={() => handleOpenBookingModal()}
      />

      {/* Main Content Area */}
      <main className="grow">
        {isAdmin ? (
          /* OWNER/ADMIN VIEW */
          <AdminPanel
            bookings={bookings}
            blockedSlots={blockedSlots}
            onUpdateStatus={handleUpdateStatus}
            onDeleteBooking={handleDeleteBooking}
            onAddBlockedSlot={handleAddBlockedSlot}
            onRemoveBlockedSlot={handleRemoveBlockedSlot}
            onAddManualBooking={handleAddBooking}
            services={services}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
            campaigns={campaigns}
            onAddCampaign={handleAddCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onClearAllBookings={handleClearAllBookings}
            onClearAllServices={handleClearAllServices}
          />
        ) : (
          /* PUBLIC CLIENT-FACING VIEW */
          <div className="animate-fade-in">
            {/* Elegant Branding Hero */}
            <Hero
              onScrollToServices={() => scrollToSection('servicos-section')}
              onScrollToBook={() => handleOpenBookingModal()}
            />

            {/* Aesthetic Banner Info / Quality Pillars */}
            <section className="hidden md:block bg-gold-900 text-gold-100 py-10 md:py-16 px-4 md:px-6 border-y border-gold-950/20">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
                <div className="space-y-3 flex flex-col items-center md:items-start">
                  <div className="w-11 h-11 rounded-full bg-gold-950/40 border border-gold-800/30 flex items-center justify-center text-gold-300">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h5 className="font-serif text-base text-gold-50 uppercase tracking-[0.1em] font-medium mt-1">Horários Flexíveis</h5>
                  <p className="text-xs text-gold-200/80 max-w-xs leading-relaxed font-light">
                    Atendimento personalizado de Segunda a Sábado das 08:00 às 19:00. Agende com facilidade em nosso sistema 100% online.
                  </p>
                </div>
                
                <div className="space-y-3 flex flex-col items-center md:items-start">
                  <div className="w-11 h-11 rounded-full bg-gold-950/40 border border-gold-800/30 flex items-center justify-center text-gold-300">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h5 className="font-serif text-base text-gold-50 uppercase tracking-[0.1em] font-medium mt-1">Cuidado Integrativo</h5>
                  <p className="text-xs text-gold-200/80 max-w-xs leading-relaxed font-light">
                    Tratamentos exclusivos com anamnese individualizada para entender e respeitar a fisiologia e necessidades reais do seu corpo.
                  </p>
                </div>

                <div className="space-y-3 flex flex-col items-center md:items-start">
                  <div className="w-11 h-11 rounded-full bg-gold-950/40 border border-gold-800/30 flex items-center justify-center text-gold-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h5 className="font-serif text-base text-gold-50 uppercase tracking-[0.1em] font-medium mt-1">Alta Tecnologia</h5>
                  <p className="text-xs text-gold-200/80 max-w-xs leading-relaxed font-light">
                    Equipamentos modernos de última geração e os melhores ativos dermocosméticos de marcas premium recomendadas mundialmente.
                  </p>
                </div>
              </div>
            </section>

            {/* Interactive Service Catalog */}
            <ServiceList 
              onSelectService={handleOpenBookingModal} 
              services={services}
              campaigns={campaigns}
            />

            {/* About Us / History & Philosophy */}
            <AboutUs />

            {/* Google Maps / Contact Informative Section */}
            <section className="py-10 md:py-20 px-4 md:px-12 bg-white border-t border-gold-100">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
                {/* Visual Location Frame */}
                <div className="lg:col-span-5 space-y-4 md:space-y-6 text-left">
                  <span className="text-[10px] font-sans tracking-[0.25em] text-gold-600 uppercase font-bold">Localização</span>
                  <h3 className="font-serif text-2xl md:text-3xl text-gold-950 font-light tracking-wide leading-tight">Nosso Espaço Exclusivo</h3>
                  <p className="text-xs md:text-sm font-sans text-gold-800/90 leading-relaxed font-light">
                    Localizado em uma área nobre, tranquila e de fácil acesso, o consultório da Dra. Ana Caroline foi planejado detalhadamente para proporcionar uma experiência de acolhimento, luxo silencioso e relaxamento completo desde o primeiro instante de sua chegada.
                  </p>
                  
                  <div className="space-y-3.5 pt-1 md:pt-2 text-xs font-sans text-gold-800 font-light">
                    <p className="flex items-start space-x-3">
                      <MapPin className="w-4.5 h-4.5 text-gold-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">Quadra 14, Lote 19 - Lunabel 3A, Novo Gama - GO</span>
                    </p>
                    <a 
                      href="https://api.whatsapp.com/send/?phone=5561993133493&text&type=phone_number&app_absent=0&utm_source=ig" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-3 hover:text-gold-600 transition-colors"
                    >
                      <Phone className="w-4.5 h-4.5 text-gold-500 shrink-0" />
                      <span>(61) 99313-3493 (WhatsApp Oficial - Clique aqui)</span>
                    </a>
                    <p className="flex items-center space-x-3">
                      <Clock className="w-4.5 h-4.5 text-gold-500 shrink-0" />
                      <span>Segunda a Sábado: 09:00 às 18:00</span>
                    </p>
                  </div>
                </div>

                {/* Styled CSS Map Card / Aesthetic Placeholder */}
                <div className="lg:col-span-7 h-[260px] md:h-[320px] w-full rounded-2xl md:rounded-3xl border border-gold-100 overflow-hidden relative shadow-md bg-[#FAF8F5] flex flex-col justify-between p-6 md:p-8">
                  <div className="absolute inset-0 bg-linear-to-tr from-gold-100/10 to-gold-200/15" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="bg-gold-900 text-gold-50 text-[10px] font-sans uppercase tracking-widest px-4 py-2 rounded-full font-bold">
                      Ana Caroline Estética
                    </span>
                    <span className="bg-white/90 border border-gold-100 text-gold-900 text-[10px] font-sans px-4 py-2 rounded-full font-semibold">
                      ★★★★★ (5.0 no Google)
                    </span>
                  </div>


                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Elegant Editorial Footer */}
      <footer className="bg-neutral-950 text-gold-200 border-t border-neutral-900 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-center sm:text-left text-xs">
          {/* Col 1: About */}
          <div className="space-y-4 col-span-2 md:col-span-2 pr-0 md:pr-12">
            <h6 className="font-serif text-xl text-white font-light tracking-wide">Ana Caroline - Beleza e Estética</h6>
            <p className="font-sans font-light leading-relaxed text-neutral-400">
              Dedicada a realçar sua beleza natural e essência através de tratamentos estéticos e integrativos faciais, corporais e do olhar. Um refúgio de tranquilidade e sofisticação concebido exclusivamente para você.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 pt-2">
              <a 
                href="https://instagram.com/estetica_anacarolinee" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-850 flex items-center justify-center text-gold-400 hover:text-white transition-colors border border-neutral-800"
                title="Instagram @estetica_anacarolinee"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://api.whatsapp.com/send/?phone=5561993133493&text&type=phone_number&app_absent=0&utm_source=ig" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-850 flex items-center justify-center text-gold-400 hover:text-white transition-colors border border-neutral-800"
                title="WhatsApp Comercial"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-3 col-span-1">
            <h6 className="font-serif text-[10px] text-white font-bold uppercase tracking-widest text-gold-500">Nossas Áreas</h6>
            <ul className="space-y-2.5 font-sans font-light text-neutral-400">
              <li>Estética Facial & Harmonização</li>
              <li>Estética Corporal & Massagens</li>
              <li>Design de Sobrancelhas & Cílios</li>
              <li>Combos Especiais de Beleza</li>
            </ul>
          </div>

          {/* Col 3: Support / Contact */}
          <div className="space-y-3 col-span-1">
            <h6 className="font-serif text-[10px] text-white font-bold uppercase tracking-widest text-gold-500">Atendimento</h6>
            <ul className="space-y-2.5 font-sans font-light text-neutral-400">
              <li>Agendamentos & Consultas</li>
              <li>
                <a 
                  href="https://api.whatsapp.com/send/?phone=5561993133493&text&type=phone_number&app_absent=0&utm_source=ig" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  (61) 99313-3493
                </a>
              </li>
              <li>Lunabel 3A, Novo Gama - GO</li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="max-w-7xl mx-auto border-t border-neutral-900 pt-8 flex flex-col items-center justify-center text-center text-[10px] font-sans text-neutral-500 uppercase tracking-widest font-semibold">
          <p>© 2026 Ana Caroline - Beleza e Estética. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Booking Modal for Public Client-facing view */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        services={services}
        campaigns={campaigns}
        blockedSlots={blockedSlots}
        bookings={bookings}
        onSubmitBooking={handleConfirmPublicBooking}
        initialServiceId={bookingModalInitialServiceId}
        initialDate={bookingModalInitialDate}
        initialTime={bookingModalInitialTime}
      />
    </div>
  );
}
