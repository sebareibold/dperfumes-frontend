"use client"
import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { ShoppingBag, Eye, Loader2, RefreshCw, Sparkles, Package } from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import { apiService } from "../../services/api"

// Definición de interfaces actualizadas para perfumes
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

  // Pagination states
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

      // Add sorting parameters based on currentSortBy
      if (currentSortBy === "price-low") {
        params.sortBy = "precio"
        params.sortOrder = "asc"
      } else if (currentSortBy === "price-high") {
        params.sortBy = "precio"
        params.sortOrder = "desc"
      } else {
        // Default to name
        params.sortBy = "nombre"
        params.sortOrder = "asc"
      }

      const response = await apiService.getProducts(params)

      // Los productos ya vienen en el formato correcto del backend
      const transformedProducts = (response.payload || []).map((product: Product) => product)

      setProducts((prevProducts) =>
        pageToLoad === 1 ? transformedProducts : [...prevProducts, ...transformedProducts],
      )
      setTotalPages(response.totalPages)
      setCurrentPage(pageToLoad)
      console.log("Resultado de apiService.getProducts:", response);
      console.log("Productos en si obtenidos al luego de setear", products);
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
    // Usar el primer volumen disponible
    const selectedVolume = product.volumen && product.volumen.length > 0 ? product.volumen[0] : null;
    
    if (!selectedVolume) {
      alert("Este perfume no tiene volúmenes disponibles");
      return;
    }

    addToCart({
      id: product._id,
      name: product.nombre,
      price: selectedVolume.precio,
      image: product.imagenes[0] || "/placeholder.svg",
      size: selectedVolume.ml,
      color: "Único",
    }, 1)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay mx-auto"></div>
        <p className="mt-4" style={{ color: "var(--clay)" }}>
          Cargando perfumes...
        </p>
      </div>
    )
  }

  if (retrying) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay mx-auto"></div>
        <p className="mt-4" style={{ color: "var(--clay)" }}>
          Reintentando cargar perfumes...
        </p>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-4">
          <RefreshCw className="h-12 w-12 mx-auto" style={{ color: "var(--oak)" }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: "var(--deep-clay)" }}>
          Error al cargar productos
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--dark-clay)" }}>
          {error}
        </p>
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
          style={{
            background: "linear-gradient(to right, var(--clay), var(--dark-clay))",
          }}
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
            <Link
              to="/"
              className="hover:opacity-75 transition-colors"
              style={{ color: "var(--clay)" }}
            >
              Inicio
            </Link>
            <span>/</span>
            <span className="font-medium capitalize" style={{ color: "var(--deep-clay)" }}>
              {category}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1
            className="font-serif text-3xl lg:text-4xl font-light mb-4 lg:mb-6 capitalize"
            style={{ color: "var(--deep-clay)" }}
          >
            Perfumes {category}
          </h1>
          <p
            className="text-lg lg:text-xl font-light max-w-3xl mx-auto"
            style={{ color: "var(--dark-clay)" }}
          >
            Descubre nuestra colección de perfumes {category?.toLowerCase()}
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex justify-center mb-8 lg:mb-12">
          <div className="flex space-x-2 lg:space-x-4">
            <button
              onClick={() => setSortBy("name")}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 ${
                sortBy === "name" ? "shadow-warm" : "hover:shadow-warm"
              }`}
              style={{
                backgroundColor: sortBy === "name" ? "var(--clay)" : "var(--pure-white)",
                color: sortBy === "name" ? "var(--pure-white)" : "var(--dark-clay)",
                border: `2px solid ${sortBy === "name" ? "var(--clay)" : "var(--bone)"}`,
              }}
            >
              Nombre
            </button>
            <button
              onClick={() => setSortBy("price-low")}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 ${
                sortBy === "price-low" ? "shadow-warm" : "hover:shadow-warm"
              }`}
              style={{
                backgroundColor: sortBy === "price-low" ? "var(--clay)" : "var(--pure-white)",
                color: sortBy === "price-low" ? "var(--pure-white)" : "var(--dark-clay)",
                border: `2px solid ${sortBy === "price-low" ? "var(--clay)" : "var(--bone)"}`,
              }}
            >
              Precio: Menor
            </button>
            <button
              onClick={() => setSortBy("price-high")}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 ${
                sortBy === "price-high" ? "shadow-warm" : "hover:shadow-warm"
              }`}
              style={{
                backgroundColor: sortBy === "price-high" ? "var(--clay)" : "var(--pure-white)",
                color: sortBy === "price-high" ? "var(--pure-white)" : "var(--dark-clay)",
                border: `2px solid ${sortBy === "price-high" ? "var(--clay)" : "var(--bone)"}`,
              }}
            >
              Precio: Mayor
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {isCategoryChanging && products.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay mx-auto"></div>
              <p className="mt-4" style={{ color: "var(--clay)" }}>
                Cambiando orden...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group relative overflow-hidden transition-all duration-500 ease-in-out
          shadow-lg hover:shadow-xl rounded-lg cursor-pointer flex flex-col hover:scale-[1.03]
          border-[3px] border-transparent hover:border-clay"
                  onClick={() => window.location.href = `/product/${product._id}`}
                >
                  {/* Image Container */}
                  <div
                    className="aspect-[3/4] rounded-t-lg overflow-hidden relative"
                    style={{ backgroundColor: "var(--bone)" }}
                  >
                    <img
                      src={product.imagenes?.[0] || "/placeholder.svg"}
                      alt={product.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Image Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(product);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <ShoppingBag className="h-4 w-4" style={{ color: "var(--clay)" }} />
                    </button>

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/product/${product._id}`;
                      }}
                      className="absolute bottom-2 left-2 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <Eye className="h-4 w-4" style={{ color: "var(--clay)" }} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3 lg:p-4 flex flex-col flex-grow">
                    <h3
                      className="font-serif font-medium mb-2 text-sm lg:text-base line-clamp-2"
                      style={{ color: "var(--deep-clay)" }}
                    >
                      {product.nombre}
                    </h3>
                    
                    {/* Notas Aromáticas */}
                    {product.notasAromaticas && product.notasAromaticas.length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center mb-1">
                          <Sparkles className="h-3 w-3 mr-1" style={{ color: "var(--clay)" }} />
                          <span className="text-xs" style={{ color: "var(--oak)" }}>
                            {product.notasAromaticas.slice(0, 2).join(", ")}
                            {product.notasAromaticas.length > 2 && "..."}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tipo de Envase */}
                    <div className="mb-2">
                      <div className="flex items-center">
                        <Package className="h-3 w-3 mr-1" style={{ color: "var(--clay)" }} />
                        <span className="text-xs capitalize" style={{ color: "var(--oak)" }}>
                          {product.tipo === "vidrio" ? "Vidrio" : "Plástico"}
                        </span>
                      </div>
                    </div>

                    {/* Precio */}
                    <p className="font-semibold text-lg lg:text-xl mb-3" style={{ color: "var(--dark-clay)" }}>
                      ${Math.round(product.precio).toLocaleString()}
                    </p>

                    {/* "Ver más" button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/product/${product._id}`;
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

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 lg:px-10 lg:py-4 rounded-xl text-white font-medium text-sm lg:text-base uppercase tracking-[0.1em] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-warm-lg"
                  style={{
                    background: "linear-gradient(to right, var(--clay), var(--dark-clay))",
                  }}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      Cargando...
                    </>
                  ) : (
                    "Cargar más perfumes"
                  )}
                </button>
              </div>
            )}

            {/* No Products Message */}
            {products.length === 0 && !loading && !error && (
              <div className="text-center py-16">
                <div className="mb-4">
                  <Package className="h-16 w-16 mx-auto" style={{ color: "var(--oak)" }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: "var(--deep-clay)" }}>
                  No se encontraron perfumes
                </h3>
                <p className="text-sm" style={{ color: "var(--dark-clay)" }}>
                  No hay perfumes disponibles en esta categoría.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
