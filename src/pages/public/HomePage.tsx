"use client"

import HeroSection from "../../components/home/HeroSection"
import ProductCatalog from "../../components/home/ProductCatalog"
import ContactSection from "../../components/home/ContactSection"
import { useState, useEffect } from "react"
import { apiService } from "../../services/api"

interface CategoryContent {
  name: string
  display_name: string
}

interface ValueContent {
  icon: string
  title: string
  description: string
}

interface ContactDetailContent {
  icon: string
  title: string
  details: string[]
  description?: string
}

interface SocialMediaLinkContent {
  icon: string
  name: string
  handle: string
  link: string
}

interface SiteContent {
  hero: {
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
  productCatalog: {
    mainTitle: string
    subtitle: string
    categories: CategoryContent[]
  }
  whyChooseJoly: {
    mainTitle: string
    description: string
    values: ValueContent[]
  }
  contact: {
    mainTitle: string
    subtitle: string
    description: string
    formTitle: string
    formDescription: string
    responseMessage: string
    responseDisclaimer: string
    contactInfo: ContactDetailContent[]
    socialMedia: SocialMediaLinkContent[]
  }
}

export default function HomePage() {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null)
  const [loadingContent, setLoadingContent] = useState(true)
  const [contentError, setContentError] = useState<string | null>(null)

  useEffect(() => {
    const loadSiteContent = async () => {
      try {
        setLoadingContent(true)
        const response = await apiService.getSiteContent()
        if (response.success) {
          setSiteContent(response.content)
        } else {
          setContentError(response.error || "Error al cargar el contenido del sitio.")
        }
      } catch (err) {
        console.error("Error fetching site content:", err)
        setContentError("No se pudo cargar el contenido del sitio. Intente recargar la página.")
      } finally {
        setLoadingContent(false)
      }
    }
    loadSiteContent()
  }, [])

  useEffect(() => {
    const sectionId = sessionStorage.getItem("scrollToSection");
    if (sectionId) {
      sessionStorage.removeItem("scrollToSection");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, []);

  if (loadingContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="flex flex-col items-center">
          <style>{`
            .loader {
              width: 80px;
              height: 50px;
              position: relative;
            }
            .loader-text {
              position: absolute;
              top: 0;
              padding: 0;
              margin: 0;
              color: #222;
              animation: text_713 3.5s ease both infinite;
              font-size: .8rem;
              letter-spacing: 1px;
              font-family: 'Public Sans', 'Roboto', Arial, sans-serif;
            }
            .load {
              background-color: #111;
              border-radius: 50px;
              display: block;
              height: 16px;
              width: 16px;
              bottom: 0;
              position: absolute;
              transform: translateX(64px);
              animation: loading_713 3.5s ease both infinite;
            }
            .load::before {
              position: absolute;
              content: "";
              width: 100%;
              height: 100%;
              background-color: #444;
              border-radius: inherit;
              animation: loading2_713 3.5s ease both infinite;
            }
            @keyframes text_713 {
              0% { letter-spacing: 1px; transform: translateX(0px); }
              40% { letter-spacing: 2px; transform: translateX(26px); }
              80% { letter-spacing: 1px; transform: translateX(32px); }
              90% { letter-spacing: 2px; transform: translateX(0px); }
              100% { letter-spacing: 1px; transform: translateX(0px); }
            }
            @keyframes loading_713 {
              0% { width: 16px; transform: translateX(0px); }
              40% { width: 100%; transform: translateX(0px); }
              80% { width: 16px; transform: translateX(64px); }
              90% { width: 100%; transform: translateX(0px); }
              100% { width: 16px; transform: translateX(0px); }
            }
            @keyframes loading2_713 {
              0% { transform: translateX(0px); width: 16px; }
              40% { transform: translateX(0%); width: 80%; }
              80% { width: 100%; transform: translateX(0px); }
              90% { width: 80%; transform: translateX(15px); }
              100% { transform: translateX(0px); width: 16px; }
            }
          `}</style>
          <div className="loader">
            <span className="loader-text">Cargando</span>
            <span className="load" />
          </div>
        </div>
      </div>
    )
  }

  if (contentError || !siteContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="bg-gradient-to-br from-black via-neutral-900 to-neutral-800 bg-opacity-90 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center w-full max-w-xs border border-black/30">
          <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-white/10">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2 text-center">Error al cargar contenido</h2>
          <p className="text-gray-300 mb-6 text-center">{contentError || "Contenido no disponible."}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white font-medium shadow hover:from-gray-900 hover:to-black transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {siteContent.hero && <HeroSection content={siteContent.hero} />}
      {siteContent.productCatalog && <ProductCatalog content={siteContent.productCatalog} />}
      {siteContent.contact && <ContactSection content={siteContent.contact} />}
    </div>
  )
}
