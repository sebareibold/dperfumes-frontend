"use client"

import HeroSection from "../../components/home/HeroSection"
import ProductCatalog from "../../components/home/ProductCatalog"
import ContactSection from "../../components/home/ContactSection"
import {
  Truck,
  Award,
  Users,
  Heart,
  Star,
  ShieldCheck,
  Leaf,
  Gem,
  Sparkles,
  Gift,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Package,
  RefreshCw,
  Zap,
  Lightbulb,
  Handshake,
  Smile,
  Palette,
  Ruler,
  Tag,
  ShoppingCart,
  CreditCard,
  Lock,
  Globe,
  Camera,
  Book,
  Briefcase,
  Calendar,
  CheckCircle,
  CircleDollarSign,
  Cloud,
  Code,
  Coffee,
  Compass,
  Cpu,
  Crosshair,
  Database,
  Diamond,
  Dices,
  Disc,
  Droplet,
  Feather,
  Fingerprint,
  Flame,
  Folder,
  Gamepad,
  Gauge,
  Gavel,
  Ghost,
  GraduationCap,
  Grid,
  Hammer,
  Headphones,
  HelpCircle,
  Home,
  Image,
  Inbox,
  Key,
  Laptop,
  LifeBuoy,
  Link,
  List,
  Map,
  Megaphone,
  MicIcon as Microphone,
  Monitor,
  Moon,
  Mouse,
  Music,
  Navigation,
  Newspaper,
  Package2,
  Paperclip,
  Percent,
  PieChart,
  PiggyBank,
  Pin,
  Plane,
  Plug,
  Pocket,
  Power,
  Printer,
  Puzzle,
  QrCode,
  Quote,
  Radio,
  Receipt,
  Rocket,
  Rss,
  Scale,
  Scissors,
  Search,
  Send,
  Server,
  Settings,
  Share,
  Shield,
  Ship,
  Signal,
  Sliders,
  Speaker,
  Square,
  Sun,
  Tablet,
  Target,
  Tent,
  Terminal,
  ThumbsUp,
  Ticket,
  Timer,
  ToggleLeft,
  Train,
  TrendingUp,
  Trophy,
  Umbrella,
  Unlock,
  Upload,
  User,
  Utensils,
  Vegan,
  Verified,
  Video,
  Voicemail,
  Volume,
  Wallet,
  Wand,
  Watch,
  Waves,
  Webcam,
  Wifi,
  Wind,
  Wine,
  Wrench,
  X,
  Youtube,
  ZoomIn,
  ZoomOut,
  Info,
  Instagram,
  Facebook,
  Linkedin,
  Github,
} from "lucide-react"
import type React from "react"
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

const iconMap: { [key: string]: React.ElementType } = {
  Truck,
  Award,
  Users,
  Heart,
  Star,
  ShieldCheck,
  Leaf,
  Gem,
  Sparkles,
  Gift,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Package,
  RefreshCw,
  Zap,
  Lightbulb,
  Handshake,
  Smile,
  Palette,
  Ruler,
  Tag,
  ShoppingCart,
  CreditCard,
  Lock,
  Globe,
  Camera,
  Book,
  Briefcase,
  Calendar,
  CheckCircle,
  CircleDollarSign,
  Cloud,
  Code,
  Coffee,
  Compass,
  Cpu,
  Crosshair,
  Database,
  Diamond,
  Dices,
  Disc,
  Droplet,
  Feather,
  Fingerprint,
  Flame,
  Folder,
  Gamepad,
  Gauge,
  Gavel,
  Ghost,
  GraduationCap,
  Grid,
  Hammer,
  Headphones,
  HelpCircle,
  Home,
  Image,
  Inbox,
  Key,
  Laptop,
  LifeBuoy,
  Link,
  List,
  Map,
  Megaphone,
  Microphone,
  Monitor,
  Moon,
  Mouse,
  Music,
  Navigation,
  Newspaper,
  Package2,
  Paperclip,
  Percent,
  PieChart,
  PiggyBank,
  Pin,
  Plane,
  Plug,
  Pocket,
  Power,
  Printer,
  Puzzle,
  QrCode,
  Quote,
  Radio,
  Receipt,
  Rocket,
  Rss,
  Scale,
  Scissors,
  Search,
  Send,
  Server,
  Settings,
  Share,
  Shield,
  Ship,
  Signal,
  Sliders,
  Speaker,
  Square,
  Sun,
  Tablet,
  Target,
  Tent,
  Terminal,
  ThumbsUp,
  Ticket,
  Timer,
  ToggleLeft,
  Train,
  TrendingUp,
  Trophy,
  Umbrella,
  Unlock,
  Upload,
  User,
  Utensils,
  Vegan,
  Verified,
  Video,
  Voicemail,
  Volume,
  Wallet,
  Wand,
  Watch,
  Waves,
  Webcam,
  Wifi,
  Wind,
  Wine,
  Wrench,
  X,
  Youtube,
  ZoomIn,
  ZoomOut,
  Info,
  Instagram,
  Facebook,
  Linkedin,
  Github,
}

function BrandValues({ content }: { content: SiteContent["whyChooseJoly"] | undefined }) {
  if (!content || !content.values) {
    return (
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-[#bfa77a]">Contenido de valores de marca no disponible</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 opacity-10">
        <div className="w-32 h-32 rounded-full bg-[#bfa77a] blur-3xl"></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <div className="w-40 h-40 rounded-full bg-[#2d2a26] blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f7f3ee] border border-[#e5dfd6] shadow-lg mb-6">
            <Award className="h-4 w-4 text-[#bfa77a] mr-2" />
            <span className="text-sm font-medium text-[#2d2a26] tracking-wide">Por qué elegir Daisy</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#2d2a26] mb-6 leading-tight">
            {content.mainTitle.split(" ")[0]}{" "}
            <span className="text-[#bfa77a] italic">{content.mainTitle.split(" ").slice(1).join(" ")}</span>
          </h2>

          <p className="text-lg md:text-xl text-[#2d2a26]/70 font-light leading-relaxed max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.values.map((value, index) => {
            const IconComponent = iconMap[value.icon] || Award
            return (
              <div
                key={value.title}
                className="group p-8 bg-gradient-to-br from-[#f7f3ee] to-white rounded-3xl border border-[#e5dfd6]/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#bfa77a] to-[#2d2a26] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-4 text-[#2d2a26] group-hover:text-[#bfa77a] transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-[#2d2a26]/70 font-light leading-relaxed">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
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
      {siteContent.whyChooseJoly && <BrandValues content={siteContent.whyChooseJoly} />}
      {siteContent.contact && <ContactSection content={siteContent.contact} />}
    </div>
  )
}
