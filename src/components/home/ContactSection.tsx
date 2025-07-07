"use client"

import type React from "react"

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Instagram,
  Facebook,
  X,
  Youtube,
  Linkedin,
  Github,
  Globe,
} from "lucide-react"
import { useState } from "react"
import { apiService } from "../../services/api"

// NUEVO: Interfaz para el contenido de contacto
interface ContactContent {
  mainTitle: string
  subtitle: string
  description: string
  formTitle: string
  formDescription: string
  responseMessage: string
  responseDisclaimer: string
  contactInfo: {
    icon: string
    title: string
    details: string[]
    description?: string
  }[]
  socialMedia: {
    icon: string
    name: string
    handle: string
    link: string
  }[]
}

interface ContactSectionProps {
  content: ContactContent | undefined
}

// Mapeo de nombres de iconos a componentes Lucide React para la previsualización
const iconMap: { [key: string]: React.ElementType } = {
  Mail: Mail,
  Phone: Phone,
  MapPin: MapPin,
  Clock: Clock,
  Instagram: Instagram,
  Facebook: Facebook,
  X: X, // Twitter
  Youtube: Youtube,
  Linkedin: Linkedin,
  Github: Github,
  Globe: Globe,
  // Añade más iconos de redes sociales si es necesario
}

export default function ContactSection({ content }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  if (!content) {
    return (
      <section id="contact" className="py-24 lg:py-32 bg-[#f7f3ee]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-lg text-[#bfa77a]">Contenido de contacto no disponible</p>
          </div>
        </div>
      </section>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Todos los campos marcados con * son obligatorios")
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccessMessage("") // Limpiar mensaje de éxito anterior

    try {
      const response = await apiService.sendContactForm(formData)

      if (response.success) {
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setSuccessMessage(content.responseMessage) // Usar mensaje dinámico
      } else {
        throw new Error(response.error || "Error enviando el mensaje")
      }
    } catch (error) {
      console.error("Error sending contact form:", error)
      setError("Error enviando el mensaje. Por favor intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSuccessMessage(""), 5000) // Limpiar mensaje de éxito después de 5 segundos
    }
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#f7f3ee]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm uppercase tracking-[0.3em] font-medium mb-6 text-[#bfa77a]">
            {content.subtitle}
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light mb-8 tracking-wide text-[#2d2a26]">
            {content.mainTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Información de contacto y redes */}
          <div className="space-y-10">
            <div className="mb-10">
              <h3 className="font-serif text-2xl font-light mb-4 text-[#2d2a26]">Información de Contacto</h3>
              <p className="text-base text-[#2d2a26] font-light leading-relaxed max-w-md">{content.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.contactInfo.map((info) => {
                const IconComponent = iconMap[info.icon] || Mail
                return (
                  <div key={info.title} className="p-5 rounded-xl shadow bg-white flex flex-col items-start border border-[#e5dfd6]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-[#bfa77a]">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-serif text-base font-medium mb-2 text-[#2d2a26]">{info.title}</h4>
                    <div className="space-y-1 mb-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-[#2d2a26]">{detail}</p>
                      ))}
                    </div>
                    {info.description && (
                      <p className="text-xs font-light text-[#bfa77a]">{info.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
            {/* Redes sociales */}
            <div className="p-6 rounded-xl shadow bg-[#ede6db] border border-[#e5dfd6] flex flex-col items-start">
              <h4 className="font-serif text-lg font-light mb-4 text-[#2d2a26]">Síguenos en redes sociales</h4>
              <div className="flex space-x-4">
                {content.socialMedia.map((social) => {
                  const SocialIconComponent = iconMap[social.icon] || Globe
                  return (
                    <a
                      key={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#e5dfd6] bg-white hover:bg-[#f7f3ee] transition-colors"
                    >
                      <SocialIconComponent className="h-6 w-6 mb-1 text-[#bfa77a]" />
                      <span className="text-xs text-[#2d2a26]">{social.name}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
          {/* Formulario de contacto */}
          <div className="p-8 lg:p-12 rounded-xl shadow bg-white border border-[#e5dfd6]">
            <h3 className="font-serif text-2xl font-light mb-6 text-[#2d2a26]">{content.formTitle}</h3>
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-[#fee2e2] text-[#dc2626]">{error}</div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-[#d1fae5] text-[#065f46]">{successMessage}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium mb-2 text-[#2d2a26]">Nombre *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#e5dfd6] bg-[#f7f3ee] text-[#2d2a26] focus:outline-none focus:ring-2 focus:ring-[#bfa77a]"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium mb-2 text-[#2d2a26]">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#e5dfd6] bg-[#f7f3ee] text-[#2d2a26] focus:outline-none focus:ring-2 focus:ring-[#bfa77a]"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium mb-2 text-[#2d2a26]">Correo electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#e5dfd6] bg-[#f7f3ee] text-[#2d2a26] focus:outline-none focus:ring-2 focus:ring-[#bfa77a]"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-xs font-medium mb-2 text-[#2d2a26]">Asunto *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#e5dfd6] bg-[#f7f3ee] text-[#2d2a26] focus:outline-none focus:ring-2 focus:ring-[#bfa77a]"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium mb-2 text-[#2d2a26]">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#e5dfd6] bg-[#f7f3ee] text-[#2d2a26] focus:outline-none focus:ring-2 focus:ring-[#bfa77a] resize-none"
                  placeholder={content.formDescription}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg text-white font-serif text-base font-light shadow transition-all duration-300 bg-[#2d2a26] hover:bg-[#bfa77a] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Enviar mensaje</span>
                  </>
                )}
              </button>
            </form>
            <div className="mt-8 p-4 rounded-lg bg-[#f7f3ee]">
              <p className="text-xs font-light text-center text-[#2d2a26]">{content.responseDisclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
