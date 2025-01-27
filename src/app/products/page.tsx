"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Products } from './_components/product';
import "@fontsource/syne";
import { ArrowLeft } from 'lucide-react';
import Navbar from './_components/Navbar';

import { supabase } from "../_lib/Supabase";

const FeaturedProduct = dynamic(
  () => import('./_components/FeaturedProduct').then(mod => mod.FeaturedProduct),
  { loading: () => <ProductSkeleton />, ssr: false }
);

const TopPick = dynamic(
  () => import('./_components/TopPicks').then(mod => mod.TopPick),
  { loading: () => <ProductSkeleton />, ssr: false }
);

const NewProduct = dynamic(
  () => import('./_components/NewProduct').then(mod => mod.NewProduct),
  { loading: () => <ProductSkeleton />, ssr: false }
);

const SearchBar = dynamic(
  () => import('./_components/SearchBar').then(mod => mod.SearchBar),
  { ssr: false }
);

const CategoryProduct = dynamic(
  () => import('./_components/CategoryProducts').then(mod => mod.CategoryProduct),
  { loading: () => <ProductSkeleton />, ssr: false }
);

const ProductSkeleton = () => (
  <div className="animate-pulse mr-4">
    <div className="w-64 h-64 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export default function ProductList() {
  const [products, setProducts] = useState<Record<string, { items: Products[], hasMore: boolean }>>({
    'Hair Products': { items: [], hasMore: true },
    'Skin Products': { items: [], hasMore: true },
    'Nail Products': { items: [], hasMore: true },
    'Exclusive Deals': { items: [], hasMore: true },
    'Top Picks': { items: [], hasMore: true },
    'New Arrivals': { items: [], hasMore: true },
  });
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Products[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [openLogin, setOpenLogin] = useState(false);

  const fetchProductsByCategory = async (category: string, limit: number, offset: number) => { 
    const { data, error } = await supabase 
      .from('products') 
      .select('id, product_name, price, image_url, available') 
      .eq('category', category) 
      .range(offset, offset + limit - 1); 
 
    if (error) { 
      console.error(`Error fetching ${category}:`, error); 
      return []; 
    } 
    return data || []; 
  };

  const loadProducts = async () => {
    try {
      const categories = [
        'Exclusive Deals',
        'Top Picks',
        'New Arrivals',
        'Hair Products',
        'Skin Products',
        'Nail Products',
        'Beauty Accessories',
      ];

      const initialLimit = 5;
      const results = await Promise.all(
        categories.map(async (category) => {
          const data = await fetchProductsByCategory(category, initialLimit, 0);
          return { category, data, hasMore: data.length === initialLimit };
        })
      );

      const newProducts = results.reduce((acc, { category, data, hasMore }) => {
        acc[category] = { items: data, hasMore };
        return acc;
      }, {} as Record<string, { items: Products[], hasMore: boolean }>);

      setProducts(newProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('product_name', `%${query}%`);

      if (error) throw error;

      setSearchResults(data || []);
      setIsSearchMode(true);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAllProducts = () => {
    setIsSearchMode(false);
    setSearchResults([]);
  };

  const loadMoreProducts = useCallback(async (category: string) => {
    if (!products[category].hasMore) return;
    const currentProducts = products[category].items;
    const offset = currentProducts.length;
    const limit = 5;

    const newProducts = await fetchProductsByCategory(category, limit, offset);
    setProducts(prevProducts => ({
      ...prevProducts,
      [category]: {
        items: [...prevProducts[category].items, ...newProducts],
        hasMore: newProducts.length === limit,
      }
    }));
  }, [products]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id) {
        const category = entry.target.id.replace('sentinel-', '');
        loadMoreProducts(category);
      }
    });
  }, [loadMoreProducts]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, { threshold: 0.5 });
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    Object.keys(products).forEach(category => {
      const sentinel = document.getElementById(`sentinel-${category}`);
      if (sentinel) observerRef.current?.observe(sentinel);
    });
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
    <Navbar open={openLogin} setOpen={setOpenLogin} />
      <div className="min-h-screen bg-white font-syne">
        <div className="container mx-auto px-4 py-8">
          {isSearchMode && (
            <button
              onClick={handleBackToAllProducts}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 mt-12 -mb-16 rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="mb-12 mt-14  space-x-4">
            <SearchBar onSearch={handleSearch} />

          </div>

          {isSearchMode ? (
            <section className="mb-16">
              <h2 className="text-3xl mb-8">Search Results</h2>
              {searchResults.length > 0 ? (
                <div className="flex overflow-x-auto pb-4 scrollbar-hide w-full">
                  {searchResults.map((product, index) => (
                    <CategoryProduct
                      key={`search-result-${product.id}`}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No products found matching your search.</p>
              )}
            </section>
          ) : (
            Object.entries(products).map(([category, { items: categoryProducts, hasMore }]) =>
              categoryProducts.length > 0 ? (
                <React.Fragment key={`section-${category}`}>
                  <section className="mb-16">
                    <h2 className="text-3xl mb-8">{category}</h2>
                    <div className="w-full">
                      <div className="flex overflow-x-auto pb-4 scrollbar-hide w-full">
                        {categoryProducts.map((product, index) => {
                          const productKey = `${category}-${product.id || index}`;
                          switch (category) {
                            case 'Exclusive Deals':
                              return <FeaturedProduct key={productKey} product={product} index={index} />;
                            case 'Top Picks':
                              return <TopPick key={productKey} product={product} />;
                            case 'New Arrivals':
                              return <NewProduct key={productKey} product={product} />;
                            default:
                              return <CategoryProduct key={productKey} product={product} index={index} />;
                          }
                        })}
                        {hasMore && (
                          <div id={`sentinel-${category}`} className="w-64 h-64"></div>
                        )}
                      </div>
                    </div>
                  </section>
                </React.Fragment>
              ) : null
            )
          )}
        </div>
      </div>
    </>
  );
}