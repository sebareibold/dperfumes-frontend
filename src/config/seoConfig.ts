export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export const defaultSEO: SEOConfig = {
  title: "Daisy Perfumes - Fragancias Artesanales Exclusivas | Neuquén, Patagonia",
  description: "Daisy Perfumes - Descubre fragancias artesanales y exclusivas en Neuquén. Perfumes de autor únicos, elegantes y de alta calidad. Envíos a toda la Patagonia. Tu boutique de perfumes premium.",
  keywords: "perfumes neuquén, daisy perfumes, fragancias artesanales, perfumes exclusivos, perfumes de autor, perfumes patagonia, perfumes minimalistas, perfumes elegantes, perfumes premium, boutique perfumes, perfumes artesanales argentina, fragancias únicas, perfumes naturales, perfumes sin alcohol, perfumes de nicho",
  ogTitle: "Daisy Perfumes - Fragancias Artesanales Exclusivas",
  ogDescription: "Descubre fragancias artesanales y exclusivas en Neuquén. Perfumes de autor únicos, elegantes y de alta calidad. Envíos a toda la Patagonia.",
  ogImage: "https://daisyperfumes.com/logo.png",
  canonical: "https://daisyperfumes.com"
};

export const seoConfigs: Record<string, SEOConfig> = {
  home: {
    ...defaultSEO,
    title: "Daisy Perfumes - Fragancias Artesanales Exclusivas | Neuquén, Patagonia",
    description: "Daisy Perfumes - Descubre fragancias artesanales y exclusivas en Neuquén. Perfumes de autor únicos, elegantes y de alta calidad. Envíos a toda la Patagonia. Tu boutique de perfumes premium.",
  },
  
  products: {
    title: "Perfumes Artesanales Exclusivos | Daisy Perfumes",
    description: "Explora nuestra colección de perfumes artesanales exclusivos. Fragancias únicas y elegantes creadas con ingredientes de la más alta calidad. Envíos a toda la Patagonia.",
    keywords: "perfumes artesanales, fragancias exclusivas, perfumes de autor, perfumes únicos, perfumes elegantes, perfumes premium, perfumes de nicho, fragancias artesanales argentina",
    ogTitle: "Perfumes Artesanales Exclusivos | Daisy Perfumes",
    ogDescription: "Explora nuestra colección de perfumes artesanales exclusivos. Fragancias únicas y elegantes creadas con ingredientes de la más alta calidad.",
  },

  category: {
    title: "Categorías de Perfumes | Daisy Perfumes",
    description: "Descubre nuestras categorías de perfumes: fragancias femeninas, masculinas, unisex, artesanales, exclusivas y más. Encuentra tu fragancia perfecta en Daisy Perfumes.",
    keywords: "categorías perfumes, fragancias femeninas, perfumes masculinos, perfumes unisex, perfumes artesanales, perfumes exclusivos, perfumes naturales, perfumes minimalistas",
    ogTitle: "Categorías de Perfumes | Daisy Perfumes",
    ogDescription: "Descubre nuestras categorías de perfumes: fragancias femeninas, masculinas, unisex, artesanales, exclusivas y más.",
  },

  cart: {
    title: "Carrito de Compras | Daisy Perfumes",
    description: "Tu carrito de compras en Daisy Perfumes. Revisa tus fragancias seleccionadas y completa tu pedido de perfumes artesanales exclusivos.",
    keywords: "carrito compras, comprar perfumes, pedido perfumes, fragancias seleccionadas",
    ogTitle: "Carrito de Compras | Daisy Perfumes",
    ogDescription: "Tu carrito de compras en Daisy Perfumes. Revisa tus fragancias seleccionadas y completa tu pedido.",
  },

  checkout: {
    title: "Finalizar Compra | Daisy Perfumes",
    description: "Finaliza tu compra de perfumes artesanales en Daisy Perfumes. Proceso seguro y fácil para recibir tus fragancias exclusivas en Neuquén y toda la Patagonia.",
    keywords: "finalizar compra, checkout, compra segura, envío perfumes, pago perfumes",
    ogTitle: "Finalizar Compra | Daisy Perfumes",
    ogDescription: "Finaliza tu compra de perfumes artesanales en Daisy Perfumes. Proceso seguro y fácil.",
  },

  trackOrder: {
    title: "Seguimiento de Pedido | Daisy Perfumes",
    description: "Rastrea tu pedido de perfumes artesanales en Daisy Perfumes. Consulta el estado de tu envío y recibe actualizaciones en tiempo real.",
    keywords: "seguimiento pedido, rastrear envío, estado pedido, tracking perfumes, envío perfumes",
    ogTitle: "Seguimiento de Pedido | Daisy Perfumes",
    ogDescription: "Rastrea tu pedido de perfumes artesanales en Daisy Perfumes. Consulta el estado de tu envío.",
  },

  // Categorías específicas
  "fragancias-femeninas": {
    title: "Fragancias Femeninas Artesanales | Daisy Perfumes",
    description: "Descubre nuestra colección de fragancias femeninas artesanales. Perfumes elegantes y sofisticados creados especialmente para mujeres que buscan fragancias únicas.",
    keywords: "fragancias femeninas, perfumes mujeres, perfumes femeninos, fragancias elegantes, perfumes sofisticados, perfumes artesanales mujeres",
    ogTitle: "Fragancias Femeninas Artesanales | Daisy Perfumes",
    ogDescription: "Descubre nuestra colección de fragancias femeninas artesanales. Perfumes elegantes y sofisticados.",
  },

  "fragancias-masculinas": {
    title: "Fragancias Masculinas Artesanales | Daisy Perfumes",
    description: "Explora nuestra línea de fragancias masculinas artesanales. Perfumes modernos y distinguidos para hombres que valoran la exclusividad y calidad.",
    keywords: "fragancias masculinas, perfumes hombres, perfumes masculinos, fragancias modernas, perfumes distinguidos, perfumes artesanales hombres",
    ogTitle: "Fragancias Masculinas Artesanales | Daisy Perfumes",
    ogDescription: "Explora nuestra línea de fragancias masculinas artesanales. Perfumes modernos y distinguidos.",
  },

  "fragancias-unisex": {
    title: "Fragancias Unisex Artesanales | Daisy Perfumes",
    description: "Descubre nuestras fragancias unisex artesanales. Perfumes versátiles y contemporáneos que se adaptan a cualquier personalidad y ocasión.",
    keywords: "fragancias unisex, perfumes unisex, fragancias versátiles, perfumes contemporáneos, perfumes artesanales unisex",
    ogTitle: "Fragancias Unisex Artesanales | Daisy Perfumes",
    ogDescription: "Descubre nuestras fragancias unisex artesanales. Perfumes versátiles y contemporáneos.",
  },

  "perfumes-artesanales": {
    title: "Perfumes Artesanales Exclusivos | Daisy Perfumes",
    description: "Nuestra colección de perfumes artesanales exclusivos. Cada fragancia es creada a mano con ingredientes naturales y técnicas tradicionales de perfumería.",
    keywords: "perfumes artesanales, fragancias artesanales, perfumes hechos a mano, perfumes naturales, perfumes exclusivos, perfumería artesanal",
    ogTitle: "Perfumes Artesanales Exclusivos | Daisy Perfumes",
    ogDescription: "Nuestra colección de perfumes artesanales exclusivos. Cada fragancia es creada a mano con ingredientes naturales.",
  },

  "perfumes-exclusivos": {
    title: "Perfumes Exclusivos de Autor | Daisy Perfumes",
    description: "Colección de perfumes exclusivos de autor en Daisy Perfumes. Fragancias únicas y limitadas creadas por perfumistas expertos para clientes exigentes.",
    keywords: "perfumes exclusivos, perfumes de autor, fragancias únicas, perfumes limitados, perfumes premium, perfumes de nicho",
    ogTitle: "Perfumes Exclusivos de Autor | Daisy Perfumes",
    ogDescription: "Colección de perfumes exclusivos de autor. Fragancias únicas y limitadas creadas por perfumistas expertos.",
  },

  "perfumes-naturales": {
    title: "Perfumes Naturales Artesanales | Daisy Perfumes",
    description: "Descubre nuestros perfumes naturales artesanales. Fragancias creadas con ingredientes 100% naturales, sin químicos artificiales, respetando tu piel y el medio ambiente.",
    keywords: "perfumes naturales, fragancias naturales, ingredientes naturales, perfumes sin químicos, perfumes orgánicos, perfumes eco-friendly",
    ogTitle: "Perfumes Naturales Artesanales | Daisy Perfumes",
    ogDescription: "Descubre nuestros perfumes naturales artesanales. Fragancias creadas con ingredientes 100% naturales.",
  },

  "perfumes-minimalistas": {
    title: "Perfumes Minimalistas Elegantes | Daisy Perfumes",
    description: "Nuestra línea de perfumes minimalistas elegantes. Fragancias sutiles y sofisticadas que destacan por su simplicidad y elegancia atemporal.",
    keywords: "perfumes minimalistas, fragancias sutiles, perfumes elegantes, perfumes sofisticados, fragancias simples, perfumes atemporales",
    ogTitle: "Perfumes Minimalistas Elegantes | Daisy Perfumes",
    ogDescription: "Nuestra línea de perfumes minimalistas elegantes. Fragancias sutiles y sofisticadas.",
  },

  "perfumes-sin-alcohol": {
    title: "Perfumes Sin Alcohol | Daisy Perfumes",
    description: "Perfumes sin alcohol para pieles sensibles. Fragancias suaves y duraderas que no irritan la piel, perfectas para uso diario y personas con sensibilidad.",
    keywords: "perfumes sin alcohol, fragancias sin alcohol, perfumes piel sensible, perfumes suaves, perfumes duraderos, perfumes hipoalergénicos",
    ogTitle: "Perfumes Sin Alcohol | Daisy Perfumes",
    ogDescription: "Perfumes sin alcohol para pieles sensibles. Fragancias suaves y duraderas que no irritan la piel.",
  },
};

export const getSEOConfig = (page: string, productName?: string): SEOConfig => {
  const baseConfig = seoConfigs[page] || defaultSEO;
  
  if (productName) {
    return {
      ...baseConfig,
      title: `${productName} | Daisy Perfumes`,
      description: `Descubre ${productName}, una fragancia artesanal exclusiva de Daisy Perfumes. Perfumes de autor únicos y elegantes en Neuquén y toda la Patagonia.`,
      keywords: `${productName}, perfume artesanal, fragancia exclusiva, perfume de autor, perfumes neuquén, daisy perfumes, ${baseConfig.keywords}`,
      ogTitle: `${productName} | Daisy Perfumes`,
      ogDescription: `Descubre ${productName}, una fragancia artesanal exclusiva de Daisy Perfumes.`,
    };
  }
  
  return baseConfig;
};

export const updatePageSEO = (config: SEOConfig) => {
  // Actualizar título
  document.title = config.title;
  
  // Actualizar meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', config.description);
  
  // Actualizar keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', config.keywords);
  
  // Actualizar canonical
  if (config.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', config.canonical);
  }
  
  // Actualizar Open Graph
  if (config.ogTitle) {
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', config.ogTitle);
  }
  
  if (config.ogDescription) {
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', config.ogDescription);
  }
  
  if (config.ogImage) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', config.ogImage);
  }
}; 