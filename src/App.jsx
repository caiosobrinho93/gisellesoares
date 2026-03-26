import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';
import Galeria from './pages/Galeria';
import Esmaltes from './pages/Esmaltes';
import Agendamento from './pages/Agendamento';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Usuario from './pages/Usuario';
import Admin from './pages/admin/Admin';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <div className="h-20 md:h-24" aria-hidden="true" />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}

function LoadingGuard({ children }) {
  const { loading } = useAuth();
  if (loading) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return children;
}

export default function App() {
  return (
    <BrowserRouter basename="/gisellesoares/">
      <AuthProvider>
        <LoadingGuard>
          <AppProvider>
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/galeria" element={<Layout><Galeria /></Layout>} />
              <Route path="/esmaltes" element={<Layout><Esmaltes /></Layout>} />
              <Route path="/agendar" element={<Layout><Agendamento /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/cadastro" element={<Layout><Cadastro /></Layout>} />
              <Route path="/usuario" element={<Layout><Usuario /></Layout>} />
            </Routes>
          </AppProvider>
        </LoadingGuard>
      </AuthProvider>
    </BrowserRouter>
  );
}
