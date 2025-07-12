"use client"
import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { ShoppingBag, Eye, Loader2, RefreshCw, Sparkles, Package, Star, ArrowRight, Filter } from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import { apiService } from "../../services/api"

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
}

const PRODUCTS_PER_PAGE_CATEGORY = 12

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [sortBy, setSortBy] = useState("name")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [isCategoryChanging, setIsCategoryChanging] = useState(false)

  useEffect(() => {
    if (category) {
      setCurrentPage(1)
      setTotalPages(1)
      setIsCategoryChanging(true)
      loadProductsByCategory(1, category, sortBy)
    }
  }, [category, sortBy])

  const loadProductsByCategory = async (pageToLoad: number, categoryName: string, currentSortBy: string) => {
    try {
      if (pageToLoad === 1) {
        if (products.length === 0) {
          setLoading(true)
        }
        setRetrying(false)
      } else {
        setLoadingMore(true)
      }

      const params: { limit: number; page: number; category?: string; sortBy?: string; sortOrder?: "asc" | "desc" } = {
        limit: PRODUCTS_PER_PAGE_CATEGORY,
        page: pageToLoad,
        category: categoryName,
      }

      if (currentSortBy === "price-low") {
        params.sortBy = "precio"
        params.sortOrder = "asc"
      } else if (currentSortBy === "price-high") {
        params.sortBy = "precio"
        params.sortOrder = "desc"
      } else {
        params.sortBy = "nombre"
        params.sortOrder = "asc"
      }

      const response = await apiService.getProducts(params)
      const transformedProducts = (response.payload || []).map((product: Product) => product)

      setProducts((prevProducts) =>
        pageToLoad === 1 ? transformedProducts : [...prevProducts, ...transformedProducts],
      )
      setTotalPages(response.totalPages)
      setCurrentPage(pageToLoad)
      setError(null)
    } catch (err) {
      console.error("Error loading products by category:", err)
      if (err instanceof Error && err.message.includes("429")) {
        setError("Estamos experimentando alta demanda. Por favor, espera unos minutos e intenta de nuevo.")
      } else {
        setError("No se pudieron cargar los productos. Intente nuevamente más tarde.")
      }
      if (pageToLoad === 1 && products.length === 0) {
        setProducts([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setIsCategoryChanging(false)
    }
  }

  const handleQuickAdd = (product: Product) => {
    const selectedVolume = product.volumen && product.volumen.length > 0 ? product.volumen[0] : null

    if (!selectedVolume) {
      alert("Este perfume no tiene volúmenes disponibles")
      return
    }

    addToCart(
      {
        id: product._id,
        name: product.nombre,
        price: selectedVolume.precio,
        image: product.imagenes[0] || "/placeholder.svg",
        size: selectedVolume.ml,
        color: "Único",
      },
      1,
    )
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      loadProductsByCategory(currentPage + 1, category!, sortBy)
    }
  }

  const handleRetry = () => {
    setRetrying(true)
    setTimeout(() => {
      loadProductsByCategory(1, category!, sortBy)
    }, 2000)
  }

  const hasMore = currentPage < totalPages

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f3ee] via-[#ede6db] to-[#e5dfd6] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bfa77a]/20 border-t-[#bfa77a] mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-[#bfa77a]/10 mx-auto"></div>
          </div>
          <p className="text-[#2d2a26] text-lg font-serif">Cargando perfumes...</p>
        </div>
      </div>
    )
  }

  if (retrying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f3ee] via-[#ede6db] to-[#e5dfd6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bfa77a]/20 border-t-[#bfa77a] mx-auto mb-8"></div>
          <p className="text-[#2d2a26] text-lg font-serif">Reintentando cargar perfumes...</p>
        </div>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f3ee] via-[#ede6db] to-[#e5dfd6] flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#e5dfd6] shadow-xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#2d2a26] mb-4">Error al cargar productos</h3>
          <p className="text-[#2d2a26]/70 mb-6 text-sm">{error}</p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="px-6 py-3 bg-gradient-to-r from-[#2d2a26] to-[#bfa77a] text-white font-serif rounded-2xl hover:scale-105 transition-transform duration-300 disabled:opacity-50"
          >
            {retrying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                Reintentando...
              </>
            ) : (
              "Reintentar"
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f3ee] via-[#ede6db] to-[#e5dfd6] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 opacity-10">
        <div className="w-32 h-32 rounded-full bg-[#bfa77a] blur-3xl"></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <div className="w-40 h-40 rounded-full bg-[#2d2a26] blur-2xl"></div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#e5dfd6]/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-[#bfa77a] hover:text-[#2d2a26] transition-colors font-medium">
              Inicio
            </Link>
            <span className="text-[#2d2a26]/50">/</span>
            <span className="font-medium capitalize text-[#2d2a26]">{category}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#e5dfd6] shadow-lg mb-6">
            <Package className="h-4 w-4 text-[#bfa77a] mr-2" />
            <span className="text-sm font-medium text-[#2d2a26] tracking-wide capitalize">Categoría {category}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#2d2a26] mb-6 leading-tight">
            Perfumes
            <span className="text-[#bfa77a] italic capitalize"> {category}</span>
          </h1>

          <p className="text-lg md:text-xl text-[#2d2a26]/70 font-light leading-relaxed max-w-3xl mx-auto">
            Descubre nuestra colección de perfumes {category?.toLowerCase()}, cuidadosamente seleccionados para
            ofrecerte una experiencia olfativa única.
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex justify-center mb-12 lg:mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e5dfd6] shadow-lg p-2">
            <Filter className="h-4 w-4 text-[#bfa77a] mr-3 ml-2" />
            <div className="flex space-x-1">
              {[
                { key: "name", label: "Nombre" },
                { key: "price-low", label: "Precio ↑" },
                { key: "price-high", label: "Precio ↓" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    sortBy === option.key
                      ? "bg-gradient-to-r from-[#2d2a26] to-[#bfa77a] text-white shadow-lg"
                      : "text-[#2d2a26] hover:bg-[#f7f3ee]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isCategoryChanging && products.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bfa77a]/20 border-t-[#bfa77a] mx-auto mb-4"></div>
              <p className="text-[#2d2a26] font-serif">Cambiando orden...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12 lg:mb-16">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#e5dfd6]/50 hover:border-[#bfa77a]/30 hover:scale-105 cursor-pointer"
                  onClick={() => (window.location.href = `/product/${product._id}`)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl bg-gradient-to-br from-[#f7f3ee] to-[#ede6db]">
                    <img
                      src={product.imagenes?.[0] || "/placeholder.svg"}
                      alt={product.nombre}
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-4 right-4 flex flex-col space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickAdd(product)
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#bfa77a] hover:text-white transition-all duration-300 hover:scale-110"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `/product/${product._id}`
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#2d2a26] hover:text-white transition-all duration-300 hover:scale-110"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-4 left-4">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.tipo === "vidrio" ? "bg-[#bfa77a] text-white" : "bg-[#2d2a26] text-white"
                        }`}
                      >
                        {product.tipo === "vidrio" ? "Vidrio" : "Plástico"}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-medium text-[#2d2a26] line-clamp-2 group-hover:text-[#bfa77a] transition-colors duration-300">
                        {product.nombre}
                      </h3>

                      {/* Aromatic notes */}
                      {product.notasAromaticas && product.notasAromaticas.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Sparkles className="h-3 w-3 text-[#bfa77a]" />
                          <span className="text-xs text-[#2d2a26]/60 truncate">
                            {product.notasAromaticas.slice(0, 2).join(", ")}
                            {product.notasAromaticas.length > 2 && "..."}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xl font-bold text-[#2d2a26]">
                          ${Math.round(product.precio).toLocaleString()}
                        </div>
                        {product.volumen && product.volumen.length > 0 && (
                          <div className="text-xs text-[#bfa77a] font-medium">desde {product.volumen[0].ml}</div>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-[#2d2a26]">4.8</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <span className="text-lg font-semibold text-[#2d2a26]">
                          {product.volumen && product.volumen.length > 0 ? `$${product.volumen[0].precio}` : 'Sin precio'}
                        </span>
                        {/* Precio de envase plástico, si existe */}
                        {product.volumen && product.volumen.length > 1 && (
                          <div className="text-xs text-[#2d2a26]/60 font-light mt-1">
                            Plástico: ${product.volumen[1].precio} ({product.volumen[1].ml}ml)
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = `/product/${product._id}`
                        }}
                        className="btn-primary px-2 py-1 text-xs"
                      >
                        Ver Detalles <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-[#2d2a26] text-[#2d2a26] font-serif text-lg rounded-2xl hover:bg-[#2d2a26] hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <span>Cargar más perfumes</span>
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* No Products Message */}
            {products.length === 0 && !loading && !error && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-[#f7f3ee] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-[#bfa77a]" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#2d2a26] mb-4">No se encontraron perfumes</h3>
                <p className="text-[#2d2a26]/70 mb-8">No hay perfumes disponibles en esta categoría en este momento.</p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2d2a26] to-[#bfa77a] text-white font-serif rounded-2xl hover:scale-105 transition-transform duration-300"
                >
                  <span>Explorar otras categorías</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
