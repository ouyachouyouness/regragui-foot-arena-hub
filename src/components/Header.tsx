
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./LoginModal";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t("navigation.home") },
    { path: "/reservation", label: t("navigation.reservation") },
    { path: "/abonnements", label: t("navigation.subscriptions") },
    { path: "/galerie", label: t("navigation.gallery") },
    { path: "/contact", label: t("navigation.contact") },
  ];

  return (
    <>
      <header className="academy-gradient text-white shadow-lg fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
                <img 
                  src="/lovable-uploads/6cd8582e-05fb-4fa1-966c-c8ae4e53368e.png" 
                  alt="Regragui Football Academy" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">Regragui Football</span>
                <span className="text-xs text-blue-200 leading-tight">Academy</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-yellow-400 transition-colors duration-300 relative font-medium ${
                    location.pathname === item.path ? "text-yellow-400" : ""
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Language Switcher & Auth Section */}
            <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
              <LanguageSwitcher />
              {user ? (
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span className="text-sm">{t("navigation.hello")}, {user.name}</span>
                  <Button onClick={logout} variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-900">
                    {t("navigation.logout")}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsLoginOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold">
                  {t("navigation.login")}
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
                    className={`hover:text-yellow-400 transition-colors duration-300 ${
                      location.pathname === item.path ? "text-yellow-400" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-blue-700">
                  <LanguageSwitcher />
                </div>
                {user ? (
                  <div className="pt-2">
                    <span className="text-sm block mb-2">{t("navigation.hello")}, {user.name}</span>
                    <Button onClick={logout} variant="outline" size="sm" className="w-full border-white text-white hover:bg-white hover:text-blue-900">
                      {t("navigation.logout")}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsLoginOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold w-full">
                    {t("navigation.login")}
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
