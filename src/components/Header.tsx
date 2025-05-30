
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./LoginModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/reservation", label: "Réservation" },
    { path: "/abonnements", label: "Abonnements" },
    { path: "/galerie", label: "Galerie" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="bg-black text-white shadow-lg fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold">Regragui Football</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-green-400 transition-colors duration-300 relative ${
                    location.pathname === item.path ? "text-green-400" : ""
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-400 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Bonjour, {user.name}</span>
                  <Button onClick={logout} variant="outline" size="sm">
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsLoginOpen(true)} className="bg-green-600 hover:bg-green-700">
                  Connexion
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-6 h-6"
            >
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 animate-fade-in">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`hover:text-green-400 transition-colors duration-300 ${
                      location.pathname === item.path ? "text-green-400" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <div className="pt-4 border-t border-gray-700">
                    <span className="text-sm block mb-2">Bonjour, {user.name}</span>
                    <Button onClick={logout} variant="outline" size="sm" className="w-full">
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsLoginOpen(true)} className="bg-green-600 hover:bg-green-700 w-full">
                    Connexion
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;
