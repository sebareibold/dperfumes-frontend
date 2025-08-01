"use client"
import { useState, useEffect } from "react"
import { apiService } from "../../services/api"
import { ArrowRight, Sparkles, Filter, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import formatPriceWithDot from "../utils/formatPriceWithDot"

interface Product {
  _id: string
  nombre: string
  descripcion: string
  categoria: string // Este será "mujer", "hombre", etc.
  estado: boolean
  imagenes: string[]
  envases?: Array<{
    _id: string
    tipo: string
    ml: string
    precio: number
    stock: number
  }>
  notasAromaticas: string[]
  descripcionDupe?: string
  fragancia?: string
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

  // Estados para filtros
  const [allAromaticNotes, setAllAromaticNotes] = useState<string[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [selectedAromaticNote, setSelectedAromaticNote] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)
      try {
        const response = await apiService.getProducts()
        const prods = response.payload || []

        // Convertir los productos para asegurar compatibilidad de tipos
        const convertedProducts: Product[] = prods.map((prod: any) => ({
          ...prod,
          envases: prod.envases || [],
          notasAromaticas: prod.notasAromaticas || [],
        }))

        setProducts(convertedProducts)

        // Extraer todas las notas aromáticas únicas
        const allNotes = convertedProducts.reduce((notes: string[], product) => {
          if (product.notasAromaticas && product.notasAromaticas.length > 0) {
            return [...notes, ...product.notasAromaticas]
          }
          return notes
        }, [])

        const uniqueNotes = Array.from(new Set(allNotes))
        setAllAromaticNotes(uniqueNotes)

        // Extraer todas las categorías únicas
        const categories = Array.from(new Set(convertedProducts.map((product) => product.categoria)))
        setAllCategories(categories)
      } catch {
        setError("No se pudieron cargar los productos.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filtrar productos por nota aromática y categoría seleccionados
  const filteredProducts = products.filter((product) => {
    const matchesAromaticNote = selectedAromaticNote
      ? product.notasAromaticas && product.notasAromaticas.includes(selectedAromaticNote)
      : true
    const matchesCategory = selectedCategory ? product.categoria === selectedCategory : true
    return matchesAromaticNote && matchesCategory
  })

  useEffect(() => {
    const handleClickOutside = () => {
      if (isFilterOpen) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen])

  // Función para obtener el emoji y texto de la categoría
  const getCategoryDisplay = (category: string) => {
    switch (category.toLowerCase()) {
      case "mujer":
      case "femenino":
        return { emoji: "👩", text: "Mujer" }
      case "hombre":
      case "masculino":
        return { emoji: "👨", text: "Hombre" }
      case "unisex":
        return { emoji: "👫", text: "Unisex" }
      default:
        return { emoji: "🌟", text: category.charAt(0).toUpperCase() + category.slice(1) }
    }
  }

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
      {/* Separador curvo superior - MOBILE */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden leading-none block sm:hidden -mt-8"
        style={{ height: "80px" }}
      >
        <svg viewBox="0 0 600 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full ">
          <path d="M0 80 Q 300 0 600 80 V0 H0V80Z" fill="#F2F4F7" />
        </svg>
      </div>

      {/* Separador curvo superior - DESKTOP */}
      <div
        className="absolute -top-10 left-0 w-full overflow-hidden leading-none hidden sm:block"
        style={{ height: "140px" }}
      >
        <svg viewBox="0 0 1920 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 140 Q 960 0 1920 140 V0 H0V140Z" fill="#F2F4F7" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-25">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-black mb-4 leading-tight uppercase tracking-widest">
            Todas Nuestras
            <span className="text-black italic font-normal"> Fragancias Artesanales</span>
          </h2>
          <p className="text-sm md:text-base text-black font-light leading-relaxed max-w-3xl mx-auto mb-6">
            Descubre nuestra completa colección de fragancias únicas y exclusivas
          </p>

          {/* Filtro de categoría con dropdown */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm ${
                  selectedCategory
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black hover:bg-black hover:text-white"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>{selectedCategory ? getCategoryDisplay(selectedCategory).text : "Filtrar por genero"}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-black/10 rounded-lg shadow-lg z-20 min-w-[200px]">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setIsFilterOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-black/5 transition-colors ${
                        selectedCategory === null ? "bg-black/5 font-medium" : ""
                      }`}
                    >
                      Todos los generos
                    </button>
                    {allCategories.map((category) => {
                      const display = getCategoryDisplay(category)
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category)
                            setIsFilterOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-black/5 transition-colors ${
                            selectedCategory === category ? "bg-black/5 font-medium" : ""
                          }`}
                        >
                          {display.emoji} {display.text}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filtros por notas aromáticas */}
          <div className="flex flex-wrap justify-center gap-2 mt-2 mb-2">
            <button
              className={`px-5 py-2 rounded-full font-medium border border-black transition-all duration-200 text-sm ${
                selectedAromaticNote === null
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
              onClick={() => setSelectedAromaticNote(null)}
            >
              Todas las Notas
            </button>
            {allAromaticNotes.map((note) => (
              <button
                key={note}
                className={`px-5 py-2 rounded-full font-medium border border-black transition-all duration-200 text-sm ${
                  selectedAromaticNote === note
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
                onClick={() => setSelectedAromaticNote(note)}
              >
                {note}
              </button>
            ))}
          </div>

          {/* Mostrar contador de productos filtrados */}
          <p className="text-xs text-black/60 mt-2">
            {selectedAromaticNote || selectedCategory ? (
              <>
                {filteredProducts.length} fragancia{filteredProducts.length !== 1 ? "s" : ""}
                {selectedAromaticNote && ` con nota de ${selectedAromaticNote}`}
                {selectedCategory && ` para ${getCategoryDisplay(selectedCategory).text.toLowerCase()}`}
                {(selectedAromaticNote || selectedCategory) && " encontradas"}
              </>
            ) : (
              `${products.length} fragancia${products.length !== 1 ? "s" : ""} disponibles`
            )}
          </p>

          {(selectedAromaticNote || selectedCategory) && (
            <button
              onClick={() => {
                setSelectedAromaticNote(null)
                setSelectedCategory(null)
              }}
              className="text-xs text-black/60 hover:text-black underline mt-1"
            >
              Limpiar filtros
            </button>
          )}
        </div>

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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 sm: px-1">
              {filteredProducts.map((product, index) => {
                // Buscar si hay un envase de tipo plástico
                const plasticVolume =
                  product.envases && product.envases.length > 0
                    ? product.envases
                        .filter((envase) => envase.tipo === "plastico")
                        .reduce((min, curr) => (curr.precio < min.precio ? curr : min), {
                          precio: Number.POSITIVE_INFINITY,
                          ml: "",
                          _id: "",
                          tipo: "plastico",
                          stock: 0,
                        })
                    : null

                return (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-3xl shadow-none hover:shadow-lg transition-all duration-300 overflow-hidden border border-black/10 hover:border-black hover:scale-105 cursor-pointer h-[430px] flex flex-col justify-between"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Badge superior izquierda: categoría */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="px-3 py-1 rounded-lg text-xs font-medium bg-white border border-black/10">
                        <span className="text-black font-semibold">
                          {product.notasAromaticas[0]}
                        </span>
                      </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative flex-1 min-h-0 overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={
                          product.imagenes && product.imagenes.length > 0
                            ? product.imagenes[0]
                            : "/perfume-placeholder.png"
                        }
                        alt={product.nombre}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ maxHeight: "250px" }}
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

                        <p className="text-black/60 text-xs font-light line-clamp-2">{product.descripcion}</p>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-baseline space-x-1 justify-start">
                          {plasticVolume && plasticVolume.precio !== Number.POSITIVE_INFINITY && (
                            <span className="text-base font-semibold text-black">
                              ${formatPriceWithDot(plasticVolume.precio)}
                            </span>
                          )}
                        </div>

                        {plasticVolume && plasticVolume.precio !== Number.POSITIVE_INFINITY && (
                          <div className="text-xs text-black/60 mt-0.5 font-light">
                            Variedad de envases disponibles
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

            {/* Mensaje cuando no hay productos filtrados */}
            {filteredProducts.length === 0 && (selectedAromaticNote || selectedCategory) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-black/40" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">No se encontraron fragancias</h3>
                <p className="text-black/60 mb-4">
                  No hay productos disponibles con los filtros seleccionados
                  {selectedAromaticNote && ` (nota: ${selectedAromaticNote})`}
                  {selectedCategory && ` (categoría: ${getCategoryDisplay(selectedCategory).text})`}
                </p>
                <button
                  onClick={() => {
                    setSelectedAromaticNote(null)
                    setSelectedCategory(null)
                  }}
                  className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Separador curvo inferior - MOBILE */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-none block sm:hidden -mb-8"
        style={{ height: "80px" }}
      >
        <svg viewBox="0 0 600 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0 Q 300 80 600 0 V80 H0V0Z" fill="#F2F4F7" />
        </svg>
      </div>

      {/* Separador curvo inferior - DESKTOP */}
      <div
        className="absolute -bottom-4 left-0 w-full overflow-hidden leading-none hidden sm:block"
        style={{ height: "140px" }}
      >
        <svg viewBox="0 0 1920 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0 Q 960 140 1920 0 V140 H0V0Z" fill="#F2F4F7" />
        </svg>
      </div>
    </section>
  )
}
