import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategoryStrip } from './components/CategoryStrip';
import { PromoBanner } from './components/PromoBanner';
import { FilterStrip } from './components/FilterStrip';
import { ProductCard } from './components/ProductCard';
import { BottomNav } from './components/BottomNav';
import { CategoryPage } from './components/CategoryPage';
import { ProductPage } from './components/ProductPage';
import { FilterModal } from './components/FilterModal';
import { SellPage } from './components/SellPage';
import { SearchPage } from './components/SearchPage';
import { ProfilePage } from './components/ProfilePage';
import { PRODUCTS } from './constants';
import { Product } from './types';

type ViewState = 'HOME' | 'CATEGORY' | 'PRODUCT' | 'SELL' | 'SEARCH' | 'CHAT' | 'PROFILE';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [prevView, setPrevView] = useState<ViewState>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string} | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isHomeFilterOpen, setIsHomeFilterOpen] = useState(false);

  const handleCategorySelect = (id: string, name: string) => {
    setSelectedCategory({ id, name });
    setView('CATEGORY');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setPrevView(view);
    setView('PRODUCT');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    setView('HOME');
    setSelectedCategory(null);
    setSelectedProduct(null);
  };
  
  const handleNavClick = (newView: any) => {
      setView(newView);
      window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center font-sans antialiased text-zinc-900">
      {/* Mobile Wrapper: Bordered, No Shadow, Zinc-50 background */}
      <div className="w-full max-w-[430px] bg-white min-h-screen relative border-x border-zinc-200 pb-safe shadow-none">
        
        {/* VIEW: HOME */}
        {view === 'HOME' && (
          <>
            <FilterModal 
               isOpen={isHomeFilterOpen} 
               onClose={() => setIsHomeFilterOpen(false)} 
               onApply={() => setIsHomeFilterOpen(false)} 
            />
            
            <div className="sticky top-0 z-50 bg-white border-b border-zinc-200">
              <Header />
              <CategoryStrip onSelect={handleCategorySelect} />
            </div>

            <main className="w-full pb-[65px]">
              <div className="flex flex-col gap-4 mt-2">
                <PromoBanner />
                <FilterStrip onFilterClick={() => setIsHomeFilterOpen(true)} />
              </div>

              {/* Product Grid */}
              <div className="px-3 mt-6">
                <div className="flex items-baseline justify-between mb-3 px-1">
                   <h2 className="text-[15px] font-bold text-zinc-900 tracking-tight">Свежи обяви</h2>
                   <button className="text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Виж всички</button>
                </div>
                
                {/* Technical Grid: Gap-2, Tight */}
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCTS.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={() => handleProductSelect(product)}
                    />
                  ))}
                </div>
              </div>
            </main>
          </>
        )}

        {/* VIEW: SEARCH */}
        {view === 'SEARCH' && (
            <SearchPage onProductSelect={(p) => handleProductSelect(p)} />
        )}

        {/* VIEW: CATEGORY */}
        {view === 'CATEGORY' && selectedCategory && (
          <CategoryPage 
            categoryName={selectedCategory.name} 
            onBack={handleBackToHome}
            onProductSelect={handleProductSelect}
          />
        )}

        {/* VIEW: PRODUCT */}
        {view === 'PRODUCT' && selectedProduct && (
          <ProductPage 
            product={selectedProduct} 
            onBack={() => {
                if (selectedCategory) {
                    setView('CATEGORY');
                } else if (prevView === 'SEARCH') {
                    setView('SEARCH');
                } else {
                    setView('HOME');
                }
            }} 
          />
        )}

        {/* VIEW: SELL */}
        {view === 'SELL' && (
          <SellPage onClose={handleBackToHome} />
        )}
        
        {/* VIEW: PROFILE */}
        {view === 'PROFILE' && (
           <ProfilePage />
        )}

        {/* Persistent Bottom Nav */}
        {view !== 'PRODUCT' && view !== 'SELL' && (
            <BottomNav 
                currentView={view}
                onNavClick={handleNavClick}
                onSellClick={() => setView('SELL')} 
            />
        )}
      </div>
    </div>
  );
}

export default App;