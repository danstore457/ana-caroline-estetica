import { ArrowRight, Sparkles, Heart, ShieldCheck, MapPin } from 'lucide-react';

interface HeroProps {
  onScrollToServices: () => void;
  onScrollToBook: () => void;
}

export default function Hero({ onScrollToServices, onScrollToBook }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-12 md:py-24 px-4 md:px-12 bg-gold-50">
      {/* Background elegant architectural line accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-gold-100)_0%,transparent_60%)] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 flex flex-col items-center">
        {/* Tagline */}
        <div className="inline-flex items-center space-x-2 bg-white border border-gold-100 px-4 py-1.5 rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold-800 font-sans uppercase">
            Cuidado Exclusivo & Integrativo
          </span>
        </div>

        {/* Main Display Typography (Luxury Editorial Style) */}
        <div className="space-y-4 md:space-y-6 max-w-3xl">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-gold-950 font-light leading-[1.15] tracking-tight">
            Sua beleza de forma <br />
            <span className="font-serif italic font-normal text-gold-500">natural e sofisticada</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm md:text-base text-gold-800 font-light leading-relaxed max-w-2xl mx-auto">
            No espaço <strong className="font-semibold text-gold-900">Ana Caroline</strong>, combinamos técnicas de estética avançada e tratamentos personalizados para revigorar sua pele, modelar seu corpo e proporcionar bem-estar profundo em um refúgio acolhedor e seguro.
          </p>
        </div>

        {/* Key Quick Info */}
        <div className="flex flex-wrap justify-center gap-2 text-[9px] md:text-[10px] font-sans text-gold-800 font-semibold tracking-wider uppercase pt-2">
          <div className="flex items-center space-x-1.5 bg-white border border-gold-100 px-3.5 py-2 md:px-4 md:py-2.5 rounded-full shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-500" />
            <span>Estética Avançada</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-white border border-gold-100 px-3.5 py-2 md:px-4 md:py-2.5 rounded-full shadow-xs">
            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-500" />
            <span>Cosméticos Premium</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-white border border-gold-100 px-3.5 py-2 md:px-4 md:py-2.5 rounded-full shadow-xs">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-500" />
            <span>Atendimento Exclusivo</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full sm:w-auto justify-center">
          <button
            onClick={onScrollToBook}
            id="hero-book-now-btn"
            className="group flex items-center justify-center space-x-2 bg-gold-900 hover:bg-gold-950 text-white font-sans text-xs font-bold tracking-[0.2em] uppercase px-8 py-3.5 md:px-10 md:py-4.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <span>Agendar Agora</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onScrollToServices}
            id="hero-services-btn"
            className="flex items-center justify-center space-x-2 border border-gold-300 hover:border-gold-500 bg-white hover:bg-gold-50 text-gold-900 font-sans text-xs font-bold tracking-[0.2em] uppercase px-8 py-3.5 md:px-10 md:py-4.5 rounded-full transition-all duration-300 cursor-pointer"
          >
            <span>Serviços</span>
          </button>
        </div>
      </div>
    </section>
  );
}

