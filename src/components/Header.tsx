import { Sparkles, Calendar, ClipboardList } from 'lucide-react';

interface HeaderProps {
  onBookNow: () => void;
  onToggleAdmin: () => void;
  isAdmin: boolean;
}

export default function Header({ onBookNow, onToggleAdmin, isAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-gold-50/95 backdrop-blur-md border-b border-gold-100 py-3 md:py-5 px-4 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name (Chic Editorial Design) */}
        <div 
          className="flex items-center space-x-1 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div>
            <h1 className="font-serif text-lg md:text-xl font-normal tracking-[0.15em] uppercase text-gold-900 leading-none">
              Ana Caroline
            </h1>
            <p className="text-[9px] font-sans tracking-[0.25em] text-gold-500 uppercase mt-1">
              Beleza e Estética
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleAdmin}
            id="admin-toggle-btn"
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 border ${
              isAdmin
                ? 'bg-gold-950 text-gold-50 border-gold-950'
                : 'text-gold-800 bg-white hover:bg-gold-100 border-gold-100'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-gold-500" />
            <span className="hidden sm:inline">
              {isAdmin ? 'Ver Site' : 'Painel Gestor'}
            </span>
          </button>

          {!isAdmin && (
            <button
              onClick={onBookNow}
              id="book-now-header-btn"
              className="flex items-center space-x-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white font-sans text-[10px] uppercase tracking-widest font-semibold px-6 py-2 rounded-full transition-all duration-300 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

