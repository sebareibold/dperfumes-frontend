"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext";
import { apiService } from "../../services/api";

// Definición de interfaces actualizadas para perfumes
interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  status: boolean;
  imagenes: string[];
  volumen: Array<{
    ml: string;
    precio: number;
  }>;
  notasAromaticas: string[];
  descripcionDupe?: string;
  tipo: "vidrio" | "plastico";
}

// Interfaz para el contenido del catálogo
interface ProductCatalogContent {
  mainTitle: string;
  subtitle: string;
  categories: { name: string; display_name: string }[];
}

interface ProductCatalogProps {
  content: ProductCatalogContent | undefined;
}

export default function ProductCatalogAlt({ content }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getProducts({ limit: 4, page: 1 });
        setProducts(response.payload || []);
      } catch {
        setError("No se pudieron cargar los productos destacados.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (!content) {
    return (
      <section className="py-20 lg:py-28 bg-[#f7f3ee]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-lg text-[#bfa77a]">Contenido del catálogo no disponible</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-28 bg-[#f7f3ee]" id="products">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2d2a26] mb-12 text-left">Featured Products</h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="text-[#bfa77a] text-lg">Cargando productos...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="text-red-400 text-lg">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => {
              const selectedVolume = product.volumen[0];
              return (
                <div key={product._id} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border border-[#e5dfd6]">
                  <img
                    src={product.imagenes[0] || "/perfume-placeholder.png"}
                    alt={product.nombre}
                    className="w-32 h-48 object-contain mb-6 rounded"
                  />
                  <h3 className="font-serif text-xl font-light text-[#2d2a26] mb-2 text-center">{product.nombre}</h3>
                  <p className="text-sm text-[#bfa77a] mb-2 text-center">{product.notasAromaticas.join(", ")}</p>
                  <p className="font-serif text-lg text-[#2d2a26] mb-4">${selectedVolume.precio}</p>
                  <button
                    className="border border-[#2d2a26] text-[#2d2a26] font-serif px-6 py-2 rounded hover:bg-[#bfa77a] hover:text-white transition-colors"
                    onClick={() => addToCart({
                      id: product._id,
                      name: product.nombre,
                      price: selectedVolume.precio,
                      image: product.imagenes[0] || "/perfume-placeholder.png",
                      size: selectedVolume.ml,
                      color: "Único",
                    }, 1)}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
