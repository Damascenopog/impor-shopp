import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { MobileMenu } from './components/layout/MobileMenu';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AddedToCartToast } from './components/cart/AddedToCartToast';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { CookieBanner } from './components/layout/CookieBanner';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { HowToBuyPage } from './pages/HowToBuyPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { AboutPage } from './pages/AboutPage';
import { CheckoutPreviewPage } from './pages/CheckoutPreviewPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-white min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Ops! Algo deu errado ao carregar o componente.</h2>
          <p className="text-xs text-gray-500 mb-4 font-mono">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-4 py-2 text-xs font-bold rounded"
          >
            Recarregar Página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Scroll to top on route change component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const AppContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#ecf0f1] text-[#333333]">
      <ScrollToTop />
      
      {/* Header */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Offcanvas Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Added to Cart Notification Toast / Modal */}
      <AddedToCartToast />

      {/* Floating Elements */}
      <FloatingWhatsApp />
      <CookieBanner />

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/produtos/:slug" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/account/login" element={<LoginPage />} />
          <Route path="/account/register" element={<RegisterPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/perguntas-frequentes" element={<FaqPage />} />
          <Route path="/como-comprar" element={<HowToBuyPage />} />
          <Route path="/trocas-e-devolucoes" element={<ReturnsPage />} />
          <Route path="/quem-somos" element={<AboutPage />} />
          <Route path="/checkout" element={<CheckoutPreviewPage />} />

          {/* Dynamic category route for /original-apple, /caixas-de-som, etc. */}
          <Route path="/:slug" element={<CategoryPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}
