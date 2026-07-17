export type ServiceCategory = 'facial' | 'corporal' | 'olhar' | 'depilacao' | 'cursos';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number; // in minutes
  popular?: boolean;
  isPackage?: boolean;
  sessionsCount?: number;
}

export interface Booking {
  id: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt: string;
}

export interface BlockedSlot {
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM (if undefined, whole day is blocked)
}

export interface Campaign {
  id: string;
  serviceId: string;
  dates: string[]; // YYYY-MM-DD format
  hours?: string[]; // HH:MM format
  notes?: string;
}

export const CATEGORIES: { id: ServiceCategory; label: string; description: string }[] = [
  {
    id: 'facial',
    label: 'Estética Facial',
    description: 'Tratamentos de rejuvenescimento, limpeza e purificação para resgatar a luminosidade do seu rosto.',
  },
  {
    id: 'corporal',
    label: 'Estética Corporal',
    description: 'Massagens e tecnologias voltadas para modelagem, relaxamento e redução de medidas.',
  },
  {
    id: 'olhar',
    label: 'Olhar & Cílios',
    description: 'Design de sobrancelhas e realce de cílios para valorizar sua beleza natural com sofisticação.',
  },
  {
    id: 'depilacao',
    label: 'Depilação a Cera',
    description: 'Métodos cuidadosos, higiênicos e confortáveis com ceras naturais para uma pele perfeitamente lisa.',
  },
  {
    id: 'cursos',
    label: 'Cursos & Mentoria',
    description: 'Capacitações profissionais exclusivas ministradas pela Dra. Ana Caroline para decolar sua carreira.',
  },
];

export const SERVICES: Service[] = [
  {
    id: 'limpeza-pele',
    name: 'Limpeza de Pele Profunda',
    description: 'Remoção de impurezas, cravos e células mortas com vapor de ozônio, extração manual cuidadosa, alta frequência bactericida e máscara calmante finalizadora.',
    category: 'facial',
    price: 130,
    duration: 90,
    popular: true,
  },
  {
    id: 'laser-day',
    name: 'Laser Day - Depilação Eficaz',
    description: 'Sessão especial de depilação e renovação com tecnologia laser de última geração. Rapidez, segurança e eficácia comprovada para eliminar os pelos indesejados.',
    category: 'facial',
    price: 180,
    duration: 45,
    popular: true,
  },
  {
    id: 'remocao-verruga',
    name: 'Remoção de Verruga (Eletrocautério)',
    description: 'Procedimento seguro e rápido utilizando eletrocautério para remoção de pequenas verrugas e acrocórdons, com cicatrização acelerada e mínima marca.',
    category: 'facial',
    price: 90,
    duration: 30,
  },
  {
    id: 'peeling-diamante',
    name: 'Peeling de Diamante + Hidratação',
    description: 'Microesfoliação física delicada para renovação celular, amenizar linhas finas e manchas, seguida de aplicação de máscara super hidratante com ácido hialurônico.',
    category: 'facial',
    price: 150,
    duration: 60,
  },
  {
    id: 'terapia-capilar',
    name: 'Terapia Capilar Integrativa',
    description: 'Tratamento focado na saúde do couro cabeludo e estímulo ao crescimento dos fios. Inclui argiloterapia, massagem craniana, alta frequência e infusão de tônicos.',
    category: 'facial',
    price: 160,
    duration: 60,
  },
  {
    id: 'microagulhamento',
    name: 'Microagulhamento Drug Delivery',
    description: 'Indução de colágeno através de microagulhas com infusão de séruns clareadores e rejuvenescedores de alta performance. Excelente para marcas e viço.',
    category: 'facial',
    price: 260,
    duration: 75,
  },
  {
    id: 'massagem-relaxante',
    name: 'Massagem Relaxante com Óleos',
    description: 'Massagem relaxante corporal completa utilizando óleos essenciais aquecidos. Alivia tensões musculares, estresse e promove uma profunda sensação de paz.',
    category: 'corporal',
    price: 120,
    duration: 60,
    popular: true,
    isPackage: true,
    sessionsCount: 8,
  },
  {
    id: 'ventosa-terapia',
    name: 'Ventosaterapia Terapêutica',
    description: 'Aplicação de ventosas de sucção para liberação miofascial profunda, melhora do fluxo sanguíneo, alívio de dores nas costas e liberação de toxinas acumuladas.',
    category: 'corporal',
    price: 120,
    duration: 50,
    isPackage: true,
    sessionsCount: 8,
  },
  {
    id: 'drenagem-linfatica',
    name: 'Drenagem Linfática Corporal',
    description: 'Técnica manual suave para estimular o sistema linfático, reduzir a retenção de líquidos, desinchar o corpo e auxiliar na eliminação de toxinas do organismo.',
    category: 'corporal',
    price: 480,
    duration: 60,
    isPackage: true,
    sessionsCount: 8,
  },
  {
    id: 'massagem-modeladora',
    name: 'Massagem Modeladora Ativa',
    description: 'Movimentos firmes, rápidos e vigorosos para ativar a circulação, auxiliar na modelagem do contorno corporal e combater a celulite e gordura localizada.',
    category: 'corporal',
    price: 600,
    duration: 50,
    isPackage: true,
    sessionsCount: 8,
  },
  {
    id: 'massagem-dreno-modeladora',
    name: 'Massagem Dreno Modeladora',
    description: 'Protocolo exclusivo combinando drenagem linfática e manobras modeladoras intensas para desintoxicação corporal, melhora da silhueta e redução de retenção hídrica.',
    category: 'corporal',
    price: 800,
    duration: 60,
    isPackage: true,
    sessionsCount: 8,
  },
  {
    id: 'lash-lifting',
    name: 'Lash Lifting + Hidratação Nutritiva',
    description: 'Curvatura e alinhamento natural dos seus próprios cílios, deixando-os mais longos e definidos, finalizado com um tratamento reconstrutor de queratina.',
    category: 'olhar',
    price: 125,
    duration: 60,
  },
  {
    id: 'extensao-fio-fio',
    name: 'Extensão de Cílios Fio a Fio',
    description: 'Aplicação minuciosa de fios sintéticos de seda sobre cada cílio natural. Garante um olhar marcante, volumoso e elegante sem perder a naturalidade.',
    category: 'olhar',
    price: 160,
    duration: 120,
    popular: true,
  },
  {
    id: 'depilacao-cera',
    name: 'Depilação a Cera Suave Completa',
    description: 'Depilação higiênica de perna inteira, axilas e virilha. Realizada com cera hipoalergênica morna natural de camomila e mel para o máximo conforto.',
    category: 'depilacao',
    price: 120,
    duration: 60,
    popular: true,
  },
  {
    id: 'depilacao-egipcia',
    name: 'Depilação Facial Egípcia (Linha)',
    description: 'Remoção completa dos pelos faciais e penugens pela raiz com linha de algodão orgânico. Ideal para peles sensíveis, sem causar flacidez ou manchas.',
    category: 'depilacao',
    price: 50,
    duration: 30,
  },
  {
    id: 'curso-sobrancelhas',
    name: 'Curso de Design & Lash Lifting',
    description: 'Capacitação teórica e prática intensiva para dominar técnicas de mapeamento facial, pinçamento perfeito e aplicação de Lash Lifting de alto padrão.',
    category: 'cursos',
    price: 550,
    duration: 480,
  },
  {
    id: 'curso-vip-estetica',
    name: 'Curso VIP Mentoria de Estética',
    description: 'Mentoria individual e prática VIP de procedimentos faciais avançados e atendimento humanizado para profissionais que buscam excelência total.',
    category: 'cursos',
    price: 1200,
    duration: 360,
  }
];

// Available time slots for booking
export const AVAILABLE_HOURS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    serviceId: 'limpeza-pele',
    clientName: 'Mariana Silva',
    clientPhone: '(61) 99313-3493',
    clientEmail: 'mariana.silva@email.com',
    date: '2026-07-12',
    time: '09:00',
    status: 'confirmado',
    notes: 'Pele muito sensível nas bochechas.',
    createdAt: '2026-07-10T14:30:00Z',
  },
  {
    id: 'b-2',
    serviceId: 'massagem-relaxante',
    clientName: 'Roberto Almeida',
    clientPhone: '(61) 98888-2233',
    clientEmail: 'roberto.a@email.com',
    date: '2026-07-12',
    time: '14:00',
    status: 'pendente',
    notes: 'Foco em dores lombares e pescoço.',
    createdAt: '2026-07-11T09:15:00Z',
  },
  {
    id: 'b-3',
    serviceId: 'extensao-fio-fio',
    clientName: 'Camila Souza',
    clientPhone: '(61) 97777-1122',
    clientEmail: 'camila.souza@email.com',
    date: '2026-07-13',
    time: '11:00',
    status: 'confirmado',
    notes: 'Quer cílios mais suaves e clássicos.',
    createdAt: '2026-07-11T10:00:00Z',
  }
];
