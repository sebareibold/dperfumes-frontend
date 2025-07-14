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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f7f3ee] via-[#ede6db] to-[#e5dfd6]">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bfa77a]/20 border-t-[#bfa77a] mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-[#bfa77a]/10 mx-auto"></div>
          </div>
          <p className="text-[#2d2a26] text-lg font-serif">Cargando experiencia Daisy...</p>
        </div>
      </div>
    )
  }

  if (contentError || !siteContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f3ee] via-[#ede6db] to-[#e5dfd6] flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#e5dfd6] shadow-xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h2 className="font-serif text-xl font-medium text-[#2d2a26] mb-4">Error al cargar contenido</h2>
          <p className="text-[#2d2a26]/70 mb-6">{contentError || "Contenido no disponible."}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#2d2a26] to-[#bfa77a] text-white font-serif rounded-2xl hover:scale-105 transition-transform duration-300"
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
