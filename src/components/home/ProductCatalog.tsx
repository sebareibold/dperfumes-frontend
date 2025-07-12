"use client"

import { useState, useEffect } from "react"
import { useCart } from "../../contexts/CartContext"
import { apiService } from "../../services/api"
import { ArrowRight, ShoppingBag, Eye, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import formatPriceWithDot from "../utils/formatPriceWithDot"

interface Product {
  _id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  stock: number
  status: boolean
  imagenes: string[]
  volumen: Array<{
    ml: string
    precio: number
  }>
  notasAromaticas: string[]
  descripcionDupe?: string
  tipo: "vidrio" | "plastico"
  fragancia?: string // Added for the new badge
}

interface ProductCatalogContent {
  mainTitle: string
  subtitle: string
  categories: { name: string; display_name: string }[]
}

interface ProductCatalogProps {
  content: ProductCatalogContent | undefined
}

export default function ProductCatalog({ content }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // Dinámicamente obtener categorías
  const [allCategories, setAllCategories] = useState<string[]>([])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)
      try {
        const response = await apiService.getProducts({})
        const prods = response.payload || []
        setProducts(prods)
        // Extraer categorías y notas únicas
        const categories = Array.from(new Set(prods.map((p: Product) => p.categoria)))
        setAllCategories(categories)
      } catch {
        setError("No se pudieron cargar los productos.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (!content) {
    return (
      <section className="py-20 lg:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-[var(--accent-gold)]">Contenido del catálogo no disponible</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 lg:py-20 bg-transparent relative overflow-hidden" id="products">
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full gradient-navbar backdrop-blur-sm border border-[var(--primary-blue)]/30 shadow-lg mb-6">
            <Sparkles className="h-4 w-4 text-[var(--primary-blue)] mr-2 icon-elegant-accent" />
            <span className="text-sm font-medium text-[var(--primary-dark)] tracking-wide">Nuestra Colección</span>
          </div>
          <h2 className="font-serif text-5xl font-bold gradient-text mb-4 leading-tight">
            Todas Nuestras
            <span className="text-[var(--primary-blue)] italic"> Fragancias</span>
          </h2>
          <p className="text-lg text-[var(--text-aux)] font-light leading-relaxed max-w-3xl mx-auto mb-6">
            Descubre nuestra completa colección de fragancias únicas y exclusivas
          </p>
          {/* Categorías como tabs horizontales */}
          <div className="flex flex-wrap justify-center gap-2 mt-2 mb-2">
            <button
              className={`px-5 py-2 rounded-full font-medium border transition-all duration-200 text-sm ${selectedCategory === null ? "badge-gradient text-white border-[var(--primary-blue)]" : "gradient-card border-[var(--primary-blue)]/30 text-[var(--primary-dark)] hover:badge-gradient hover:text-white"}`}
              onClick={() => setSelectedCategory(null)}
            >
              Todas
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full font-medium border transition-all duration-200 text-sm ${selectedCategory === cat ? "badge-gradient text-white border-[var(--primary-blue)]" : "gradient-card border-[var(--primary-blue)]/30 text-[var(--primary-dark)] hover:badge-gradient hover:text-white"}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Aquí irá el grid de productos y paginación, sin cambios por ahora */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--primary-blue)]/20 border-t-[var(--primary-blue)]"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-[var(--primary-blue)]/10"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center p-8 gradient-card backdrop-blur-sm rounded-2xl border border-[var(--primary-blue)]/30 shadow-elegant-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠</span>
              </div>
              <span className="text-red-600 text-lg font-medium">{error}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid (sin cambios por ahora) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {products.map((product, index) => {
                // Obtener el precio más bajo entre todos los volúmenes
                const allVolumes = Array.isArray(product.volumen) ? product.volumen : []
                const minPrice = allVolumes.length > 0 ? Math.min(...allVolumes.map(vol => vol.precio)) : Infinity
                const minPriceVolume = allVolumes.find(vol => vol.precio === minPrice) || { precio: Infinity, ml: '' }
                // Buscar si hay un envase de tipo plástico
                const plasticVolume = product.tipo === 'plastico' && allVolumes.length > 0 ? allVolumes[0] : undefined
                const selectedVolume = allVolumes.length > 0 ? allVolumes[0] : undefined
                return (
                  <div
                    key={product._id}
                    className="group relative  card-elegant transition-all duration-500 overflow-hidden border border-[var(--primary-blue)]/30 shadow-elegant product-card-gradient h-[430px] flex flex-col justify-between"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Badge superior izquierda: nombre de la fragancia */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="px-3 py-1 rounded-lg text-xs font-medium gradient-primary border border-[var(--primary-blue)]/30 shadow-elegant">
                        <span className="text-white font-semibold">
                          {product.notasAromaticas && product.notasAromaticas.length > 0 
                            ? product.notasAromaticas[0] 
                            : "Fragancia"}
                        </span>
                      </div>
                    </div>
                    {/* Image Container */}
                    <div className="relative flex-1 min-h-0 overflow-hidden gradient-hero flex items-center justify-center">
                      <img
                        src={product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : "/perfume-placeholder.png"}
                        alt={product.nombre}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ maxHeight: '250px' }}
                      />
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 overlay-gradient opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <div className="absolute top-4 right-4 flex flex-col space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(
                                {
                                  id: product._id,
                                  name: product.nombre,
                                  price: selectedVolume ? selectedVolume.precio : 0,
                                  image: product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : "/perfume-placeholder.png",
                                  size: selectedVolume ? selectedVolume.ml : 'N/A',
                                  color: "Único",
                                },
                                1,
                              )
                            }}
                            className="w-10 h-10 gradient-navbar backdrop-blur-sm rounded-full flex items-center justify-center shadow-elegant hover:text-[var(--primary-dark)] transition-all duration-300 ease-out hover:scale-110 transform"
                          >
                            <ShoppingBag className="h-4 w-4 icon-elegant" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/product/${product._id}`)
                            }}
                            className="w-10 h-10 gradient-navbar backdrop-blur-sm rounded-full flex items-center justify-center shadow-elegant hover:text-[var(--primary-blue)] transition-all duration-300 ease-out hover:scale-110 transform"
                          >
                            <Eye className="h-4 w-4 icon-elegant" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-medium text-[var(--primary-dark)] line-clamp-2 group-hover:text-[var(--primary-blue)] transition-colors duration-300">
                          {product.nombre}
                        </h3>
                        {/* Aromatic notes */}
                        {product.notasAromaticas && product.notasAromaticas.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Sparkles className="h-3 w-3 text-[var(--primary-blue)] icon-elegant-accent" />
                            <span className="text-xs text-[var(--text-aux)] font-medium">
                              {product.notasAromaticas.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        )}
                        <p className="text-[var(--text-aux)] text-sm font-light line-clamp-2">
                          {product.descripcion}
                        </p>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline space-x-1 justify-start">
                          <span className="text-lg font-bold gradient-text">
                            {allVolumes.length > 0
                              ? `$${formatPriceWithDot(minPriceVolume.precio)}`
                              : 'Sin precio'}
                          </span>
                          {plasticVolume && (
                            <span className="text-xs text-[var(--text-aux)] font-medium">
                              / ${formatPriceWithDot(plasticVolume.precio)}
                            </span>
                          )}
                        </div>
                        {plasticVolume && (
                          <div className="text-xs text-[var(--text-aux)] mt-0.5 font-light">
                            {plasticVolume.ml}ml plástico disponible
                          </div>
                        )}
                        <button
                          className="btn-futuristic mt-4 w-full"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          <span className="flex items-center justify-center">
                            Ver más
                            <ArrowRight className="h-5 w-5 ml-1.5 icon-elegant" />
                          </span>
                        </button>
                      </div>
                    </div> 
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
