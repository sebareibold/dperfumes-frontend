"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
} from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import { apiService } from "../../services/api"

// Definición de interfaces actualizadas para perfumes
interface Product {
  _id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  volumen: Array<{
    ml: string
    precio: number
  }>
  notasAromaticas: string[]
  imagenes: string[]
  descripcionDupe?: string
  tipo: "vidrio" | "plastico"
  status?: boolean
}

interface InfoCard {
  icon: string
  title: string
  description: string
  enabled: boolean
}

interface ExpandableSection {
  id: string
  title: string
  content: string
  enabled: boolean
}

interface ProductDetailContent {
  infoCards: InfoCard[]
  expandableSections: ExpandableSection[]
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
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVolume, setSelectedVolume] = useState<{ml: string, precio: number} | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [expandedSections, setExpandedSections] = useState(new Set<string>())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productDetailContent, setProductDetailContent] = useState<ProductDetailContent | null>(null)

  useEffect(() => {
    if (id) {
      loadProduct(id)
      loadProductDetailContent()
    }
  }, [id])

  const loadProductDetailContent = async () => {
    try {
      const response = await apiService.getSiteContent()
      if (response.success && response.content.productDetail) {
        setProductDetailContent(response.content.productDetail)
      }
    } catch (err) {
      console.error("Error loading product detail content:", err)
      // Valores por defecto para perfumes
      setProductDetailContent({
        infoCards: [
          { icon: "Truck", title: "Envío Gratis", description: "En compras superiores a $30.000", enabled: true },
          { icon: "RotateCcw", title: "30 Días", description: "Para cambios y devoluciones", enabled: true },
          { icon: "Shield", title: "Garantía", description: "Calidad garantizada", enabled: true },
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
      })
    }
  }

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true)
      const response = await apiService.getProduct(productId)

      if (response.success && response.product) {
        const productData = response.product as Product
        setProduct(productData)
        
        // Seleccionar el primer volumen por defecto
        if (productData.volumen && productData.volumen.length > 0) {
          setSelectedVolume(productData.volumen[0])
        }

        // Track product view interaction
        await apiService.createInteraction("product_view", {
          productId: response.product._id,
          productTitle: response.product.nombre,
          productPrice: response.product.precio,
          productCategory: response.product.categoria,
        })

        // Load related products
        loadRelatedProducts(productData.categoria)
      } else {
        setError("No se pudo encontrar el producto")
      }
    } catch (err) {
      console.error("Error loading product:", err)
      setError("Error al cargar el producto. Intente nuevamente más tarde.")
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedProducts = async (category: string) => {
    try {
      const response = await apiService.getProducts({
        category: category,
        limit: 4,
      })

      const related = (response.payload || [])
        .filter((p: any) => p._id !== id)
        .slice(0, 4)
        .map((p: any) => p as Product)

      setRelatedProducts(related)
    } catch (err) {
      console.error("Error loading related products:", err)
      setRelatedProducts([])
    }
  }

  const handleAddToCart = () => {
    if (!product || !selectedVolume) {
      alert("Por favor selecciona un volumen")
      return
    }

    addToCart(
      {
        id: product._id,
        name: product.nombre,
        price: selectedVolume.precio,
        image: product.imagenes[selectedImage],
        size: selectedVolume.ml,
        color: "Único",
      },
      quantity,
    )

    alert(`${product.nombre} (${selectedVolume.ml}) agregado al carrito`)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const renderIcon = (iconName: string, className = "h-6 w-6") => {
    const IconComponent = iconMap[iconName]
    if (IconComponent) {
      return <IconComponent className={className} style={{ color: "var(--clay)" }} />
    }
    const InfoIcon = iconMap["Info"]
    return <InfoIcon className={className} style={{ color: "var(--clay)" }} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--soft-creme)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay mx-auto"></div>
          <p className="mt-4" style={{ color: "var(--clay)" }}>
            Cargando perfume...
          </p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--soft-creme)" }}>
        <div className="text-center">
          <h2 className="font-serif text-2xl font-light mb-4" style={{ color: "var(--deep-clay)" }}>
            {error || "Perfume no encontrado"}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="hover:opacity-75 underline font-medium"
            style={{ color: "var(--clay)" }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--soft-creme)" }}>
      {/* Breadcrumb */}
      <div
        style={{
          backgroundColor: "var(--pure-white)",
          borderBottom: `1px solid var(--bone)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm" style={{ color: "var(--oak)" }}>
            <button
              onClick={() => navigate("/")}
              className="hover:opacity-75 transition-colors"
              style={{ color: "var(--clay)" }}
            >
              Inicio
            </button>
            <span>/</span>
            <span className="font-medium" style={{ color: "var(--deep-clay)" }}>
              {product.nombre}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
          {/* Image Gallery */}
          <div className="mb-6 lg:mb-0">
            <div className="flex flex-col-reverse lg:flex-row">
              {/* Thumbnails */}
              <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 mt-6 lg:mt-0 lg:mr-6">
                {product.imagenes.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 lg:w-24 lg:h-28 rounded-xl overflow-hidden border-3 transition-all ${
                      selectedImage === index ? "shadow-warm" : "hover:opacity-75"
                    }`}
                    style={{
                      borderColor: selectedImage === index ? "var(--clay)" : "var(--bone)",
                    }}
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
              <div className="flex-1">
                <div
                  className="aspect-[3/4] rounded-2xl overflow-hidden shadow-warm-lg"
                  style={{ backgroundColor: "var(--pure-white)" }}
                >
                  <img
                    src={product.imagenes[selectedImage] || "/placeholder.svg"}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pl-8">
            <div className="mb-4 lg:mb-8">
              <span
                className="text-sm uppercase tracking-[0.15em] font-medium mb-2 lg:mb-3 block"
                style={{ color: "var(--clay)" }}
              >
                {product.categoria}
              </span>

              <h1
                className="font-serif text-2xl lg:text-4xl font-medium mb-3 lg:mb-6 tracking-wide"
                style={{ color: "var(--deep-clay)" }}
              >
                {product.nombre}
              </h1>

              {/* Precio */}
              {selectedVolume && (
                <div className="flex items-center space-x-3 lg:space-x-4 mb-4 lg:mb-6">
                  <span className="text-2xl lg:text-3xl font-medium" style={{ color: "var(--deep-clay)" }}>
                    ${selectedVolume.precio.toLocaleString()}
                  </span>
                </div>
              )}

              <p
                className="font-light leading-relaxed text-base lg:text-lg mb-6 lg:mb-10"
                style={{ color: "var(--dark-clay)" }}
              >
                {product.descripcion}
              </p>

              {/* Notas Aromáticas */}
              {product.notasAromaticas && product.notasAromaticas.length > 0 && (
                <div className="mb-6 lg:mb-8">
                  <h3
                    className="text-sm font-medium mb-3 lg:mb-4 uppercase tracking-[0.1em] flex items-center"
                    style={{ color: "var(--deep-clay)" }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" style={{ color: "var(--clay)" }} />
                    Notas Aromáticas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.notasAromaticas.map((nota, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "var(--bone)",
                          color: "var(--clay)",
                        }}
                      >
                        {nota}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tipo de Envase */}
              <div className="mb-6 lg:mb-8">
                <h3
                  className="text-sm font-medium mb-3 lg:mb-4 uppercase tracking-[0.1em] flex items-center"
                  style={{ color: "var(--deep-clay)" }}
                >
                  <Package className="h-4 w-4 mr-2" style={{ color: "var(--clay)" }} />
                  Tipo de Envase
                </h3>
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-medium capitalize"
                  style={{
                    backgroundColor: product.tipo === "vidrio" ? "var(--clay)" : "var(--oak)",
                    color: "var(--pure-white)",
                  }}
                >
                  {product.tipo === "vidrio" ? "Vidrio" : "Plástico"}
                </span>
              </div>
            </div>

            {/* Volume Selection */}
            {product.volumen && product.volumen.length > 0 && (
              <div className="mb-6 lg:mb-10">
                <h3
                  className="text-sm font-medium mb-3 lg:mb-4 uppercase tracking-[0.1em]"
                  style={{ color: "var(--deep-clay)" }}
                >
                  Volumen: <span style={{ color: "var(--clay)" }}>{selectedVolume?.ml}</span>
                </h3>
                <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-3">
                  {product.volumen.map((vol) => (
                    <button
                      key={vol.ml}
                      onClick={() => setSelectedVolume(vol)}
                      className={`py-3 lg:py-4 px-1 border-2 rounded-lg text-xs font-medium transition-all ${
                        selectedVolume?.ml === vol.ml ? "shadow-warm" : "hover:shadow-warm"
                      }`}
                      style={{
                        borderColor: selectedVolume?.ml === vol.ml ? "var(--clay)" : "var(--oak)",
                        backgroundColor: selectedVolume?.ml === vol.ml ? "var(--bone)" : "var(--pure-white)",
                        color: selectedVolume?.ml === vol.ml ? "var(--deep-clay)" : "var(--dark-clay)",
                      }}
                    >
                      {vol.ml}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-4 lg:mb-6">
              <h3
                className="text-sm font-medium mb-3 lg:mb-4 uppercase tracking-[0.1em]"
                style={{ color: "var(--deep-clay)" }}
              >
                Cantidad
              </h3>
              <div
                className="flex items-center border-2 rounded-xl w-fit"
                style={{
                  borderColor: "var(--oak)",
                  backgroundColor: "var(--pure-white)",
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 lg:p-4 hover:opacity-75 transition-colors rounded-l-xl"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" style={{ color: "var(--clay)" }} />
                </button>
                <span
                  className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-center min-w-[60px]"
                  style={{ color: "var(--deep-clay)" }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 lg:p-4 hover:opacity-75 transition-colors rounded-r-xl"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" style={{ color: "var(--clay)" }} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mb-6 lg:mb-10">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVolume}
                className="w-full py-4 lg:py-5 rounded-xl text-white font-medium text-sm uppercase tracking-[0.1em] transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 lg:space-x-3 shadow-warm-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(to right, var(--clay), var(--dark-clay))",
                }}
              >
                <ShoppingBag className="h-4 lg:h-5 w-4 lg:w-5" />
                <span>Agregar al Carrito</span>
              </button>
            </div>

            {/* Features - Dinámicas desde el backoffice */}
            {productDetailContent && productDetailContent.infoCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-10">
                {productDetailContent.infoCards
                  .filter((card) => card.enabled)
                  .map((card, index) => (
                    <div
                      key={index}
                      className="text-center p-3 lg:p-4 rounded-xl border"
                      style={{
                        backgroundColor: "var(--pure-white)",
                        borderColor: "var(--bone)",
                      }}
                    >
                      {renderIcon(card.icon, "h-5 w-5 lg:h-6 lg:w-6 mx-auto mb-2")}
                      <div className="text-xs font-medium mb-1" style={{ color: "var(--dark-clay)" }}>
                        {card.title}
                      </div>
                      <div className="text-xs" style={{ color: "var(--oak)" }}>
                        {card.description}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Expandable Sections - Dinámicas desde el backoffice */}
            {productDetailContent && productDetailContent.expandableSections.length > 0 && (
              <div className="space-y-1 mb-6 lg:mb-10">
                {productDetailContent.expandableSections
                  .filter((section) => section.enabled)
                  .map((section) => (
                    <div
                      key={section.id}
                      className="border-b rounded-xl mb-2"
                      style={{
                        borderColor: "var(--bone)",
                        backgroundColor: "var(--pure-white)",
                      }}
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full py-4 lg:py-5 px-4 lg:px-6 flex items-center justify-between text-left hover:opacity-75 transition-colors rounded-xl"
                      >
                        <span className="font-medium text-sm lg:text-base" style={{ color: "var(--deep-clay)" }}>
                          {section.title}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 lg:h-5 lg:w-5 transition-transform ${
                            expandedSections.has(section.id) ? "rotate-180" : ""
                          }`}
                          style={{ color: "var(--oak)" }}
                        />
                      </button>
                      {expandedSections.has(section.id) && (
                        <div className="px-4 lg:px-6 pb-4 lg:pb-5">
                          <p
                            className="font-light leading-relaxed text-sm lg:text-base"
                            style={{ color: "var(--dark-clay)" }}
                          >
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
              <div className="mb-6 lg:mb-10 p-6 rounded-2xl shadow-warm border"
                style={{
                  backgroundColor: "var(--pure-white)",
                  borderColor: "var(--bone)",
                }}
              >
                <h3
                  className="font-serif text-lg lg:text-xl font-medium mb-3 flex items-center"
                  style={{ color: "var(--deep-clay)" }}
                >
                  <Heart className="h-5 w-5 mr-2" style={{ color: "var(--clay)" }} />
                  Información del Dupe
                </h3>
                <p
                  className="font-light leading-relaxed text-sm lg:text-base"
                  style={{ color: "var(--dark-clay)" }}
                >
                  {product.descripcionDupe}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <h2
              className="font-serif text-2xl lg:text-3xl font-light mb-8 lg:mb-12 text-center"
              style={{ color: "var(--deep-clay)" }}
            >
              También te puede{" "}
              <span className="italic" style={{ color: "var(--clay)" }}>
                interesar
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="group relative overflow-hidden transition-all duration-500 ease-in-out
          shadow-lg hover:shadow-xl rounded-lg cursor-pointer flex flex-col hover:scale-[1.03]
          border-[3px] border-transparent hover:border-clay"
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                >
                  {/* Image Container */}
                  <div
                    className="aspect-[3/4] rounded-t-lg overflow-hidden relative"
                    style={{ backgroundColor: "var(--bone)" }}
                  >
                    <img
                      src={relatedProduct.imagenes?.[0] || "/placeholder.svg"}
                      alt={relatedProduct.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Image Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-3 lg:p-4 flex flex-col flex-grow">
                    <h3
                      className="font-serif font-medium mb-3 text-sm lg:text-base line-clamp-2"
                      style={{ color: "var(--deep-clay)" }}
                    >
                      {relatedProduct.nombre}
                    </h3>
                    <p className="font-semibold text-lg lg:text-xl mb-4" style={{ color: "var(--dark-clay)" }}>
                      ${Math.round(relatedProduct.precio).toLocaleString()}
                    </p>

                    {/* "Ver más" button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/product/${relatedProduct._id}`)
                      }}
                      className="w-full py-2.5 lg:py-3 rounded-xl text-white font-semibold text-xs lg:text-sm uppercase tracking-[0.1em] transition-all duration-300 hover:brightness-110 shadow-md hover:shadow-lg mt-auto"
                      style={{
                        background: "linear-gradient(to right, var(--clay), var(--dark-clay))",
                      }}
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
  )
}
