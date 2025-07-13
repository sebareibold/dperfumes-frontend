"use client"

import { useNavigate } from "react-router-dom"

// Estilos CSS personalizados para efectos visuales mejorados
const heroStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    50% { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(0, 0, 0, 0.2); }
  }
  
  .hero-image-primary {
    animation: float 6s ease-in-out infinite;
  }
  
  .hero-image-secondary {
    animation: float 6s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  .hero-image-primary:hover {
    animation: glow 2s ease-in-out infinite;
  }
  
  .hero-image-secondary:hover {
    animation: glow 2s ease-in-out infinite;
  }
  
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35);
  }
`;

interface HeroContent {
  mainDescription: string
  slogan: string
  buttonText: string
  buttonLink: string
  heroImage?: {
    url: string
    alt: string
    filename: string
  }
}

interface HeroSectionProps {
  content: HeroContent | undefined
}

export default function HeroSection({ content }: HeroSectionProps) {
  const navigate = useNavigate()

  if (!content) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        <style>{heroStyles}</style>
        <div className="relative z-10 text-center">
          <p className="text-lg text-black">Contenido del hero no disponible</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <style>{heroStyles}</style>
      {/* Fondo decorativo SVG con ondas en esquinas, ahora inclinadas */}
      {/* Esquina inferior izquierda, inclinada hacia arriba */}
      <svg
        className="absolute left-0 top-0 w-[60vw] h-[50vh] z-0 pointer-events-none select-none"
        style={{ transform: 'rotate(-30deg)', transformOrigin: 'bottom left' }}
        viewBox="0 0 600 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke="#222" strokeWidth="1" opacity="0.18">
          <path d="M0 180 Q 100 120 200 180 T 400 180 T 600 180" fill="none" />
          <path d="M0 190 Q 120 140 240 190 T 480 190 T 600 190" fill="none" />
          <path d="M0 200 Q 140 160 280 200 T 560 200 T 600 200" fill="none" />
          <path d="M0 170 Q 80 110 160 170 T 320 170 T 480 170 T 600 170" fill="none" />
        </g>
      </svg>
      {/* Esquina superior derecha, inclinada hacia abajo */}
      <svg
        className="absolute left-300 top-90 w-[60vw] h-[90vh] z-0 pointer-events-none select-none"
        style={{ transform: 'rotate(-30deg)', transformOrigin: 'bottom left' }}
        viewBox="0 0 600 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke="#222" strokeWidth="1" opacity="0.18">
          <path d="M0 180 Q 100 120 200 180 T 400 180 T 600 180" fill="none" />
          <path d="M0 190 Q 120 140 240 190 T 480 190 T 600 190" fill="none" />
          <path d="M0 200 Q 140 160 280 200 T 560 200 T 600 200" fill="none" />
          <path d="M0 170 Q 80 110 160 170 T 320 170 T 480 170 T 600 170" fill="none" />
        </g>
      </svg>
      <div className="relative z-10 max-w-8xl mx-auto px-6 lg:px-8 w-[75%]">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-20 py-20">
          {/* Content */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-8 min-w-[400px] lg:pl-16">
            <h1 className="font-serif text-3xl md:text-5xl font-semibold uppercase tracking-[0.18em] text-black mb-6 leading-tight">
              {content.slogan}
            </h1>
            <p className="text-xs md:text-sm text-black font-light tracking-wide leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10" style={{letterSpacing: '0.08em'}}>
              {content.mainDescription}
            </p>
            <button
              className="inline-block border border-black text-black bg-[#F2F4F7] backdrop-blur-sm px-10 py-3 rounded-full font-sans text-base uppercase tracking-widest font-normal transition-all duration-300 hover:bg-black hover:text-white focus:outline-none shadow-sm hover:shadow-lg"
              onClick={() => navigate('/#products')}
            >
              {content.buttonText}
            </button>
          </div>
          
          {/* Imagen principal */}
          <div className="flex-1 flex items-center justify-center min-w-[540px] gap-8 relative">
            {/* Imagen principal con efectos mejorados */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-100 to-white rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <img
                src="/p2.jpg"
                alt={content.heroImage?.alt || "Perfume elegante"}
                className="hero-image-primary relative w-64 h-auto object-contain rounded-xl shadow-2xl border border-gray-200 bg-white z-20 transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500 ease-out hover:shadow-3xl"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Imagen secundaria con efectos mejorados */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-white to-gray-100 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <img
                src="/pe.jpg"
                alt="Perfume 2"
                className="hero-image-secondary relative w-48 h-auto object-contain rounded-lg shadow-xl border border-gray-200 bg-white z-10 transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 ease-out hover:shadow-2xl"
                style={{
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
               </div>
        </div>
      </div>
    </section>
  )
}
