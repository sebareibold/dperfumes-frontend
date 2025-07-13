"use client"

import { useState, useEffect } from "react"
import { apiService } from "../../services/api"
import { ArrowRight, Sparkles } from "lucide-react"
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
    <section className="py-10 lg:py-20 bg-white relative overflow-hidden" id="products">
      {/* Separador curvo superior */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{height: '80px'}}>
        <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 80 Q 960 0 1920 80 V0 H0V80Z" fill="#F2F4F7" />
        </svg>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-25">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-black mb-4 leading-tight uppercase tracking-widest">
            Todas Nuestras
            <span className="text-black italic font-normal"> Fragancias</span>
          </h2>
          <p className="text-sm md:text-base text-black font-light leading-relaxed max-w-3xl mx-auto mb-6">
            Descubre nuestra completa colección de fragancias únicas y exclusivas
          </p>
          {/* Categorías como tabs horizontales */}
          <div className="flex flex-wrap justify-center gap-2 mt-2 mb-2">
            <button
              className={`px-5 py-2 rounded-full font-medium border border-black transition-all duration-200 text-sm ${selectedCategory === null ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"}`}
              onClick={() => setSelectedCategory(null)}
            >
              Todas
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full font-medium border border-black transition-all duration-200 text-sm ${selectedCategory === cat ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"}`}
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
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-black/10 border-t-black"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center p-8 bg-white border border-black/10 rounded-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠</span>
              </div>
              <span className="text-red-600 text-lg font-medium">{error}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {products.map((product, index) => {
                // Obtener el precio más bajo entre todos los volúmenes
                const allVolumes = Array.isArray(product.volumen) ? product.volumen : []
                const minPrice = allVolumes.length > 0 ? Math.min(...allVolumes.map(vol => vol.precio)) : Infinity
                const minPriceVolume = allVolumes.find(vol => vol.precio === minPrice) || { precio: Infinity, ml: '' }
                // Buscar si hay un envase de tipo plástico
                const plasticVolume = product.tipo === 'plastico' && allVolumes.length > 0 ? allVolumes[0] : undefined
                return (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-3xl shadow-none hover:shadow-lg transition-all duration-300 overflow-hidden border border-black/10 hover:border-black hover:scale-105 cursor-pointer h-[430px] flex flex-col justify-between"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Badge superior izquierda: nombre de la fragancia */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="px-3 py-1 rounded-lg text-xs font-medium bg-white border border-black/10">
                        <span className="text-black font-semibold">
                          {product.notasAromaticas && product.notasAromaticas.length > 0
                            ? product.notasAromaticas[0]
                            : "Fragancia"}
                        </span>
                      </div>
                    </div>
                    {/* Image Container */}
                    <div className="relative flex-1 min-h-0 overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : "/perfume-placeholder.png"}
                        alt={product.nombre}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ maxHeight: '250px' }}
                      />
                    </div>
                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-serif text-base font-semibold text-black line-clamp-2 group-hover:underline transition-colors duration-300 uppercase tracking-widest">
                          {product.nombre}
                        </h3>
                        {/* Aromatic notes */}
                        {product.notasAromaticas && product.notasAromaticas.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Sparkles className="h-3 w-3 text-black" />
                            <span className="text-xs text-black/60 font-medium">
                              {product.notasAromaticas.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        )}
                        <p className="text-black/60 text-xs font-light line-clamp-2">
                          {product.descripcion}
                        </p>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline space-x-1 justify-start">
                          <span className="text-base font-semibold text-black">
                            {allVolumes.length > 0
                              ? `$${formatPriceWithDot(minPriceVolume.precio)}`
                              : 'Sin precio'}
                          </span>
                          {plasticVolume && (
                            <span className="text-xs text-black/60 font-medium">
                              / ${formatPriceWithDot(plasticVolume.precio)}
                            </span>
                          )}
                        </div>
                        {plasticVolume && (
                          <div className="text-xs text-black/60 mt-0.5 font-light">
                            {plasticVolume.ml}ml plástico disponible
                          </div>
                        )}
                        <button
                          className="border border-black text-black bg-white px-4 py-2 rounded-full font-sans text-xs uppercase tracking-widest font-normal transition-all duration-300 hover:bg-black hover:text-white focus:outline-none shadow-none hover:shadow-lg mt-4 w-full"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          <span className="flex items-center justify-center">
                            Ver más
                            <ArrowRight className="h-5 w-5 ml-1.5" />
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
      {/* Separador curvo inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{height: '80px'}}>
        <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-180">
          <path d="M0 80 Q 960 0 1920 80 V0 H0V80Z" fill="#F2F4F7" />
        </svg>
      </div>
    </section>
  )
}
