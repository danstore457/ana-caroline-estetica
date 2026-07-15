import { ShieldCheck, Heart, Sparkles, Award, Users, Coffee } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="sobre-nos-section" className="py-12 md:py-24 px-4 md:px-12 bg-gold-50/40 border-t border-gold-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-sans tracking-[0.25em] text-gold-500 uppercase font-bold">
            Conheça Nossa Essência
          </span>
          <h3 className="font-serif text-2xl sm:text-3.5xl md:text-5xl text-gold-950 font-light tracking-wide">
            Sobre Nós & Filosofia
          </h3>
          <p className="text-xs sm:text-sm font-sans text-gold-800/80 font-light leading-relaxed">
            Unimos a precisão da ciência estética à sensibilidade do cuidado humanizado para celebrar e revelar a sua beleza mais autêntica.
          </p>
        </div>

        {/* Founder Spot - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Founder Graphic/Avatar Placeholder (Premium CSS Design) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-t-full border border-gold-200 bg-white p-4 shadow-md flex flex-col justify-end overflow-hidden">
              <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full bg-linear-to-tr from-gold-100 to-gold-200/40 flex items-center justify-center">
                {/* Simulated Silhouette elegant and professional */}
                <div className="text-gold-500 font-serif text-7xl md:text-8xl select-none font-light italic">
                  AC
                </div>
              </div>
              
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent pt-8 md:pt-12 pb-4 md:pb-6 px-4 md:px-6 text-center z-10">
                <span className="font-serif text-xl md:text-2xl text-gold-950 font-normal block leading-tight">
                  Ana Caroline
                </span>
                <span className="text-[8px] md:text-[9px] font-sans tracking-[0.2em] text-gold-500 uppercase font-bold mt-1 block">
                  Fundadora & Esteticista Integrativa
                </span>
              </div>
            </div>
          </div>

          {/* Founder Content */}
          <div className="lg:col-span-7 space-y-4 md:space-y-6 text-left">
            <div className="space-y-3 md:space-y-4">
              <h4 className="font-serif text-xl md:text-2xl text-gold-950 font-normal tracking-wide">
                A Jornada de Ana Caroline
              </h4>
              <p className="text-xs md:text-sm font-sans text-gold-800 font-light leading-relaxed">
                Formada em Estética e Cosmética Avançada com especialização em terapias integrativas corporais e faciais, a esteticista <strong className="font-semibold text-gold-900">Ana Caroline</strong> fundou o espaço com o propósito de redefinir o conceito de beleza. Para ela, a estética não se resume a padrões impostos, mas sim a um ato de cuidado profundo, saúde e reconexão com o próprio corpo.
              </p>
              <p className="text-xs md:text-sm font-sans text-gold-800 font-light leading-relaxed">
                Cada protocolo executado em nosso espaço carrega sua mentoria e carinho, fundamentados em estudos contínuos de anatomia facial, fisiologia da pele e cosmetologia de ponta.
              </p>
            </div>

            {/* Elegant Quote */}
            <blockquote className="border-l-2 border-gold-300 pl-4 py-1 italic font-serif text-sm md:text-base text-gold-900/90 leading-relaxed">
              "Buscamos o luxo do silêncio, do toque cuidadoso e da escuta active. Aqui, você não é apenas uma cliente, mas sim uma história única de bem-estar a ser celebrada."
            </blockquote>

            {/* Quick stats / trust pillars */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gold-100">
              <div className="space-y-1">
                <strong className="font-serif text-lg md:text-2xl text-gold-900 block font-light">5 Anos</strong>
                <span className="text-[8px] md:text-[9px] font-sans text-gold-500 uppercase font-bold tracking-wider block">De Experiência</span>
              </div>
              <div className="space-y-1">
                <strong className="font-serif text-lg md:text-2xl text-gold-900 block font-light">2.5k+</strong>
                <span className="text-[8px] md:text-[9px] font-sans text-gold-500 uppercase font-bold tracking-wider block">Clientes Felizes</span>
              </div>
              <div className="space-y-1">
                <strong className="font-serif text-lg md:text-2xl text-gold-900 block font-light">100%</strong>
                <span className="text-[8px] md:text-[9px] font-sans text-gold-500 uppercase font-bold tracking-wider block">Humanizado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Philosophy & Differentials - Bento Style */}
        <div className="space-y-6 md:space-y-8">
          <div className="border-b border-gold-100 pb-3 md:pb-4 text-left">
            <h4 className="font-serif text-xl md:text-2xl text-gold-950 font-normal tracking-wide">
              Nossos Pilares & Diferenciais
            </h4>
            <p className="text-[10px] md:text-xs text-gold-600 font-sans mt-0.5">Por que escolher o espaço Ana Caroline?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Differential 1: Anamnese */}
            <div className="bg-white border border-gold-100 p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xs text-left space-y-3 md:space-y-4 hover:border-gold-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600">
                <Heart className="w-5 h-5 text-gold-500" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-base text-gold-950 font-semibold">Anamnese Individualizada</h5>
                <p className="text-xs text-gold-800 font-light leading-relaxed">
                  Não trabalhamos com pacotes prontos ou genéricos. Antes de qualquer procedimento, realizamos uma avaliação profunda das suas necessidades, rotina e fisiologia para indicar o tratamento perfeito.
                </p>
              </div>
            </div>

            {/* Differential 2: Dermocosméticos Premium */}
            <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs text-left space-y-4 hover:border-gold-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600">
                <ShieldCheck className="w-5 h-5 text-gold-500" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-base text-gold-950 font-semibold">Cosméticos de Padrão Ouro</h5>
                <p className="text-xs text-gold-800 font-light leading-relaxed">
                  Utilizamos exclusivamente ativos dermocosméticos de marcas renomadas internacionalmente e regulamentadas, livres de parabenos e metais pesados, garantindo total segurança e alta eficácia.
                </p>
              </div>
            </div>

            {/* Differential 3: Tecnologia e Segurança */}
            <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs text-left space-y-4 hover:border-gold-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600">
                <Sparkles className="w-5 h-5 text-gold-500" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-base text-gold-950 font-semibold">Tecnologia Certificada</h5>
                <p className="text-xs text-gold-800 font-light leading-relaxed">
                  Nossos equipamentos modernos de alta tecnologia (como eletrocautério, vapor de ozônio e aparelhos de laser) passam por manutenções preventivas e calibragens rigorosas para que sua sessão seja perfeitamente segura.
                </p>
              </div>
            </div>

            {/* Differential 4: Estética do Olhar */}
            <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs text-left space-y-4 hover:border-gold-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600">
                <Award className="w-5 h-5 text-gold-500" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-base text-gold-950 font-semibold">Especialistas do Olhar</h5>
                <p className="text-xs text-gold-800 font-light leading-relaxed">
                  Nossa equipe de lash artists e designers de sobrancelhas dominam o visagismo facial, permitindo que a curvatura dos seus cílios e o desenho de sua sobrancelha harmonizem e realcem seus traços com luxo e delicadeza.
                </p>
              </div>
            </div>

            {/* Differential 5: Equipe Altamente Qualificada */}
            <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs text-left space-y-4 hover:border-gold-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600">
                <Users className="w-5 h-5 text-gold-500" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-base text-gold-950 font-semibold">Equipe Multidisciplinar</h5>
                <p className="text-xs text-gold-800 font-light leading-relaxed">
                  Nossas profissionais passam por treinamentos técnicos e humanizados mensais. Desde a recepção atenciosa até as terapeutas qualificadas, cada momento é focado no seu acolhimento e escuta ativa.
                </p>
              </div>
            </div>

            {/* Differential 6: Hospitalidade & Valet */}
            <div className="bg-white border border-gold-100 p-6 rounded-3xl shadow-xs text-left space-y-4 hover:border-gold-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600">
                <Coffee className="w-5 h-5 text-gold-500" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-base text-gold-950 font-semibold">Hospitalidade & Valet Grátis</h5>
                <p className="text-xs text-gold-800 font-light leading-relaxed">
                  Oferecemos um delicioso cardápio de chás herbais e águas aromatizadas em cabines climatizadas com música suave. Além disso, contamos com serviço de manobrista gratuito para sua total conveniência e tranquilidade.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
