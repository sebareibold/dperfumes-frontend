import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOConfig, updatePageSEO } from '../config/seoConfig';

export const useSEO = (page: string, productName?: string) => {
  const location = useLocation();

  useEffect(() => {
    const seoConfig = getSEOConfig(page, productName);
    
    // Actualizar canonical URL con la ruta actual
    const canonicalUrl = `https://daisyperfumes.com${location.pathname}`;
    const configWithCanonical = {
      ...seoConfig,
      canonical: canonicalUrl
    };
    
    updatePageSEO(configWithCanonical);
  }, [page, productName, location.pathname]);
};

export const useProductSEO = (productName: string, productDescription?: string) => {
  const location = useLocation();

  useEffect(() => {
    const seoConfig = getSEOConfig('products', productName);
    
    // Personalizar descripción si se proporciona
    if (productDescription) {
      seoConfig.description = productDescription;
    }
    
    // Actualizar canonical URL
    const canonicalUrl = `https://daisyperfumes.com${location.pathname}`;
    const configWithCanonical = {
      ...seoConfig,
      canonical: canonicalUrl
    };
    
    updatePageSEO(configWithCanonical);
  }, [productName, productDescription, location.pathname]);
};

export const useCategorySEO = (categoryName: string) => {
  const location = useLocation();

  useEffect(() => {
    const seoConfig = getSEOConfig(categoryName);
    
    // Actualizar canonical URL
    const canonicalUrl = `https://daisyperfumes.com${location.pathname}`;
    const configWithCanonical = {
      ...seoConfig,
      canonical: canonicalUrl
    };
    
    updatePageSEO(configWithCanonical);
  }, [categoryName, location.pathname]);
}; 