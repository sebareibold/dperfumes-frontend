import { Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-transparent text-[var(--neutral-white)] py-8 md:py-12 border-t border-[var(--primary-blue)]/30 shadow-elegant-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Brand and Purpose */}
          <div className="md:col-span-1 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold tracking-wide mb-2 gradient-text">
              Daisy <span className="font-light italic text-[var(--neutral-white)]">Perfumes</span>
            </h3>
            <p className="text-[var(--neutral-white)] font-light mb-4 max-w-md mx-auto md:mx-0 leading-relaxed text-sm">
              Fragancias modernas y elegantes para quienes buscan distinción y sofisticación en cada detalle.
            </p>
            <div className="flex space-x-3 justify-center md:justify-start">
              {[Instagram, Facebook].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="badge-gradient p-2 rounded-full hover:scale-110 transition-all duration-300 shadow-elegant"
                >
                  <Icon className="h-4 w-4 text-[var(--neutral-white)] icon-elegant" />
                </a>
              ))}
            </div>
          </div>

          {/* Designer Info */}
          <div className="md:col-span-1 text-center md:text-right mt-4 md:mt-0">
            <div className="font-light text-sm text-[var(--neutral-white)] space-y-1">
              <p className="text-xs text-[var(--primary-blue)] uppercase tracking-wide">Desarrollado por</p>
              <p className="font-medium">Sebastián Alejandro Reibold</p>
              <p className="text-xs text-[var(--primary-blue)]">Obbware Technology</p>
            </div>
          </div>
        </div>
      </div>
      {/* Botón visible en todas las resoluciones para ir al backoffice */}
      <div className="flex justify-center mt-4 mb-2">
        <Link
          to="/admin"
          className="btn-primary gradient-hover"
        >
          Ir al Backoffice
        </Link>
      </div>
    </footer>
  );
}
