import { useState } from 'react';
import { CATEGORIES, AVAILABLE_HOURS, Service, ServiceCategory, Campaign } from '../types';
import { Filter, Search, Clock, Sparkles, HelpCircle, Calendar } from 'lucide-react';

interface ServiceListProps {
  onSelectService: (serviceId: string, date?: string, time?: string) => void;
  services: Service[];
  campaigns?: Campaign[];
}

export default function ServiceList({ onSelectService, services, campaigns = [] }: ServiceListProps) {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'todos' | 'pacotes'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});

  // Filter logic
  const filteredServices = services.filter((service) => {
    let matchesCategory = false;
    if (selectedCategory === 'todos') {
      matchesCategory = true;
    } else if (selectedCategory === 'pacotes') {
      matchesCategory = service.isPackage === true;
    } else {
      matchesCategory = service.category === selectedCategory;
    }

    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="servicos-section" className="py-12 md:py-24 px-4 md:px-12 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-14">
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-sans tracking-[0.25em] text-gold-500 uppercase font-bold">
            Menu de Serviços
          </span>
          <h3 className="font-serif text-2xl sm:text-3.5xl md:text-5xl text-gold-900 font-light tracking-wide">
            Nossos Protocolos & Tratamentos
          </h3>
          <p className="text-xs sm:text-sm font-sans text-gold-800/80 font-light leading-relaxed">
            Cada corpo é único. Oferecemos soluções personalizadas com as melhores técnicas e ativos do mercado para realçar sua essência e promover saúde integral.
          </p>
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-between items-center bg-gold-50 p-3.5 md:p-5 rounded-2xl md:rounded-3xl border border-gold-100">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
            <button
              onClick={() => setSelectedCategory('todos')}
              id="cat-tab-todos"
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-gold-900 text-white shadow-sm'
                  : 'bg-white text-gold-800 hover:bg-gold-50 border border-gold-100'
              }`}
            >
              Todos
            </button>

            <button
              onClick={() => setSelectedCategory('pacotes')}
              id="cat-tab-pacotes"
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === 'pacotes'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-current" />
              <span>Pacotes</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                id={`cat-tab-${cat.id}`}
                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gold-900 text-white shadow-sm'
                    : 'bg-white text-gold-800 hover:bg-gold-50 border border-gold-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
            <input
              type="text"
              placeholder="Buscar procedimento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gold-100 focus:border-gold-500 focus:outline-hidden rounded-full py-2.5 pl-11 pr-4 text-xs text-gold-950 placeholder:text-gold-400/80 transition-all duration-200 shadow-xs"
            />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className={`group relative bg-white border rounded-2xl md:rounded-3xl p-5 md:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 ${
                  service.isPackage
                    ? 'border-amber-200 bg-amber-50/20 hover:border-amber-400'
                    : 'border-gold-100 hover:border-gold-300'
                }`}
              >
                <div className="flex flex-wrap gap-1 absolute top-5 right-5 z-10 justify-end">
                  {service.popular && (
                    <span className="inline-flex items-center space-x-1 bg-gold-500 text-white text-[8px] font-bold tracking-widest font-sans uppercase px-3 py-1 rounded-full shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Popular</span>
                    </span>
                  )}
                  {service.isPackage && (
                    <span className="inline-flex items-center bg-amber-600 text-white text-[8px] font-bold tracking-widest font-sans uppercase px-2.5 py-1 rounded-full shadow-xs">
                      <span>PACOTE COM {service.sessionsCount} SESSÕES</span>
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Category Tag */}
                  <span className="text-[9px] font-sans tracking-[0.2em] text-gold-500 uppercase font-bold">
                    {CATEGORIES.find((c) => c.id === service.category)?.label}
                  </span>

                  {/* Name & Description */}
                  <div className="space-y-2">
                    <h4 className="font-serif text-xl font-normal text-gold-950 tracking-wide group-hover:text-gold-500 transition-colors duration-200">
                      {service.name}
                    </h4>
                    <p className="text-xs font-sans text-gold-800/85 font-light leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Active Campaigns for this Service */}
                  {campaigns.filter((c) => c.serviceId === service.id).map((campaign) => (
                    <div key={campaign.id} className="mt-3 bg-amber-50/70 border border-amber-200/50 rounded-xl p-3.5 space-y-3.5 text-left">
                      <div className="flex items-center space-x-1.5 text-amber-800 text-[9px] font-sans font-bold uppercase tracking-wider border-b border-amber-200/40 pb-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Agenda Especial / Campanha Disponível</span>
                      </div>

                      {/* Select Date */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-amber-800 block">
                          1. Escolha o Dia:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {campaign.dates.map((dateStr) => {
                            const parts = dateStr.split('-');
                            const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateStr;
                            let weekday = '';
                            if (parts.length === 3) {
                              const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                              weekday = ' (' + d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '') + ')';
                            }
                            const isSelected = selectedDates[service.id] === dateStr || (!selectedDates[service.id] && campaign.dates[0] === dateStr);
                            return (
                              <button
                                key={dateStr}
                                type="button"
                                onClick={() => setSelectedDates({ ...selectedDates, [service.id]: dateStr })}
                                className={`text-[9px] font-sans font-semibold px-2 py-1 rounded-md transition shadow-3xs cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-600 text-white border border-amber-600'
                                    : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
                                }`}
                              >
                                {formattedDate}{weekday}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Select Time */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-amber-800 block">
                          2. Escolha o Horário:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(campaign.hours && campaign.hours.length > 0 ? campaign.hours : AVAILABLE_HOURS).map((hourStr) => {
                            const defaultHour = campaign.hours && campaign.hours.length > 0 ? campaign.hours[0] : AVAILABLE_HOURS[0];
                            const isSelected = selectedTimes[service.id] === hourStr || (!selectedTimes[service.id] && defaultHour === hourStr);
                            return (
                              <button
                                key={hourStr}
                                type="button"
                                onClick={() => setSelectedTimes({ ...selectedTimes, [service.id]: hourStr })}
                                className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md transition shadow-3xs cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-600 text-white border border-amber-600'
                                    : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
                                }`}
                              >
                                {hourStr}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {campaign.notes && (
                        <p className="text-[9px] font-sans text-amber-700/80 leading-normal font-light italic pt-1 border-t border-amber-200/30">
                          * {campaign.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                 {/* Price, Duration & CTA Action */}
                <div className="mt-8 pt-5 border-t border-gold-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-gold-500 font-bold tracking-wider uppercase block mb-1">
                      {service.isPackage ? 'Valor do Pacote' : 'Investimento'}
                    </span>
                    <div className="space-y-0.5">
                      <span className="font-serif text-lg font-normal text-gold-900 block leading-none">
                        R$ {service.price.toFixed(2).replace('.', ',')}
                      </span>
                      {service.isPackage && service.sessionsCount && (
                        <span className="text-[9.5px] text-amber-700 font-sans font-semibold block leading-tight">
                          ({service.sessionsCount} sessões de R$ {(service.price / service.sessionsCount).toFixed(2).replace('.', ',')})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1.5 text-[10px] font-mono text-gold-600">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      <span>{service.duration} min</span>
                    </span>

                    <button
                      onClick={() => {
                        const activeCampaign = campaigns.find((c) => c.serviceId === service.id);
                        if (activeCampaign) {
                          const chosenDate = selectedDates[service.id] || activeCampaign.dates[0];
                          const campaignHours = activeCampaign.hours && activeCampaign.hours.length > 0 ? activeCampaign.hours : AVAILABLE_HOURS;
                          const chosenTime = selectedTimes[service.id] || campaignHours[0];
                          onSelectService(service.id, chosenDate, chosenTime);
                        } else {
                          onSelectService(service.id);
                        }
                      }}
                      id={`select-service-btn-${service.id}`}
                      className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white text-[10px] uppercase tracking-widest font-bold px-5 py-2 rounded-full transition-all duration-300 cursor-pointer shadow-xs"
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gold-50/50 border border-gold-100 border-dashed rounded-3xl max-w-md mx-auto space-y-4">
            <HelpCircle className="w-12 h-12 text-gold-300 mx-auto" />
            <h5 className="font-serif text-xl text-gold-900 font-normal">Nenhum serviço encontrado</h5>
            <p className="text-xs text-gold-700/80 font-sans px-8 leading-relaxed">
              Não encontramos resultados para a sua busca ou filtro. Experimente pesquisar por outros termos ou limpar as seleções.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
              }}
              className="text-xs text-gold-500 uppercase tracking-wider font-bold hover:text-gold-900 font-sans cursor-pointer mt-2"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
