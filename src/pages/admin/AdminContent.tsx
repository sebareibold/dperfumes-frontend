"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import {
  Save,
  Loader2,
  XCircle,
  CheckCircle,
  Plus,
  Trash2,
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
  CheckCircleIcon,
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
  ImageIcon,
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
  PenToolIcon as Tool,
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
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

interface Category {
  name: string;
  display_name: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface ContactDetail {
  icon: string;
  title: string;
  details: string[];
  description: string;
}

interface SocialMediaLink {
  icon: string;
  name: string;
  handle: string;
  link: string;
}

interface InfoCard {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface ExpandableSection {
  id: string;
  title: string;
  content: string;
  enabled: boolean;
}

// Agregar las interfaces necesarias después de las interfaces existentes
// Actualizar las interfaces para manejar múltiples guías
interface SizeGuideRow {
  size: string;
  measurements: string[];
}

interface SizeGuide {
  category: string;
  enabled: boolean;
  title: string;
  subtitle: string;
  tableHeaders: string[];
  tableRows: SizeGuideRow[];
  notes: string;
}

interface CheckoutInfo {
  deliveryInfo: {
    title: string;
    meetingPoint: {
      enabled: boolean;
      title: string;
      description: string;
      address: string;
      schedule: string;
      notes: string;
    };
  };
  paymentInfo: {
    title: string;
    bankTransfer: {
      enabled: boolean;
      title: string;
      bankName: string;
      accountType: string;
      accountNumber: string;
      accountHolder: string;
      cbu: string;
      alias: string;
      instructions: string;
    };
    cashOnDelivery: {
      enabled: boolean;
      title: string;
      description: string;
      additionalFee: number;
      notes: string;
    };
  };
  shipping: {
    enabled: boolean;
    title: string;
    homeDelivery: {
      enabled: boolean;
      title: string;
      description: string;
      baseCost: number;
      freeShippingThreshold: number;
      estimatedDays: string;
      coverage: string;
      notes: string;
    };
  };
}

// Actualizar la interface ContentData
interface ContentData {
  hero: {
    mainDescription: string;
    slogan: string;
    buttonText: string;
    buttonLink: string;
    heroImages: {
      url: string;
      alt: string;
      filename: string;
      position: string;
    }[];
  };
  productCatalog: {
    mainTitle: string;
    subtitle: string;
    categories: Category[];
  };
  whyChooseJoly: {
    mainTitle: string;
    description: string;
    values: Value[];
  };
  productDetail: {
    infoCards: InfoCard[];
    expandableSections: ExpandableSection[];
    showSizeGuideButton: boolean;
    sizeGuideButtonText: string;
  };
  sizeGuides: SizeGuide[]; // Cambiado de sizeGuide a sizeGuides (array)
  checkout: CheckoutInfo;
  contact: {
    mainTitle: string;
    subtitle: string;
    description: string;
    formTitle: string;
    formDescription: string;
    responseMessage: string;
    responseDisclaimer: string;
    contactInfo: ContactDetail[];
    socialMedia: SocialMediaLink[];
  };
}

// Mapeo de nombres de iconos a componentes Lucide React
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
  CheckCircle: CheckCircleIcon,
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
  ImageIcon,
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
  PenTool: Tool,
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
  Tool,
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
  RotateCcw,
  Eye,
  EyeOff,
};

// Lista de nombres de iconos disponibles para el selector
const lucideIconNames = Object.keys(iconMap).sort();

export default function AdminContent() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    loadContent();

    // Cleanup function para limpiar el estado cuando el componente se desmonta
    return () => {
      setContent(null);
      setError(null);
      setSuccess(null);
    };
  }, []);

  // Nuevo useEffect para detectar cuando se vuelve a la página
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && content === null) {
        console.log("Página visible y sin contenido, recargando...");
        loadContent();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [content]);

  // Agregar después del useEffect existente
  useEffect(() => {
    if (content) {
      console.log("Contenido actualizado:", content);
    }
  }, [content]);

  const loadContent = async (_forceRefresh = false) => {
    // Mark as unused
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getSiteContent();
      if (response.success && response.content) {
        const contentData = response.content;

        // Asegurar que todas las propiedades existan con valores por defecto
        const defaultContent: ContentData = {
          hero: {
            mainDescription: contentData.hero?.mainDescription || "",
            slogan: contentData.hero?.slogan || "",
            buttonText: contentData.hero?.buttonText || "Ver Productos",
            buttonLink: contentData.hero?.buttonLink || "products",
            heroImages: contentData.hero?.heroImages || [
              {
                url: "/p2.jpg",
                alt: "Perfume elegante principal",
                filename: "p2.jpg",
                position: "primary",
              },
              {
                url: "/pe.jpg",
                alt: "Perfume elegante secundario",
                filename: "pe.jpg",
                position: "secondary",
              },
            ],
          },
          productCatalog: {
            mainTitle:
              contentData.productCatalog?.mainTitle || "Nuestros Productos",
            subtitle: contentData.productCatalog?.subtitle || "",
            categories: contentData.productCatalog?.categories || [],
          },
          whyChooseJoly: {
            mainTitle:
              contentData.whyChooseJoly?.mainTitle || "¿Por qué elegirnos?",
            description: contentData.whyChooseJoly?.description || "",
            values: contentData.whyChooseJoly?.values || [],
          },
          productDetail: {
            infoCards: contentData.productDetail?.infoCards || [],
            expandableSections:
              contentData.productDetail?.expandableSections || [],
            showSizeGuideButton:
              contentData.productDetail?.showSizeGuideButton ?? true,
            sizeGuideButtonText:
              contentData.productDetail?.sizeGuideButtonText ||
              "Guía de tallas",
          },
          sizeGuides: Array.isArray(contentData.sizeGuides)
            ? contentData.sizeGuides
            : [],
          checkout: {
            deliveryInfo: {
              title:
                contentData.checkout?.deliveryInfo?.title ||
                "Información de Entrega",
              meetingPoint: {
                enabled:
                  contentData.checkout?.deliveryInfo?.meetingPoint?.enabled ??
                  true,
                title:
                  contentData.checkout?.deliveryInfo?.meetingPoint?.title ||
                  "Punto de Encuentro",
                description:
                  contentData.checkout?.deliveryInfo?.meetingPoint
                    ?.description || "",
                address:
                  contentData.checkout?.deliveryInfo?.meetingPoint?.address ||
                  "",
                schedule:
                  contentData.checkout?.deliveryInfo?.meetingPoint?.schedule ||
                  "",
                notes:
                  contentData.checkout?.deliveryInfo?.meetingPoint?.notes || "",
              },
            },
            paymentInfo: {
              title:
                contentData.checkout?.paymentInfo?.title || "Métodos de Pago",
              bankTransfer: {
                enabled:
                  contentData.checkout?.paymentInfo?.bankTransfer?.enabled ??
                  true,
                title:
                  contentData.checkout?.paymentInfo?.bankTransfer?.title ||
                  "Transferencia Bancaria",
                bankName:
                  contentData.checkout?.paymentInfo?.bankTransfer?.bankName ||
                  "",
                accountType:
                  contentData.checkout?.paymentInfo?.bankTransfer
                    ?.accountType || "",
                accountNumber:
                  contentData.checkout?.paymentInfo?.bankTransfer
                    ?.accountNumber || "",
                accountHolder:
                  contentData.checkout?.paymentInfo?.bankTransfer
                    ?.accountHolder || "",
                cbu: contentData.checkout?.paymentInfo?.bankTransfer?.cbu || "",
                alias:
                  contentData.checkout?.paymentInfo?.bankTransfer?.alias || "",
                instructions:
                  contentData.checkout?.paymentInfo?.bankTransfer
                    ?.instructions || "",
              },
              cashOnDelivery: {
                enabled:
                  contentData.checkout?.paymentInfo?.cashOnDelivery?.enabled ??
                  true,
                title:
                  contentData.checkout?.paymentInfo?.cashOnDelivery?.title ||
                  "Pago en Efectivo",
                description:
                  contentData.checkout?.paymentInfo?.cashOnDelivery
                    ?.description || "",
                additionalFee:
                  contentData.checkout?.paymentInfo?.cashOnDelivery
                    ?.additionalFee || 0,
                notes:
                  contentData.checkout?.paymentInfo?.cashOnDelivery?.notes ||
                  "",
              },
            },
            shipping: {
              enabled: contentData.checkout?.shipping?.enabled ?? true,
              title: contentData.checkout?.shipping?.title || "Envíos",
              homeDelivery: {
                enabled:
                  contentData.checkout?.shipping?.homeDelivery?.enabled ?? true,
                title:
                  contentData.checkout?.shipping?.homeDelivery?.title ||
                  "Envío a Domicilio",
                description:
                  contentData.checkout?.shipping?.homeDelivery?.description ||
                  "",
                baseCost:
                  contentData.checkout?.shipping?.homeDelivery?.baseCost || 0,
                freeShippingThreshold:
                  contentData.checkout?.shipping?.homeDelivery
                    ?.freeShippingThreshold || 0,
                estimatedDays:
                  contentData.checkout?.shipping?.homeDelivery?.estimatedDays ||
                  "",
                coverage:
                  contentData.checkout?.shipping?.homeDelivery?.coverage || "",
                notes:
                  contentData.checkout?.shipping?.homeDelivery?.notes || "",
              },
            },
          },
          contact: {
            mainTitle: contentData.contact?.mainTitle || "Contáctanos",
            subtitle: contentData.contact?.subtitle || "",
            description: contentData.contact?.description || "",
            formTitle: contentData.contact?.formTitle || "Envíanos un mensaje",
            formDescription: contentData.contact?.formDescription || "",
            responseMessage:
              contentData.contact?.responseMessage || "Gracias por tu mensaje",
            responseDisclaimer: contentData.contact?.responseDisclaimer || "",
            contactInfo: contentData.contact?.contactInfo || [],
            socialMedia: contentData.contact?.socialMedia || [],
          },
        };

        setContent(defaultContent);
        console.log("Contenido cargado exitosamente:", defaultContent);
      } else {
        setError(response.error || "Error al cargar el contenido.");
      }
    } catch (err) {
      console.error("Error loading content:", err);
      setError("Error al cargar el contenido. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log("Refrescando contenido manualmente...");
    loadContent();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof ContentData,
    field: string
  ) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        [section]: {
          ...prevContent[section],
          [field]: e.target.value,
        },
      };
    });
  };

  const handleCategoryChange = (
    index: number,
    field: keyof Category,
    value: string
  ) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newCategories = [...prevContent.productCatalog.categories];
      newCategories[index] = { ...newCategories[index], [field]: value };
      return {
        ...prevContent,
        productCatalog: {
          ...prevContent.productCatalog,
          categories: newCategories,
        },
      };
    });
  };

  const addCategory = () => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        productCatalog: {
          ...prevContent.productCatalog,
          categories: [
            ...prevContent.productCatalog.categories,
            { name: "", display_name: "" },
          ],
        },
      };
    });
  };

  const removeCategory = (index: number) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newCategories = prevContent.productCatalog.categories.filter(
        (_, i) => i !== index
      );
      return {
        ...prevContent,
        productCatalog: {
          ...prevContent.productCatalog,
          categories: newCategories,
        },
      };
    });
  };

  // Funciones para manejar Info Cards
  const handleInfoCardChange = (
    index: number,
    field: keyof InfoCard,
    value: string | boolean
  ) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newInfoCards = [...prevContent.productDetail.infoCards];
      newInfoCards[index] = { ...newInfoCards[index], [field]: value };
      return {
        ...prevContent,
        productDetail: {
          ...prevContent.productDetail,
          infoCards: newInfoCards,
        },
      };
    });
  };

  const addInfoCard = () => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        productDetail: {
          ...prevContent.productDetail,
          infoCards: [
            ...prevContent.productDetail.infoCards,
            { icon: "Info", title: "", description: "", enabled: true },
          ],
        },
      };
    });
  };

  const removeInfoCard = (index: number) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newInfoCards = prevContent.productDetail.infoCards.filter(
        (_, i) => i !== index
      );
      return {
        ...prevContent,
        productDetail: {
          ...prevContent.productDetail,
          infoCards: newInfoCards,
        },
      };
    });
  };

  // Funciones para manejar Expandable Sections
  const handleExpandableSectionChange = (
    index: number,
    field: keyof ExpandableSection,
    value: string | boolean
  ) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newSections = [...prevContent.productDetail.expandableSections];
      newSections[index] = { ...newSections[index], [field]: value };
      return {
        ...prevContent,
        productDetail: {
          ...prevContent.productDetail,
          expandableSections: newSections,
        },
      };
    });
  };

  const addExpandableSection = () => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        productDetail: {
          ...prevContent.productDetail,
          expandableSections: [
            ...prevContent.productDetail.expandableSections,
            {
              id: `section_${Date.now()}`,
              title: "",
              content: "",
              enabled: true,
            },
          ],
        },
      };
    });
  };

  const removeExpandableSection = (index: number) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newSections = prevContent.productDetail.expandableSections.filter(
        (_, i) => i !== index
      );
      return {
        ...prevContent,
        productDetail: {
          ...prevContent.productDetail,
          expandableSections: newSections,
        },
      };
    });
  };

  const handleContactInfoChange = (
    infoIndex: number,
    field: keyof ContactDetail,
    value: string | string[],
    detailIndex?: number
  ) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newContactInfo = [...prevContent.contact.contactInfo];
      if (
        field === "details" &&
        detailIndex !== undefined &&
        Array.isArray(newContactInfo[infoIndex].details)
      ) {
        const newDetails = [...newContactInfo[infoIndex].details];
        newDetails[detailIndex] = value as string;
        newContactInfo[infoIndex] = {
          ...newContactInfo[infoIndex],
          details: newDetails,
        };
      } else {
        newContactInfo[infoIndex] = {
          ...newContactInfo[infoIndex],
          [field]: value,
        };
      }
      return {
        ...prevContent,
        contact: {
          ...prevContent.contact,
          contactInfo: newContactInfo,
        },
      };
    });
  };

  const addContactInfoDetail = (infoIndex: number) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newContactInfo = [...prevContent.contact.contactInfo];
      newContactInfo[infoIndex].details.push("");
      return {
        ...prevContent,
        contact: {
          ...prevContent.contact,
          contactInfo: newContactInfo,
        },
      };
    });
  };

  const removeContactInfoDetail = (infoIndex: number, detailIndex: number) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newContactInfo = [...prevContent.contact.contactInfo];
      newContactInfo[infoIndex].details = newContactInfo[
        infoIndex
      ].details.filter((_, i) => i !== detailIndex);
      return {
        ...prevContent,
        contact: {
          ...prevContent.contact,
          contactInfo: newContactInfo,
        },
      };
    });
  };

  const addContactInfo = () => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        contact: {
          ...prevContent.contact,
          contactInfo: [
            ...prevContent.contact.contactInfo,
            { icon: "Info", title: "", details: [""], description: "" },
          ], // Add description
        },
      };
    });
  };

  const removeContactInfo = (index: number) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newContactInfo = prevContent.contact.contactInfo.filter(
        (_, i) => i !== index
      );
      return {
        ...prevContent,
        contact: {
          ...prevContent.contact,
          contactInfo: newContactInfo,
        },
      };
    });
  };

  const handleSocialMediaChange = (
    index: number,
    field: keyof SocialMediaLink,
    value: string
  ) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newSocialMedia = [...prevContent.contact.socialMedia];
      newSocialMedia[index] = { ...newSocialMedia[index], [field]: value };
      return {
        ...prevContent,
        contact: {
          ...prevContent.contact,
          socialMedia: newSocialMedia,
        },
      };
    });
  };

  const addSocialMedia = () => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        contact: {
          ...prevContent.contact,
          socialMedia: [
            ...prevContent.contact.socialMedia,
            { icon: "Globe", name: "", handle: "", link: "" },
          ],
        },
      };
    });
  };

  const removeSocialMedia = (index: number) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      const newSocialMedia = prevContent.contact.socialMedia.filter(
        (_, i) => i !== index
      );
      return {
        ...prevContent,
        contact: {
          ...prevContent.contact,
          socialMedia: newSocialMedia,
        },
      };
    });
  };

  // Agregar las funciones para manejar la guía de tallas después de las funciones existentes
  // Actualizar las funciones para manejar múltiples guías
  


  

  // Funciones para manejar checkout
  const handleCheckoutChange = (
    section: "deliveryInfo" | "paymentInfo" | "shipping",
    subsection: string,
    field: string,
    value: any
  ) => {
    setContent((prevContent) => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        checkout: {
          ...prevContent.checkout,
          [section]: {
            ...(prevContent.checkout[section] as any),
            [subsection]: {
              ...(prevContent.checkout as any)[section][subsection],
              [field]: value,
            },
          },
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      setError("No hay contenido para guardar");
      return;
    }

    // --- ARREGLO: asegurar que heroImages tenga ambas posiciones ---
    let heroImages = content.hero.heroImages;
    // Si falta alguna posición, la agregamos con valores por defecto
    const hasPrimary = heroImages.some(img => img.position === "primary");
    const hasSecondary = heroImages.some(img => img.position === "secondary");
    if (!hasPrimary) {
      heroImages = [
        ...heroImages,
        {
          url: "/p2.jpg",
          alt: "Perfume elegante principal",
          filename: "p2.jpg",
          position: "primary",
        },
      ];
    }
    if (!hasSecondary) {
      heroImages = [
        ...heroImages,
        {
          url: "/pe.jpg",
          alt: "Perfume elegante secundario",
          filename: "pe.jpg",
          position: "secondary",
        },
      ];
    }
    // Ordenar para que siempre sea [primary, secondary]
    heroImages = [
      ...heroImages.filter(img => img.position === "primary"),
      ...heroImages.filter(img => img.position === "secondary"),
    ];

    const contentToSave = {
      ...content,
      hero: {
        ...content.hero,
        heroImages,
      },
    };
    // --- FIN ARREGLO ---

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("Enviando contenido:", contentToSave);
      const response = await apiService.updateSiteContent(contentToSave);
      console.log("Respuesta del servidor:", response);

      if (response.success) {
        setSuccess("Contenido actualizado exitosamente!");
        // Recargar el contenido para verificar que se guardó correctamente
        setTimeout(() => {
          loadContent(true);
        }, 1000);
      } else {
        setError(response.error || "Error al actualizar el contenido.");
      }
    } catch (err) {
      console.error("Error saving content:", err);
      setError("Error al guardar el contenido. Intente nuevamente.");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin rounded-full border-4 border-black/10 border-t-black h-14 w-14 mb-2" />
          <p className="text-black text-lg font-light tracking-widest uppercase">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gradient-to-br from-black via-neutral-900 to-neutral-800 bg-opacity-90 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center w-full max-w-xs border border-black/30">
          <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-white/10">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2 text-center">Error al cargar contenido</h2>
          <p className="text-gray-300 mb-6 text-center">{error || "Error desconocido"}</p>
          <button
            onClick={() => loadContent()}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white font-medium shadow hover:from-gray-900 hover:to-black transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Actualizar el array de tabs para incluir las nuevas secciones
  const tabs = [
    { id: "hero", name: "Sección Inicial" },
    { id: "productCatalog", name: "Sección Catálogo" },
    { id: "productDetail", name: "Detalle de Producto" },
    { id: "checkout", name: "Métodos de Pago" },
    { id: "contact", name: "Informacion Contacto" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600/30 to-purple-700/20 border border-purple-600/40 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1 ml-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                Gestión de Contenido del Sitio
              </h1>
              <p className="text-gray-400 text-lg">
                Modifica los textos y elementos clave de las secciones públicas
                de tu tienda.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 bg-green-900/30 border border-green-700/50 rounded-xl p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-300">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700/50 rounded-xl p-4 flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Navegación de Pestañas */}
          <div className="bg-gradient-to-r from-gray-800/40 via-gray-700/30 to-gray-800/40 backdrop-blur-sm border border-gray-600/40 rounded-xl p-1 shadow-lg">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                    }
                  `}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full py-3 px-4 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contenido de las Pestañas */}
          <div className="bg-gradient-to-br from-gray-800/40 via-gray-700/20 to-gray-600/10 backdrop-blur-sm border border-gray-600/40 rounded-xl p-8 shadow-lg">
            {activeTab === "hero" && (
              <div className="bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-blue-700/5 border border-blue-600/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white">
                    Sección Inicial (Hero)
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label
                      htmlFor="heroMainDescription"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Texto Descriptivo Principal
                    </label>
                    <textarea
                      id="heroMainDescription"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      rows={3}
                      value={content?.hero.mainDescription || ""}
                      onChange={(e) =>
                        handleInputChange(e, "hero", "mainDescription")
                      }
                      placeholder="Describe tu marca y productos..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="heroSlogan"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Lema / Eslogan de la Marca
                    </label>
                    <input
                      type="text"
                      id="heroSlogan"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={content?.hero.slogan || ""}
                      onChange={(e) => handleInputChange(e, "hero", "slogan")}
                      placeholder="Tu eslogan aquí..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="heroButtonText"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Texto del Botón Principal
                    </label>
                    <input
                      type="text"
                      id="heroButtonText"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={content?.hero.buttonText || ""}
                      onChange={(e) =>
                        handleInputChange(e, "hero", "buttonText")
                      }
                      placeholder="Ver Productos"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label
                      htmlFor="heroButtonLink"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Enlace del Botón Principal
                    </label>
                    <input
                      type="text"
                      id="heroButtonLink"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={content?.hero.buttonLink || ""}
                      onChange={(e) =>
                        handleInputChange(e, "hero", "buttonLink")
                      }
                      placeholder="products"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Imágenes del Hero
                    </label>
                    <div className="space-y-6">
                      {/* Imagen Principal */}
                      <div className="border border-gray-600/30 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Imagen Principal</h4>
                    <div className="space-y-4">
                          {/* Vista previa de la imagen principal */}
                          {content?.hero.heroImages?.find(img => img.position === "primary")?.url && (
                        <div className="relative">
                          <img
                            src={
                                  content.hero.heroImages.find(img => img.position === "primary")?.url || "/placeholder.svg"
                            }
                                alt={content.hero.heroImages.find(img => img.position === "primary")?.alt || "Vista previa"}
                            className="w-full h-48 object-cover rounded-lg border border-gray-600/50"
                          />
                          <div className="absolute top-2 right-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (content) {
                                      const updatedImages = content.hero.heroImages.map(img => 
                                        img.position === "primary" 
                                          ? { ...img, url: "/p2.jpg", alt: "Perfume elegante principal", filename: "p2.jpg" }
                                          : img
                                      );
                                  setContent({
                                    ...content,
                                    hero: {
                                      ...content.hero,
                                          heroImages: updatedImages,
                                    },
                                  });
                                }
                              }}
                              className="p-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200"
                              title="Restaurar imagen por defecto"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                          {/* Input para subir nueva imagen principal */}
                      <div>
                        <input
                          type="file"
                              id="heroImagePrimaryUpload"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            try {
                              setSaving(true);
                              setError(null);

                              // Validar archivo
                              if (file.size > 5 * 1024 * 1024) {
                                    setError("La imagen es demasiado grande. Máximo 5MB.");
                                return;
                              }

                                  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                              if (!validTypes.includes(file.type)) {
                                    setError("Tipo de archivo no válido. Solo JPG, PNG y WEBP.");
                                return;
                              }

                              // Subir imagen
                                  const uploadResult = await apiService.uploadTransferProof(file);

                              if (uploadResult.success && uploadResult.url) {
                                // Actualizar el contenido con la nueva imagen
                                if (content) {
                                      const updatedImages = content.hero.heroImages.map(img => 
                                        img.position === "primary" 
                                          ? {
                                              ...img,
                                              url: uploadResult.url,
                                              alt: img.alt || "Imagen principal",
                                              filename: uploadResult.filename || file.name,
                                            }
                                          : img
                                      );
                                  setContent({
                                    ...content,
                                    hero: {
                                      ...content.hero,
                                          heroImages: updatedImages,
                                    },
                                  });
                                }
                                    setSuccess("Imagen principal subida exitosamente!");
                                setTimeout(() => setSuccess(null), 3000);
                              } else {
                                    setError(uploadResult.error || "Error al subir la imagen");
                              }
                            } catch (error) {
                                  console.error("Error uploading hero image:", error);
                                  setError("Error al subir la imagen. Intenta nuevamente.");
                                } finally {
                                  setSaving(false);
                                }
                              }}
                            />

                            <div className="flex gap-4">
                              <button
                                type="button"
                                onClick={() => document.getElementById("heroImagePrimaryUpload")?.click()}
                                disabled={saving}
                                className="flex-1 px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                              >
                                {saving ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Subiendo...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Cambiar Imagen Principal
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Campo para texto alternativo de imagen principal */}
                          <div>
                            <label htmlFor="heroImagePrimaryAlt" className="block text-sm font-medium text-gray-300 mb-2">
                              Texto Alternativo (Alt)
                            </label>
                            <input
                              type="text"
                              id="heroImagePrimaryAlt"
                              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={content?.hero.heroImages?.find(img => img.position === "primary")?.alt || ""}
                              onChange={(e) => {
                                if (content) {
                                  const updatedImages = content.hero.heroImages.map(img => 
                                    img.position === "primary" 
                                      ? { ...img, alt: e.target.value }
                                      : img
                                  );
                                  setContent({
                                    ...content,
                                    hero: {
                                      ...content.hero,
                                      heroImages: updatedImages,
                                    },
                                  });
                                }
                              }}
                              placeholder="Descripción de la imagen principal para accesibilidad..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Imagen Secundaria */}
                      <div className="border border-gray-600/30 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Imagen Secundaria</h4>
                        <div className="space-y-4">
                          {/* Vista previa de la imagen secundaria */}
                          {content?.hero.heroImages?.find(img => img.position === "secondary")?.url && (
                            <div className="relative">
                              <img
                                src={
                                  content.hero.heroImages.find(img => img.position === "secondary")?.url || "/placeholder.svg"
                                }
                                alt={content.hero.heroImages.find(img => img.position === "secondary")?.alt || "Vista previa"}
                                className="w-full h-48 object-cover rounded-lg border border-gray-600/50"
                              />
                              <div className="absolute top-2 right-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (content) {
                                      const updatedImages = content.hero.heroImages.map(img => 
                                        img.position === "secondary" 
                                          ? { ...img, url: "/pe.jpg", alt: "Perfume elegante secundario", filename: "pe.jpg" }
                                          : img
                                      );
                                      setContent({
                                        ...content,
                                        hero: {
                                          ...content.hero,
                                          heroImages: updatedImages,
                                        },
                                      });
                                    }
                                  }}
                                  className="p-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200"
                                  title="Restaurar imagen por defecto"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Input para subir nueva imagen secundaria */}
                          <div>
                            <input
                              type="file"
                              id="heroImageSecondaryUpload"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                try {
                                  setSaving(true);
                                  setError(null);

                                  // Validar archivo
                                  if (file.size > 5 * 1024 * 1024) {
                                    setError("La imagen es demasiado grande. Máximo 5MB.");
                                    return;
                                  }

                                  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                                  if (!validTypes.includes(file.type)) {
                                    setError("Tipo de archivo no válido. Solo JPG, PNG y WEBP.");
                                    return;
                                  }

                                  // Subir imagen
                                  const uploadResult = await apiService.uploadTransferProof(file);

                                  if (uploadResult.success && uploadResult.url) {
                                    // Actualizar el contenido con la nueva imagen
                                    if (content) {
                                      const updatedImages = content.hero.heroImages.map(img => 
                                        img.position === "secondary" 
                                          ? {
                                              ...img,
                                              url: uploadResult.url,
                                              alt: img.alt || "Imagen secundaria",
                                              filename: uploadResult.filename || file.name,
                                            }
                                          : img
                                      );
                                      setContent({
                                        ...content,
                                        hero: {
                                          ...content.hero,
                                          heroImages: updatedImages,
                                        },
                                      });
                                    }
                                    setSuccess("Imagen secundaria subida exitosamente!");
                                    setTimeout(() => setSuccess(null), 3000);
                                  } else {
                                    setError(uploadResult.error || "Error al subir la imagen");
                                  }
                                } catch (error) {
                                  console.error("Error uploading hero image:", error);
                                  setError("Error al subir la imagen. Intenta nuevamente.");
                            } finally {
                              setSaving(false);
                            }
                          }}
                        />

                        <div className="flex gap-4">
                          <button
                            type="button"
                                onClick={() => document.getElementById("heroImageSecondaryUpload")?.click()}
                            disabled={saving}
                            className="flex-1 px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Subiendo...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                    Cambiar Imagen Secundaria
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                          {/* Campo para texto alternativo de imagen secundaria */}
                      <div>
                            <label htmlFor="heroImageSecondaryAlt" className="block text-sm font-medium text-gray-300 mb-2">
                          Texto Alternativo (Alt)
                        </label>
                        <input
                          type="text"
                              id="heroImageSecondaryAlt"
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={content?.hero.heroImages?.find(img => img.position === "secondary")?.alt || ""}
                          onChange={(e) => {
                            if (content) {
                                  const updatedImages = content.hero.heroImages.map(img => 
                                    img.position === "secondary" 
                                      ? { ...img, alt: e.target.value }
                                      : img
                                  );
                              setContent({
                                ...content,
                                hero: {
                                  ...content.hero,
                                      heroImages: updatedImages,
                                },
                              });
                            }
                          }}
                              placeholder="Descripción de la imagen secundaria para accesibilidad..."
                        />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "productCatalog" && (
              <div className="bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-700/5 border border-purple-600/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white">
                    Sección Catálogo
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label
                      htmlFor="catalogMainTitle"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Título Principal de la Sección
                    </label>
                    <input
                      type="text"
                      id="catalogMainTitle"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={content?.productCatalog.mainTitle || ""}
                      onChange={(e) =>
                        handleInputChange(e, "productCatalog", "mainTitle")
                      }
                      placeholder="Nuestros Productos"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="catalogSubtitle"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Subtítulo de la Sección
                    </label>
                    <textarea
                      id="catalogSubtitle"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      rows={2}
                      value={content?.productCatalog.subtitle || ""}
                      onChange={(e) =>
                        handleInputChange(e, "productCatalog", "subtitle")
                      }
                      placeholder="Descripción de tus productos..."
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Categorías de Productos
                  </h3>
                  <div className="space-y-4">
                    {content?.productCatalog.categories.map((cat, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-purple-800/20 via-purple-700/10 to-transparent border border-purple-700/30 rounded-lg p-6 hover:from-purple-800/30 hover:via-purple-700/20 transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`categoryName-${index}`}
                              className="block text-sm font-medium text-gray-300 mb-2"
                            >
                              Nombre Interno
                            </label>
                            <input
                              type="text"
                              id={`categoryName-${index}`}
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={cat.name}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="conjuntos"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`categoryDisplayName-${index}`}
                              className="block text-sm font-medium text-gray-300 mb-2"
                            >
                              Nombre a Mostrar
                            </label>
                            <input
                              type="text"
                              id={`categoryDisplayName-${index}`}
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={cat.display_name}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  "display_name",
                                  e.target.value
                                )
                              }
                              placeholder="Conjuntos de Lencería"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addCategory}
                    className="mt-4 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Categoría
                  </button>
                </div>
              </div>
            )}

            {activeTab === "productDetail" && (
              <div className="bg-gradient-to-br from-indigo-900/20 via-indigo-800/10 to-indigo-700/5 border border-indigo-600/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white">
                    Detalle de Producto
                  </h2>
                </div>

                {/* Cards Informativas */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Cards Informativas
                  </h3>
                  <div className="space-y-4">
                    {content?.productDetail.infoCards.map((card, index) => {
                      const CurrentIcon = iconMap[card.icon] || Info;
                      return (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-indigo-800/20 via-indigo-700/10 to-transparent border border-indigo-700/30 rounded-lg p-6 hover:from-indigo-800/30 hover:via-indigo-700/20 transition-all duration-300"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Icono
                              </label>
                              <div className="flex items-center gap-3">
                                <select
                                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  value={card.icon}
                                  onChange={(e) =>
                                    handleInfoCardChange(
                                      index,
                                      "icon",
                                      e.target.value
                                    )
                                  }
                                >
                                  {lucideIconNames.map((iconName) => (
                                    <option key={iconName} value={iconName}>
                                      {iconName}
                                    </option>
                                  ))}
                                </select>
                                <div className="w-10 h-10 bg-gray-800/50 border border-gray-600/50 rounded-lg flex items-center justify-center">
                                  <CurrentIcon className="h-5 w-5 text-gray-300" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={card.title}
                                onChange={(e) =>
                                  handleInfoCardChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Título de la card"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descripción
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={card.description}
                                onChange={(e) =>
                                  handleInfoCardChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Descripción de la card"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Estado
                              </label>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleInfoCardChange(
                                      index,
                                      "enabled",
                                      !card.enabled
                                    )
                                  }
                                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                                    card.enabled
                                      ? "bg-green-600/20 border-green-600/30 text-green-400"
                                      : "bg-gray-800/50 border-gray-600/50 text-gray-400"
                                  }`}
                                >
                                  {card.enabled ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                  {card.enabled ? "Visible" : "Oculto"}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeInfoCard(index)}
                              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={addInfoCard}
                    className="mt-4 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Card Informativa
                  </button>
                </div>

                {/* Secciones Expandibles */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Secciones Expandibles
                  </h3>
                  <div className="space-y-4">
                    {content?.productDetail.expandableSections.map(
                      (section, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-indigo-800/20 via-indigo-700/10 to-transparent border border-indigo-700/30 rounded-lg p-6 hover:from-indigo-800/30 hover:via-indigo-700/20 transition-all duration-300"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                ID de Sección
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={section.id}
                                onChange={(e) =>
                                  handleExpandableSectionChange(
                                    index,
                                    "id",
                                    e.target.value
                                  )
                                }
                                placeholder="section_id"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={section.title}
                                onChange={(e) =>
                                  handleExpandableSectionChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Título de la sección"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Estado
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  handleExpandableSectionChange(
                                    index,
                                    "enabled",
                                    !section.enabled
                                  )
                                }
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                                  section.enabled
                                    ? "bg-green-600/20 border-green-600/30 text-green-400"
                                    : "bg-gray-800/50 border-gray-600/50 text-gray-400"
                                }`}
                              >
                                {section.enabled ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                                {section.enabled ? "Visible" : "Oculto"}
                              </button>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Contenido
                            </label>
                            <textarea
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              rows={4}
                              value={section.content}
                              onChange={(e) =>
                                handleExpandableSectionChange(
                                  index,
                                  "content",
                                  e.target.value
                                )
                              }
                              placeholder="Contenido de la sección expandible..."
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeExpandableSection(index)}
                              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addExpandableSection}
                    className="mt-4 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Sección Expandible
                  </button>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="bg-gradient-to-br from-orange-900/20 via-orange-800/10 to-orange-700/5 border border-orange-600/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white">
                    Sección Contacto
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label
                      htmlFor="contactMainTitle"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Título Principal
                    </label>
                    <input
                      type="text"
                      id="contactMainTitle"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={content?.contact.mainTitle || ""}
                      onChange={(e) =>
                        handleInputChange(e, "contact", "mainTitle")
                      }
                      placeholder="Contáctanos"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactSubtitle"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      id="contactSubtitle"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={content?.contact.subtitle || ""}
                      onChange={(e) =>
                        handleInputChange(e, "contact", "subtitle")
                      }
                      placeholder="Estamos aquí para ti"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label
                      htmlFor="contactDescription"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Descripción
                    </label>
                    <textarea
                      id="contactDescription"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      rows={3}
                      value={content?.contact.description || ""}
                      onChange={(e) =>
                        handleInputChange(e, "contact", "description")
                      }
                      placeholder="Descripción de la sección de contacto..."
                    />
                  </div>
                </div>

                {/* Información de Contacto */}
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Información de Contacto
                  </h3>
                  <div className="space-y-4">
                    {content?.contact.contactInfo.map((info, infoIndex) => {
                      const CurrentIcon = iconMap[info.icon] || Info;
                      return (
                        <div
                          key={infoIndex}
                          className="bg-gradient-to-r from-orange-800/20 via-orange-700/10 to-transparent border border-orange-700/30 rounded-lg p-6 hover:from-orange-800/30 hover:via-orange-700/20 transition-all duration-300"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Icono
                              </label>
                              <div className="flex items-center gap-3">
                                <select
                                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  value={info.icon}
                                  onChange={(e) =>
                                    handleContactInfoChange(
                                      infoIndex,
                                      "icon",
                                      e.target.value
                                    )
                                  }
                                >
                                  {lucideIconNames.map((iconName) => (
                                    <option key={iconName} value={iconName}>
                                      {iconName}
                                    </option>
                                  ))}
                                </select>
                                <div className="w-10 h-10 bg-gray-800/50 border border-gray-600/50 rounded-lg flex items-center justify-center">
                                  <CurrentIcon className="h-5 w-5 text-gray-300" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={info.title}
                                onChange={(e) =>
                                  handleContactInfoChange(
                                    infoIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Título"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Detalles
                            </label>
                            {info.details.map((detail, detailIndex) => (
                              <div
                                key={detailIndex}
                                className="flex items-center gap-2 mb-2"
                              >
                                <input
                                  type="text"
                                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  value={detail}
                                  onChange={(e) =>
                                    handleContactInfoChange(
                                      infoIndex,
                                      "details",
                                      e.target.value,
                                      detailIndex
                                    )
                                  }
                                  placeholder="Detalle de contacto"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeContactInfoDetail(
                                      infoIndex,
                                      detailIndex
                                    )
                                  }
                                  className="p-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addContactInfoDetail(infoIndex)}
                              className="mt-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center text-sm"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Añadir Detalle
                            </button>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeContactInfo(infoIndex)}
                              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={addContactInfo}
                    className="mt-4 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Información de Contacto
                  </button>
                </div>

                {/* Redes Sociales */}
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Redes Sociales
                  </h3>
                  <div className="space-y-4">
                    {content?.contact.socialMedia.map((social, socialIndex) => {
                      const SocialIcon = iconMap[social.icon] || Globe;
                      return (
                        <div
                          key={socialIndex}
                          className="bg-gradient-to-r from-orange-800/20 via-orange-700/10 to-transparent border border-orange-700/30 rounded-lg p-6 hover:from-orange-800/30 hover:via-orange-700/20 transition-all duration-300"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Icono
                              </label>
                              <div className="flex items-center gap-3">
                                <select
                                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  value={social.icon}
                                  onChange={(e) =>
                                    handleSocialMediaChange(
                                      socialIndex,
                                      "icon",
                                      e.target.value
                                    )
                                  }
                                >
                                  {lucideIconNames.map((iconName) => (
                                    <option key={iconName} value={iconName}>
                                      {iconName}
                                    </option>
                                  ))}
                                </select>
                                <div className="w-10 h-10 bg-gray-800/50 border border-gray-600/50 rounded-lg flex items-center justify-center">
                                  <SocialIcon className="h-5 w-5 text-gray-300" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Red Social
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={social.name}
                                onChange={(e) =>
                                  handleSocialMediaChange(
                                    socialIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="Instagram"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Usuario
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={social.handle}
                                onChange={(e) =>
                                  handleSocialMediaChange(
                                    socialIndex,
                                    "handle",
                                    e.target.value
                                  )
                                }
                                placeholder="@usuario"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Enlace
                              </label>
                              <input
                                type="url"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={social.link}
                                onChange={(e) =>
                                  handleSocialMediaChange(
                                    socialIndex,
                                    "link",
                                    e.target.value
                                  )
                                }
                                placeholder="https://instagram.com/usuario"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeSocialMedia(socialIndex)}
                              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={addSocialMedia}
                    className="mt-4 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Red Social
                  </button>
                </div>
              </div>
            )}

            {activeTab === "checkout" && (
              <div className="bg-gradient-to-br from-teal-900/20 via-teal-800/10 to-teal-700/5 border border-teal-600/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-teal-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white">
                    Métodos de Pago y Envíos
                  </h2>
                </div>

                {/* Información de Entrega - Punto de Encuentro */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Pago en Efectivo - Punto de Encuentro
                  </h3>

                  <div className="bg-gradient-to-r from-teal-800/20 via-teal-700/10 to-transparent border border-teal-700/30 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Estado
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleCheckoutChange(
                              "deliveryInfo",
                              "meetingPoint",
                              "enabled",
                              !content?.checkout.deliveryInfo.meetingPoint
                                .enabled
                            )
                          }
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                            content?.checkout.deliveryInfo.meetingPoint.enabled
                              ? "bg-green-600/20 border-green-600/30 text-green-400"
                              : "bg-gray-800/50 border-gray-600/50 text-gray-400"
                          }`}
                        >
                          {content?.checkout.deliveryInfo.meetingPoint
                            .enabled ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                          {content?.checkout.deliveryInfo.meetingPoint.enabled
                            ? "Activo"
                            : "Inactivo"}
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Título
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.deliveryInfo.meetingPoint.title ||
                            ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "deliveryInfo",
                              "meetingPoint",
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Punto de Encuentro"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Descripción
                        </label>
                        <textarea
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          rows={3}
                          value={
                            content?.checkout.deliveryInfo.meetingPoint
                              .description || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "deliveryInfo",
                              "meetingPoint",
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Nos encontramos en nuestro local para que puedas pagar en efectivo y retirar tu pedido..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Dirección del Punto de Encuentro
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.deliveryInfo.meetingPoint
                              .address || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "deliveryInfo",
                              "meetingPoint",
                              "address",
                              e.target.value
                            )
                          }
                          placeholder="Av. Argentina 123, Neuquén Capital"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Horarios de Atención
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.deliveryInfo.meetingPoint
                              .schedule || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "deliveryInfo",
                              "meetingPoint",
                              "schedule",
                              e.target.value
                            )
                          }
                          placeholder="Lunes a Viernes de 10:00 a 18:00, Sábados de 10:00 a 14:00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Notas Adicionales
                        </label>
                        <textarea
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          rows={2}
                          value={
                            content?.checkout.deliveryInfo.meetingPoint.notes ||
                            ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "deliveryInfo",
                              "meetingPoint",
                              "notes",
                              e.target.value
                            )
                          }
                          placeholder="También ofrecemos entrega a domicilio en Neuquén Capital y alrededores."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuración de Envíos a Domicilio */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Configuración de Envíos a Domicilio
                  </h3>

                  <div className="bg-gradient-to-r from-teal-800/20 via-teal-700/10 to-transparent border border-teal-700/30 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Estado del Servicio
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleCheckoutChange(
                              "shipping",
                              "homeDelivery",
                              "enabled",
                              !content?.checkout.shipping?.homeDelivery.enabled
                            )
                          }
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                            content?.checkout.shipping?.homeDelivery.enabled
                              ? "bg-green-600/20 border-green-600/30 text-green-400"
                              : "bg-gray-800/50 border-gray-600/50 text-gray-400"
                          }`}
                        >
                          {content?.checkout.shipping?.homeDelivery.enabled ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                          {content?.checkout.shipping?.homeDelivery.enabled
                            ? "Activo"
                            : "Inactivo"}
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Título del Servicio
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.shipping?.homeDelivery.title || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "shipping",
                              "homeDelivery",
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Envío a Domicilio"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Costo Base de Envío ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.shipping?.homeDelivery.baseCost ||
                            0
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "shipping",
                              "homeDelivery",
                              "baseCost",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="2500"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Envío Gratis desde ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.shipping?.homeDelivery
                              .freeShippingThreshold || 0
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "shipping",
                              "homeDelivery",
                              "freeShippingThreshold",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="30000"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tiempo Estimado de Entrega
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.shipping?.homeDelivery
                              .estimatedDays || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "shipping",
                              "homeDelivery",
                              "estimatedDays",
                              e.target.value
                            )
                          }
                          placeholder="2-3 días hábiles"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Área de Cobertura
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.shipping?.homeDelivery.coverage ||
                            ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "shipping",
                              "homeDelivery",
                              "coverage",
                              e.target.value
                            )
                          }
                          placeholder="Neuquén Capital y alrededores (hasta 15km del centro)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Descripción del Servicio
                        </label>
                        <textarea
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          rows={2}
                          value={
                            content?.checkout.shipping?.homeDelivery
                              .description || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "shipping",
                              "homeDelivery",
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Entregamos en Neuquén Capital y alrededores. El costo varía según la ubicación."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Notas Adicionales sobre Envíos
                        </label>
                        <textarea
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          rows={2}
                          value={
                            content?.checkout.shipping?.homeDelivery.notes || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "shipping",
                              "homeDelivery",
                              "notes",
                              e.target.value
                            )
                          }
                          placeholder="Los envíos se realizan de lunes a viernes en horario comercial."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de Pago - Pago en Efectivo */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Configuración de Pago en Efectivo
                  </h3>

                  <div className="bg-gradient-to-r from-teal-800/20 via-teal-700/10 to-transparent border border-teal-700/30 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Estado
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "cashOnDelivery",
                              "enabled",
                              !content?.checkout.paymentInfo.cashOnDelivery
                                .enabled
                            )
                          }
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                            content?.checkout.paymentInfo.cashOnDelivery.enabled
                              ? "bg-green-600/20 border-green-600/30 text-green-400"
                              : "bg-gray-800/50 border-gray-600/50 text-gray-400"
                          }`}
                        >
                          {content?.checkout.paymentInfo.cashOnDelivery
                            .enabled ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                          {content?.checkout.paymentInfo.cashOnDelivery.enabled
                            ? "Activo"
                            : "Inactivo"}
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Título del Método
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.cashOnDelivery
                              .title || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "cashOnDelivery",
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Pago en Efectivo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cargo Adicional ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.cashOnDelivery
                              .additionalFee || 0
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "cashOnDelivery",
                              "additionalFee",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Descripción
                        </label>
                        <textarea
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          rows={2}
                          value={
                            content?.checkout.paymentInfo.cashOnDelivery
                              .description || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "cashOnDelivery",
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Paga en efectivo al momento de recibir tu pedido. Solo disponible para entregas en Neuquén Capital."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Notas Importantes
                        </label>
                        <textarea
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          rows={2}
                          value={
                            content?.checkout.paymentInfo.cashOnDelivery
                              .notes || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "cashOnDelivery",
                              "notes",
                              e.target.value
                            )
                          }
                          placeholder="Por favor, ten el monto exacto disponible al momento de la entrega."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de Pago - Transferencia Bancaria */}
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Configuración de Transferencia Bancaria
                  </h3>

                  <div className="bg-gradient-to-r from-teal-800/20 via-teal-700/10 to-transparent border border-teal-700/30 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Estado
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "bankTransfer",
                              "enabled",
                              !content?.checkout.paymentInfo.bankTransfer
                                .enabled
                            )
                          }
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                            content?.checkout.paymentInfo.bankTransfer.enabled
                              ? "bg-green-600/20 border-green-600/30 text-green-400"
                              : "bg-gray-800/50 border-gray-600/50 text-gray-400"
                          }`}
                        >
                          {content?.checkout.paymentInfo.bankTransfer
                            .enabled ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                          {content?.checkout.paymentInfo.bankTransfer.enabled
                            ? "Activo"
                            : "Inactivo"}
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Título del Método
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.bankTransfer.title ||
                            ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "bankTransfer",
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Transferencia Bancaria"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nombre del Banco
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.bankTransfer
                              .bankName || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "bankTransfer",
                              "bankName",
                              e.target.value
                            )
                          }
                          placeholder="Banco Nación"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tipo de Cuenta
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.bankTransfer
                              .accountType || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "bankTransfer",
                              "accountType",
                              e.target.value
                            )
                          }
                          placeholder="Cuenta Corriente"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Número de Cuenta
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.bankTransfer
                              .accountNumber || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "bankTransfer",
                              "accountNumber",
                              e.target.value
                            )
                          }
                          placeholder="1234567890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Titular de la Cuenta
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.bankTransfer
                              .accountHolder || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "bankTransfer",
                              "accountHolder",
                              e.target.value
                            )
                          }
                          placeholder="Daisy Perfumes"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CBU
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.bankTransfer.cbu || ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "bankTransfer",
                              "cbu",
                              e.target.value
                            )
                          }
                          placeholder="0110123456789012345678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Alias
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={
                            content?.checkout.paymentInfo.bankTransfer.alias ||
                            ""
                          }
                          onChange={(e) =>
                            handleCheckoutChange(
                              "paymentInfo",
                              "bankTransfer",
                              "alias",
                              e.target.value
                            )
                          }
                          placeholder="DAISY.PERFUMES"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Instrucciones para el Cliente
                      </label>
                      <textarea
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        rows={3}
                        value={
                          content?.checkout.paymentInfo.bankTransfer
                            .instructions || ""
                        }
                        onChange={(e) =>
                          handleCheckoutChange(
                            "paymentInfo",
                            "bankTransfer",
                            "instructions",
                            e.target.value
                          )
                        }
                        placeholder="Realiza la transferencia por el monto total y sube el comprobante. Procesaremos tu pedido una vez confirmado el pago."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón de Guardar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center text-lg font-medium"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-3" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
