import { Instagram, Facebook } from "lucide-react";
import {  useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  // Función genérica para manejar scroll o navegación
  function handleNavigate(sectionId: string, path = "/") {
    if (window.location.pathname === path) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      sessionStorage.setItem("scrollToSection", sectionId);
      navigate(path);
    }
  }

  return (
    <footer className="bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 text-white py-8 md:py-12 border-t border-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand and Purpose */}
          <div className="text-left">
            <h3 className="font-serif text-2xl font-bold tracking-wide mb-2">
              Daisy <span className="font-light italic text-white">Perfumes Artesanales</span>
            </h3>
            <p className="text-white/80 font-light mb-4 leading-relaxed text-sm max-w-xs">
              Fragancias modernas y elegantes para quienes buscan distinción y sofisticación en cada detalle.
            </p>
            <div className="flex justify-start space-x-3">
              {[Instagram, Facebook].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-white/10 border border-white/20 p-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                >
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Secciones de la página */}
          <div className="text-left">
            <h4 className="text-white font-semibold mb-2 uppercase text-sm tracking-wide">
              Secciones de la página
            </h4>
            <ul className="space-y-1 text-sm">
            
              <li>
                <button
                  onClick={() => handleNavigate("products", "/")}
                  className="text-white/80 hover:text-white transition duration-200 no-underline"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  Catálogo
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/track-order")}
                  className="text-white/80 hover:text-white transition duration-200 no-underline"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  Seguimiento
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("contact", "/")}
                  className="text-white/80 hover:text-white transition duration-200 no-underline"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  Contacto
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/admin")}
                  className="text-white/80 hover:text-white transition duration-200 no-underline"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  Panel de Administración
                </button>
              </li>
            </ul>
          </div>

          {/* Designer Info */}
          <div className="text-left">
            <div className="font-light text-sm text-white/80 space-y-1">
              <p className="text-xs text-white/50 uppercase tracking-wide">Desarrollado por</p>
              <p className="font-medium">Sebastián Alejandro Reibold</p>
              <p className="text-xs text-white/50">Obbware Technology</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
