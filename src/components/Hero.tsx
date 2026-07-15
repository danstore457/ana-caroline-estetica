import { ArrowRight, Sparkles, Heart, ShieldCheck, MapPin } from 'lucide-react';

interface HeroProps {
  onScrollToServices: () => void;
  onScrollToBook: () => void;
}

export default function Hero({ onScrollToServices, onScrollToBook }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-10 md:py-28 px-4 md:px-12 bg-gold-50">
      {/* Background elegant architectural line accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-gold-100)_0%,transparent_60%)] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 space-y-6 md:space-y-10 text-left">
          {/* Tagline */}
          <div className="inline-flex items-center space-x-2 bg-white border border-gold-100 px-4 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-gold-800 font-sans uppercase">
              Cuidado Exclusivo & Integrativo
            </span>
          </div>

          {/* Main Display Typography (Luxury Editorial Style) */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-7xl text-gold-950 font-light leading-[1.1] tracking-tight">
              Sua beleza de forma <br />
              <span className="font-serif italic font-normal text-gold-500">natural e sofisticada</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm md:text-base text-gold-800 max-w-xl font-light leading-relaxed">
              No espaço <strong className="font-semibold text-gold-900">Ana Caroline</strong>, combinamos técnicas de estética avançada e tratamentos personalizados para revigorar sua pele, modelar seu corpo e proporcionar bem-estar profundo em um refúgio acolhedor e seguro.
            </p>
          </div>

          {/* Key Quick Info */}
          <div className="flex flex-wrap gap-2 text-[9px] md:text-[10px] font-sans text-gold-800 font-semibold tracking-wider uppercase">
            <div className="flex items-center space-x-1.5 bg-white border border-gold-100 px-3 py-2 md:px-4 md:py-2.5 rounded-full shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-500" />
              <span>Estética Avançada</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white border border-gold-100 px-3 py-2 md:px-4 md:py-2.5 rounded-full shadow-xs">
              <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-500" />
              <span>Cosméticos Premium</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white border border-gold-100 px-3 py-2 md:px-4 md:py-2.5 rounded-full shadow-xs">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-500" />
              <span>Atendimento Exclusivo</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
            <button
              onClick={onScrollToBook}
              id="hero-book-now-btn"
              className="group flex items-center justify-center space-x-2 bg-gold-900 hover:bg-gold-950 text-white font-sans text-xs font-bold tracking-[0.2em] uppercase px-6 py-3.5 md:px-10 md:py-4.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>Agendar Agora</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onScrollToServices}
              id="hero-services-btn"
              className="flex items-center justify-center space-x-2 border border-gold-300 hover:border-gold-500 bg-white hover:bg-gold-50 text-gold-900 font-sans text-xs font-bold tracking-[0.2em] uppercase px-6 py-3.5 md:px-10 md:py-4.5 rounded-full transition-all duration-300 cursor-pointer"
            >
              <span>Serviços</span>
            </button>
          </div>
        </div>

        {/* Right Column: Beautiful CSS-Based High-Fidelity Editorial Card Illustration */}
        <div className="lg:col-span-5 relative w-full h-[340px] md:h-[480px] flex items-center justify-center select-none">
          {/* Main Decorative Arch Frame */}
          <div className="relative w-64 h-[320px] md:w-84 md:h-[450px] rounded-t-full border border-gold-200 bg-white p-4 md:p-5 shadow-md flex flex-col justify-end overflow-hidden">
            {/* Soft internal aesthetic shape */}
            <div className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-gold-100 to-gold-200/50 blur-xl" />
            
            {/* Center Artistic Flower Outline or Abstract Arch */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border border-gold-400 border-dashed animate-spin-slow" />
            </div>

            {/* Premium Quote in the arch */}
            <div className="relative z-10 text-center pb-4 md:pb-8 px-2 md:px-4">
              <span className="font-serif italic text-lg md:text-2xl text-gold-900 block mb-2 md:mb-3 leading-relaxed">
                "O autocuidado é a mais bela forma de expressar carinho por si mesma."
              </span>
              <span className="text-[9px] font-sans tracking-[0.25em] text-gold-500 uppercase font-bold">
                Estética Integrativa
              </span>
            </div>
          </div>

          {/* Floating High-Fidelity Widgets demonstrating the scheduling app features */}
          
          {/* Widget 3: Small Stats Circle */}
          <div className="absolute top-1/2 -right-4 md:-right-8 w-13 h-13 md:w-18 md:h-18 rounded-full bg-gold-900 text-white flex flex-col items-center justify-center shadow-lg text-center leading-none">
            <span className="font-serif text-sm md:text-xl font-normal text-gold-500">100%</span>
            <span className="text-[7px] md:text-[8px] font-sans tracking-wide uppercase mt-0.5 md:mt-1 font-semibold text-gold-100">Seguro</span>
          </div>
        </div>
      </div>
    </section>
  );
}

