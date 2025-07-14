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
      {/* SVGs decorativos solo para MOBILE (esquinas) */}
      {/* Esquina inferior izquierda */}
      <svg
        className="block md:hidden absolute -left-0 bottom-20 w-full h-50 z-0 pointer-events-none select-none"
        viewBox="0 0 300 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke="#222" strokeWidth="1" opacity="0.18"> 
          <path d="M0 90 Q 50 60 100 90 T 200 90 T 300 90" fill="none" />
          <path d="M0 100 Q 60 80 120 100 T 240 100 T 300 100" fill="none" />
        </g>
      </svg>
      {/* Esquina superior derecha */}
      <svg
        className="block md:hidden absolute -right-3 top-10 w-full h-50 z-0 pointer-events-none select-none"
        style={{ transform: 'rotate(-10deg)'}}

        viewBox="0 0 300 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke="#222" strokeWidth="1" opacity="0.18">
          <path d="M0 10 Q 50 40 100 10 T 200 10 T 300 10" fill="none" />
          <path d="M0 0 Q 60 20 120 0 T 240 0 T 300 0" fill="none" />
        </g>
      </svg>
      {/* SVGs decorativos solo para DESKTOP (como estaban) */}
      {/* Esquina inferior izquierda, inclinada hacia arriba */}
      <svg
        className="hidden md:block absolute -left-60 top-20 w-full h-[50vh] z-0 pointer-events-none select-none"
        style={{ minWidth: '100vw', transform: 'rotate(-30deg)', transformOrigin: 'bottom left' }}
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
        className="hidden md:block absolute left-300 top-90 w-[60vw] h-[90vh] z-0 pointer-events-none select-none"
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
      <div className="relative z-10 max-w-8xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:gap-8 lg:gap-20 py-8 sm:py-12 lg:py-20 lg:px-55">
          {/* Content */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8 px-8 sm:px-0 min-w-0 lg:min-w-[400px] lg:pl-16">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-semibold uppercase tracking-[0.18em] text-black mb-4 sm:mb-6 leading-tight">
              {content.slogan}
            </h1>
            <p className="text-xs sm:text-sm text-black font-light tracking-wide leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-10" style={{letterSpacing: '0.08em'}}>
              {content.mainDescription}
            </p>
            <button
              className="w-full sm:w-auto inline-block border border-black text-black bg-[#F2F4F7] backdrop-blur-sm px-10 py-3 rounded-full font-sans text-base uppercase tracking-widest font-normal transition-all duration-300 hover:bg-black hover:text-white focus:outline-none shadow-sm hover:shadow-lg"
              onClick={() => navigate('/#products')}
            >
              {content.buttonText}
            </button>
          </div>
          {/* Imagenes */}
          <div className="flex-1 flex flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-8 w-full min-w-0 lg:min-w-[540px] relative">
            {/* Imagen principal */}
            <div className="relative group w-40 sm:w-32 md:w-48 lg:w-64 flex-shrink-0">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-gray-100 to-white rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <img
                src="/p2.jpg"
                alt={content.heroImage?.alt || "Perfume elegante"}
                className="hero-image-primary relative w-full h-auto object-contain rounded-xl shadow-2xl border border-gray-200 bg-white z-20 transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500 ease-out hover:shadow-3xl"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {/* Imagen secundaria */}
            <div className="relative group w-28 sm:w-24 md:w-36 lg:w-48 flex-shrink-0">
              <div className="absolute -inset-1.5 sm:-inset-3 bg-gradient-to-r from-white to-gray-100 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <img
                src="/pe.jpg"
                alt="Perfume 2"
                className="hero-image-secondary relative w-full h-auto object-contain rounded-lg shadow-xl border border-gray-200 bg-white z-10 transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 ease-out hover:shadow-2xl"
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
