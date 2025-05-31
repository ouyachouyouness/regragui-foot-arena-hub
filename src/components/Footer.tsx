import { Clock, ExternalLink, Instagram, Link, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

// Footer Component
const Footer = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const quickLinks = [
    { path: "/reservation", label: t("navigation.reservation") || "Réservation", icon: "⚽" },
    { path: "/abonnements", label: t("navigation.subscriptions") || "Abonnements", icon: "💎" },
    { path: "/galerie", label: t("navigation.gallery") || "Galerie", icon: "📸" },
    { path: "/contact", label: t("navigation.contact") || "Contact", icon: "📞" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/regragui_foot/",
      icon: <Instagram className="w-5 h-5" />,
      color: "hover:text-pink-400"
    },
    {
      name: "Facebook",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: "hover:text-blue-400"
    },
    {
      name: "Twitter",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      color: "hover:text-blue-400"
    }
  ];

  const AnimatedLogo = () => (
    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6 group">
      <div className="relative">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          <img 
            src="/lovable-uploads/logo.png" 
            alt="Regragui Football Academy" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFCC00] to-[#FFD700] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold leading-tight text-white group-hover:text-[#FFCC00] transition-colors">
          Regragui Football Academy
        </span>
        <span className="text-sm text-blue-200 leading-tight font-medium">
          {isArabic ? "أكاديمية رقراقي لكرة القدم" : "Excellence • Passion • Performance"}
        </span>
      </div>
    </div>
  );

  return (
    <footer 
      className="bg-gradient-to-b from-[#0033A1] via-[#001a5c] to-[#000a2e] text-white py-16 mt-16 relative overflow-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 text-white/5 animate-pulse">⚽</div>
        <div className="absolute bottom-20 right-20 w-40 h-40 text-[#FFCC00]/10 animate-bounce">🏆</div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 text-white/5 animate-spin slow">⭐</div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0033A1]/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <AnimatedLogo />
            <p className="text-blue-100 mb-6 max-w-md leading-relaxed">
              {t("footer.description") || "L'académie de football moderne qui révolutionne l'entraînement au Maroc. Réservez vos terrains, développez vos compétences, vivez votre passion."}
            </p>
            
            {/* Social Media */}
            <div className="mb-6">
              <p className="text-[#FFCC00] font-semibold mb-3">
                {isArabic ? "تابعونا لتبقوا على اطلاع ⚽" : "Suivez-nous pour ne rien rater ⚽"}
              </p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target={social.url.startsWith('http') ? "_blank" : undefined}
                    rel={social.url.startsWith('http') ? "noopener noreferrer" : undefined}
                    className={`
                      p-3 bg-white/10 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/20
                      ${social.color}
                    `}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#FFCC00] flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              {t("footer.quickLinks") || "Liens rapides"}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-3 text-blue-100 hover:text-[#FFCC00] transition-all duration-300 hover:translate-x-2 rtl:hover:-translate-x-2 group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.label}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#FFCC00] flex items-center gap-2">
              <span className="text-2xl">📞</span>
              {t("footer.contact") || "Contact"}
            </h3>
            <div className="space-y-4 text-blue-100">
              <div className="flex items-center gap-3 hover:text-[#FFCC00] transition-colors">
                <MapPin className="w-5 h-5 text-[#FFCC00]" />
                <span>{t("footer.address") || "Errachidia, Maroc"}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-[#FFCC00] transition-colors">
                <Phone className="w-5 h-5 text-[#FFCC00]" />
                <a href="tel:+212612345678">{t("footer.phone") || "+212 6 12 34 56 78"}</a>
              </div>
              <div className="flex items-center gap-3 hover:text-[#FFCC00] transition-colors">
                <Mail className="w-5 h-5 text-[#FFCC00]" />
                <a href="mailto:contact@regragui-football.ma">
                  {t("footer.email") || "contact@regragui-football.ma"}
                </a>
              </div>
              <div className="flex items-center gap-3 hover:text-[#FFCC00] transition-colors">
                <Clock className="w-5 h-5 text-[#FFCC00]" />
                <span>{t("footer.hours") || "Lun-Dim: 06h-24h"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-200 text-center md:text-left">
            &copy; 2024 Regragui Football Academy. {t("footer.copyright") || "Tous droits réservés."}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-blue-300">
            <span>{isArabic ? "صُنع بـ" : "Fait avec"}</span>
            <span className="text-red-400 text-lg animate-pulse">❤️</span>
            <span>{isArabic ? "في المغرب" : "au Maroc"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Export both components
export default Footer ;