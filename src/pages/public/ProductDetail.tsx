"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Plus,
  Minus,
  ChevronDown,
  Truck,
  RotateCcw,
  Shield,
  Award,
  Star,
  Package,
  Clock,
  CheckCircle,
  Info,
  Droplet,
  Sparkles,
  Heart,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { apiService } from "../../services/api";
import toast from "react-hot-toast";

// Estilos CSS personalizados para efectos visuales mejorados
const productDetailStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    50% { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(0, 0, 0, 0.2); }
  }
  
  .product-image-primary {
    animation: float 6s ease-in-out infinite;
  }
  
  .product-image-primary:hover {
    animation: glow 2s ease-in-out infinite;
  }
  
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35);
  }
`;

// Definición de interfaces actualizadas para perfumes
interface Envase {
  _id: string;
  tipo: "vidrio" | "plastico";
  volumen: number; // en mililitros
  precio: number;
  stock: number;
}

interface Product {
  _id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagenes: string[];
  notasAromaticas: string[];
  descripcionDupe?: string;
  envases: Envase[];
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

interface ProductDetailContent {
  infoCards: InfoCard[];
  expandableSections: ExpandableSection[];
}

// Mapeo de iconos
const iconMap: { [key: string]: React.ElementType } = {
  Truck,
  RotateCcw,
  Shield,
  Award,
  Star,
  Package,
  Clock,
  CheckCircle,
  Info,
  Droplet,
  Sparkles,
  Heart,
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  // Estado para el índice del envase seleccionado
  const [selectedEnvaseIndex, setSelectedEnvaseIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSections, setExpandedSections] = useState(new Set<string>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetailContent, setProductDetailContent] =
    useState<ProductDetailContent | null>(null);
  const [contactPhone, setContactPhone] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Cargar solo el producto primero, el contenido del sitio después
      loadProduct(id);
    }
  }, [id]);

  // Cargar información de contacto
  useEffect(() => {
    async function fetchContactPhone() {
      try {
        const response = await apiService.getSiteContent();
        if (response.success && response.content?.contact?.contactInfo) {
          const contactInfo = response.content.contact.contactInfo;
          // Buscar por 'Whatsapp'
          const whatsappInfo = contactInfo.find((info: { title: string; details: string[] }) =>
            info.title.toLowerCase() === "whatsapp"
          );
          if (whatsappInfo && Array.isArray(whatsappInfo.details) && whatsappInfo.details[0]) {
            // Clean up the phone number for WhatsApp (remove spaces, dashes, etc)
            const raw = whatsappInfo.details[0];
            const cleaned = raw.replace(/[^\d+]/g, "");
            setContactPhone(cleaned);
          }
        }
      } catch {
        setContactPhone(null);
      }
    }
    fetchContactPhone();
  }, []);

  const loadProductDetailContent = async () => {
    try {
      const response = await apiService.getSiteContent();
      if (response.success && response.content.productDetail) {
        setProductDetailContent(response.content.productDetail);
      }
    } catch (err) {
      console.error("Error loading product detail content:", err);
      // Valores por defecto para perfumes - solo si no hay contenido ya cargado
      if (!productDetailContent) {
        setProductDetailContent({
          infoCards: [
            {
              icon: "Truck",
              title: "Envío Gratis",
              description: "En compras superiores a $30.000",
              enabled: true,
            },
            {
              icon: "RotateCcw",
              title: "30 Días",
              description: "Para cambios y devoluciones",
              enabled: true,
            },
            {
              icon: "Shield",
              title: "Garantía",
              description: "Calidad garantizada",
              enabled: true,
            },
          ],
          expandableSections: [
            {
              id: "description",
              title: "Descripción Detallada",
              content: "Descripción detallada del perfume y sus características.",
              enabled: true,
            },
            {
              id: "notes",
              title: "Notas Aromáticas",
              content: "Información sobre las notas aromáticas del perfume.",
              enabled: true,
            },
          ],
        });
      }
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores previos
      
      const response = await apiService.getProduct(productId);

      if (response.success && response.product) {
        const productData = response.product as unknown as Product;
        console.log("Producto recibido desde la API:", productData);
        setProduct(productData);
        setSelectedEnvaseIndex(0);
        
        // Crear interacción de forma asíncrona sin esperar
        apiService.createInteraction("product_view", {
          productId: response.product._id,
          productTitle: response.product.nombre,
          productPrice: productData.envases[0]?.precio,
          productCategory: response.product.categoria,
        }).catch(err => console.warn("Error creating interaction:", err));
        
        // Cargar productos relacionados de forma asíncrona
        loadRelatedProducts(productData.categoria);
      } else {
        setError("No se pudo encontrar el producto");
      }
    } catch (err) {
      console.error("Error loading product:", err);
      const errorMessage = err instanceof Error ? err.message : "Error al cargar el producto. Intente nuevamente más tarde.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (category: string) => {
    try {
      const response = await apiService.getProducts({
        category: category,
        limit: 4,
      });

      const related = (response.payload || [])
        .filter((p: unknown) => (p as Product)._id !== id)
        .slice(0, 4)
        .map((p: unknown) => p as Product);

      setRelatedProducts(related);
    } catch (err) {
      console.error("Error loading related products:", err);
      setRelatedProducts([]);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedEnvase) {
      toast.error("Por favor selecciona una presentación");
      return;
    }
    const itemToAdd = {
      productoId: product._id, // <-- nuevo campo requerido por el backend
      id: product._id,
      nombre: product.nombre,
      volumen: {
        ml: String(selectedEnvase.volumen),
        precio: Number(selectedEnvase.precio),
      },
      tipo: selectedEnvase.tipo as 'vidrio' | 'plastico',
      imagen: product.imagenes[selectedImage],
      stock: selectedEnvase.stock, // <-- agregar stock
    };
    console.log("[DEBUG] Item que se agrega al carrito:", itemToAdd);
    addToCart(itemToAdd, quantity);
    toast.success(`Agregado al carrito`);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const renderIcon = (iconName: string, className = "h-6 w-6") => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    const InfoIcon = iconMap["Info"];
    return <InfoIcon className={className} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <style>{productDetailStyles}</style>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-black font-light">Cargando perfume...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    const isRateLimitError = error?.includes("Rate limit");
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <style>{productDetailStyles}</style>
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="font-serif text-2xl font-light mb-4 text-black">
            {error || "Perfume no encontrado"}
          </h2>
          
          {isRateLimitError && (
            <p className="text-sm text-black/60 mb-6">
              El servidor está recibiendo demasiadas peticiones. Por favor, espera un momento y vuelve a intentar.
            </p>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                if (id) {
                  loadProduct(id);
                  loadProductDetailContent();
                }
              }}
              className="inline-block border border-black text-black bg-white px-6 py-2 rounded-full font-sans text-sm uppercase tracking-widest font-normal transition-all duration-300 hover:bg-black hover:text-white focus:outline-none mr-3"
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-block border border-gray-300 text-gray-600 bg-white px-6 py-2 rounded-full font-sans text-sm uppercase tracking-widest font-normal transition-all duration-300 hover:bg-gray-100 focus:outline-none"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Derivar el envase seleccionado según índice
  const envasesDisponibles = product?.envases || [];
  const selectedEnvase = envasesDisponibles[selectedEnvaseIndex] || null;

  return (
    <div className="min-h-screen">
      <style>{productDetailStyles}</style>

      {/* Fondo decorativo SVG con ondas en esquinas, ahora inclinadas */}
      {/* Esquina inferior izquierda, inclinada hacia arriba 
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
      </svg>*/}
      {/* Esquina superior derecha, inclinada hacia abajo */}
      <svg
        className="absolute left-300 top-100 w-[60vw] h-[90vh] z-0 pointer-events-none select-none"
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

      {/* Breadcrumb elegante */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-black/60">
          <button
            onClick={() => navigate("/")}
            className="hover:opacity-75 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Inicio</span>
          </button>
          <span>/</span>
          <span className="font-medium text-black truncate">{product.nombre}</span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-20">
          {/* Image Gallery */}
          <div className="mb-8 sm:mb-12 lg:mb-0">
            <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start">
              {/* Thumbnails */}
              <div className="flex lg:flex-col space-x-3 sm:space-x-4 lg:space-x-0 lg:space-y-3 sm:lg:space-y-4 mt-4 sm:mt-6 lg:mt-0 lg:mr-4 xl:mr-6">
                {product.imagenes.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-14 h-16 sm:w-16 sm:h-20 lg:w-20 lg:h-24 xl:w-24 xl:h-28 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-black shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.nombre} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 flex justify-center w-full">
                <div className="relative group w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[340px]">
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-gray-100 to-white rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <img
                    src={product.imagenes[selectedImage] || "/placeholder.svg"}
                    alt={product.nombre}
                    className="product-image-primary relative w-full aspect-[3/4] object-cover rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl border border-gray-200 bg-white z-20 transform group-hover:scale-105 transition-all duration-500 ease-out hover:shadow-3xl"
                    style={{
                      boxShadow:
                        "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pl-6 xl:pl-10 max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            <div className="mb-5 sm:mb-8">
              <span className="text-sm uppercase tracking-[0.14em] font-medium mb-2 block text-black/60">
                {product.categoria}
              </span>

              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-[0.15em] text-black mb-4 sm:mb-6 leading-tight">
                {product.nombre}
              </h1>

              {/* Precio */}
              {selectedEnvase && (
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-medium text-black">
                    {typeof selectedEnvase.precio === "number"
                      ? `$${selectedEnvase.precio.toLocaleString()}`
                      : "Sin precio"}
                  </span>
                </div>
              )}

              <p
                className="text-sm text-black font-light tracking-wide leading-relaxed max-w-md mb-6"
                style={{ letterSpacing: "0.08em" }}
              >
                {product.descripcion}
              </p>

              {/* Notas Aromáticas */}
              {product.notasAromaticas &&
                product.notasAromaticas.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-xs font-medium mb-3 uppercase tracking-[0.1em] flex items-center text-black">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Notas Aromáticas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.notasAromaticas.map((nota, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white/90 backdrop-blur-md text-black shadow-sm transition-all duration-300"
                        >
                          {nota}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Presentación */}
              {envasesDisponibles.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-medium mb-3 uppercase tracking-[0.1em] flex items-center text-black">
                    <Package className="h-4 w-4 mr-2" />
                    Presentación
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {envasesDisponibles.map((envase, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedEnvaseIndex(idx);
                          setQuantity(1); // Resetea la cantidad al cambiar de presentación
                        }}
                        className={`group relative transition-all duration-200 focus:outline-none w-full max-w-[110px]`}
                        style={{ minWidth: 90, maxWidth: 110 }}
                      >
                        <div className={
                          `relative w-full h-14 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200
                          font-sans px-4 py-3
                          ${selectedEnvaseIndex === idx
                            ? "border-black bg-black text-white shadow-2xl scale-105"
                            : "border-black bg-white/90 backdrop-blur-md text-black shadow-md hover:bg-black hover:text-white hover:shadow-2xl hover:scale-105"}
                          `
                        }>
                          {/* Indicador de selección */}
                          {selectedEnvaseIndex === idx && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                          )}
                          <div className={`text-[10px] font-medium mb-0.5 ${selectedEnvaseIndex === idx ? "text-white" : "text-black group-hover:text-white"}`}>{envase.tipo === "vidrio" ? "Vidrio" : "Plástico"}</div>
                          <div className={`text-base font-bold ${selectedEnvaseIndex === idx ? "text-white" : "text-black group-hover:text-white"}`}>{envase.volumen}ml</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="mb-5">
                <h3 className="text-xs font-medium mb-3 uppercase tracking-[0.1em] text-black">
                  Cantidad
                </h3>
                <div className="flex items-center border-2 border-gray-200 rounded-xl w-fit bg-white/90 backdrop-blur-md shadow-md transition-all duration-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:opacity-75 transition-colors rounded-l-xl focus:outline-none focus:ring-2 focus:ring-black/30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-black" />
                  </button>
                  <span className="px-6 py-3 font-medium text-center min-w-[48px] text-black text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedEnvase?.stock || 1, quantity + 1)
                      )
                    }
                    className="p-3 hover:opacity-75 transition-colors rounded-r-xl focus:outline-none focus:ring-2 focus:ring-black/30"
                    disabled={quantity >= (selectedEnvase?.stock || 1)}
                  >
                    <Plus className="h-4 w-4 text-black" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedEnvase}
                  className="w-full py-4 px-4 rounded-xl border-2 border-black text-black bg-white/90 backdrop-blur-md font-sans text-sm font-semibold transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 group"
                >
                  <ShoppingBag className="h-5 w-5 group-hover:animate-bounce" />
                  <span>Agregar al Carrito</span>
                </button>
                <a
                  href={contactPhone ? `https://wa.me/${contactPhone}?text=Hola!%20Quiero%20consultar%20por%20el%20perfume%20${encodeURIComponent(
                    product?.nombre || ""
                  )}%20(${
                    selectedEnvase?.tipo === "vidrio" ? "Vidrio" : "Plástico"
                  },%20${selectedEnvase?.volumen || ""}ml)` : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-4 rounded-xl border-2 border-green-600 text-green-700 bg-white/90 backdrop-blur-md font-sans text-sm font-semibold transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600/20 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group ${!contactPhone ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-disabled={!contactPhone}
                  tabIndex={!contactPhone ? -1 : 0}
                >
                  <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
                  <span>{contactPhone ? 'Consultar por WhatsApp' : 'WhatsApp no disponible'}</span>
                </a>
              </div>

              {/* Features - Dinámicas desde el backoffice */}
              {productDetailContent &&
                productDetailContent.infoCards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {productDetailContent.infoCards
                      .filter((card) => card.enabled)
                      .map((card, index) => (
                        <div
                          key={index}
                          className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white/90 backdrop-blur-md"
                        >
                          {renderIcon(
                            card.icon,
                            "h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-2 text-black"
                          )}
                          <div className="text-xs font-medium mb-1 text-black">
                            {card.title}
                          </div>
                          <div className="text-xs text-black/60">
                            {card.description}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

              {/* Expandable Sections - Dinámicas desde el backoffice */}
              {productDetailContent &&
                productDetailContent.expandableSections.length > 0 && (
                  <div className="space-y-2 mb-6 sm:mb-8">
                    {productDetailContent.expandableSections
                      .filter((section) => section.enabled)
                      .map((section) => (
                        <div
                          key={section.id}
                          className="border border-gray-200 rounded-lg sm:rounded-xl bg-white/90 backdrop-blur-md"
                        >
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between text-left hover:opacity-75 transition-colors rounded-lg sm:rounded-xl"
                          >
                            <span className="font-medium text-xs sm:text-sm text-black">
                              {section.title}
                            </span>
                            <ChevronDown
                              className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform text-black ${
                                expandedSections.has(section.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedSections.has(section.id) && (
                            <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                              <p className="font-light leading-relaxed text-xs sm:text-sm text-black/80">
                                {section.content}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}

              {/* Descripción del Dupe */}
              {product.descripcionDupe && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 bg-white/90 backdrop-blur-md">
                  <h3 className="font-serif text-base sm:text-lg font-medium mb-2 sm:mb-3 flex items-center text-black">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Información del Dupe
                  </h3>
                  <p className="font-light leading-relaxed text-xs sm:text-sm text-black/80">
                    {product.descripcionDupe}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 lg:mt-24">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-black mb-8 sm:mb-12 text-center">
              También te puede{" "}
              <span className="italic text-black/60">interesar</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="group relative overflow-hidden transition-all duration-500 ease-in-out
          shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl cursor-pointer flex flex-col hover:scale-[1.03]
          border border-gray-200 bg-white/90 backdrop-blur-md"
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                >
                  {/* Image Container */}
                  <div className="aspect-[3/4] rounded-t-lg sm:rounded-t-xl overflow-hidden relative">
                    <img
                      src={relatedProduct.imagenes?.[0] || "/placeholder.svg"}
                      alt={relatedProduct.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Image Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="font-serif font-medium mb-2 sm:mb-3 text-xs sm:text-sm line-clamp-2 text-black">
                      {relatedProduct.nombre}
                    </h3>
                    <p className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-black">
                      ${Math.round(relatedProduct.envases?.[0]?.precio || 0).toLocaleString()}
                    </p>

                    {/* "Ver más" button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${relatedProduct._id}`);
                      }}
                      className="w-full py-2 sm:py-3 rounded-full border border-black text-black bg-white/90 backdrop-blur-md font-sans text-xs uppercase tracking-widest font-normal transition-all duration-300 hover:bg-black hover:text-white shadow-sm hover:shadow-lg mt-auto"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
