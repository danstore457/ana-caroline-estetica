
interface AboutUsProps {
  ownerPhoto?: string;
  photoScale?: number;
  photoX?: number;
  photoY?: number;
}

export default function AboutUs({ ownerPhoto, photoScale = 1, photoX = 0, photoY = 0 }: AboutUsProps) {
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
            <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-3xl border border-gold-200 bg-white pt-2.5 pb-3.5 px-3 md:pt-3 md:pb-4.5 md:px-4 shadow-md flex flex-col overflow-hidden">
              <div className="w-full h-58 md:h-74 rounded-2xl bg-linear-to-tr from-gold-100 to-gold-200/40 flex items-center justify-center overflow-hidden border border-gold-100">
                {ownerPhoto ? (
                  <img
                    src={ownerPhoto}
                    alt="Ana Caroline"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover origin-center"
                    style={{
                      objectPosition: `${50 + photoX}% ${50 + photoY}%`,
                      transform: `scale(${photoScale})`
                    }}
                  />
                ) : (
                  /* Simulated Silhouette elegant and professional */
                  <div className="text-gold-500 font-serif text-7xl md:text-8xl select-none font-light italic">
                    AC
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center text-center pt-2 pb-1 px-2">
                <span className="font-serif text-lg md:text-xl text-gold-950 font-normal block leading-tight">
                  Ana Caroline
                </span>
                <span className="text-[8px] md:text-[9px] font-sans tracking-[0.2em] text-gold-500 uppercase font-bold mt-1 block">
                  Fundadora & Esteticista
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



      </div>
    </section>
  );
}
