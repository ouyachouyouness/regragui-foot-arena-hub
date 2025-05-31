import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Clock, Users, Star, Play, ChevronDown, Menu, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegraguitFootballAcademy = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();


  // Translations
  const translations = {
    fr: {
      nav: {
        home: "Accueil",
        reservation: "Réservation",
        subscriptions: "Abonnements",
        gallery: "Galerie",
        contact: "Contact"
      },
      hero: {
        title: "Réserve ton terrain.",
        subtitle: "Joue comme un pro.",
        description: "L'académie de football moderne qui révolutionne l'entraînement au Maroc",
        cta1: "Réserver maintenant",
        cta2: "Découvrir nos abonnements"
      },
      features: {
        title: "Pourquoi choisir Regragui Football ?",
        subtitle: "Une expérience premium avec des installations de classe mondiale",
        feature1: {
          title: "Terrains Premium",
          desc: "Gazon synthétique dernière génération, éclairage LED professionnel"
        },
        feature2: {
          title: "Coaching Pro",
          desc: "Entraîneurs diplômés et méthodes d'entraînement modernes"
        },
        feature3: {
          title: "Technologie",
          desc: "App mobile, réservation en temps réel, suivi performance"
        }
      },
      stats: {
        players: "Joueurs actifs",
        fields: "Terrains premium",
        availability: "Disponibilité",
        satisfaction: "Satisfaction client"
      },
      subscriptions: {
        title: "Nos Abonnements Premium",
        subtitle: "Choisissez le plan qui correspond à votre passion",
        starter: {
          name: "Starter",
          matches: "4 matchs",
          price: "599",
          features: ["4 matchs de 90min", "Réservation flexible", "Support client", "Vestiaires standard"]
        },
        pro: {
          name: "Pro",
          matches: "8 matchs",
          price: "999",
          popular: "Le plus populaire",
          features: ["8 matchs de 90min", "Réservation prioritaire", "Vestiaires premium", "Coach personnalisé", "Analyse performance"]
        },
        elite: {
          name: "Elite",
          matches: "12 matchs",
          price: "1399",
          features: ["12 matchs de 90min", "Accès VIP", "Vestiaires privés", "Coach dédié", "Suivi médical", "Équipement fourni"]
        }
      },
      search: {
        center: "Centre",
        fieldType: "Type de terrain",
        date: "Date",
        search: "Rechercher"
      }
    },
    ar: {
      nav: {
        home: "الرئيسية",
        reservation: "الحجز",
        subscriptions: "الاشتراكات",
        gallery: "المعرض",
        contact: "التواصل"
      },
      hero: {
        title: "احجز الملعب ديالك.",
        subtitle: "العب بحال المحترفين.",
        description: "أكاديمية كرة القدم العصرية اللي كتثور التدريب فالمغرب",
        cta1: "احجز دابا",
        cta2: "اكتشف الاشتراكات"
      },
      features: {
        title: "علاش تختار أكاديمية رقراقي؟",
        subtitle: "تجربة ممتازة مع تجهيزات عالمية",
        feature1: {
          title: "ملاعب ممتازة",
          desc: "عشب اصطناعي من آخر جيل، إضاءة LED محترفة"
        },
        feature2: {
          title: "تدريب محترف",
          desc: "مدربين متخرجين وطرق تدريب عصرية"
        },
        feature3: {
          title: "تكنولوجيا",
          desc: "تطبيق موبايل، حجز فوري، متابعة الأداء"
        }
      },
      stats: {
        players: "لاعبين نشطين",
        fields: "ملاعب ممتازة",
        availability: "متاح",
        satisfaction: "رضا العملاء"
      },
      subscriptions: {
        title: "الاشتراكات الممتازة ديالنا",
        subtitle: "اختار الخطة اللي تناسب شغفك",
        starter: {
          name: "مبتدئ",
          matches: "4 مباريات",
          price: "599",
          features: ["4 مباريات 90 دقيقة", "حجز مرن", "دعم العملاء", "غرف تبديل عادية"]
        },
        pro: {
          name: "محترف",
          matches: "8 مباريات",
          price: "999",
          popular: "الأكثر شعبية",
          features: ["8 مباريات 90 دقيقة", "حجز بالأولوية", "غرف تبديل ممتازة", "مدرب شخصي", "تحليل الأداء"]
        },
        elite: {
          name: "نخبة",
          matches: "12 مباريات",
          price: "1399",
          features: ["12 مباريات 90 دقيقة", "دخول VIP", "غرف تبديل خاصة", "مدرب مخصص", "متابعة طبية", "معدات مجانية"]
        }
      },
      search: {
        center: "المركز",
        fieldType: "نوع الملعب",
        date: "التاريخ",
        search: "بحث"
      }
    }
  };

  const t = translations[currentLang];

  // Slides for hero carousel
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Terrains Premium",
      subtitle: "Gazon synthétique dernière génération"
    },
    {
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Compétitions Pro",
      subtitle: "Tournois et championnats réguliers"
    },
    {
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Formation d'Excellence",
      subtitle: "Coaching professionnel certifié"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const AnimatedLogo = () => (
    <div className="flex items-center space-x-3 group">
      <div className="relative">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          <div className="w-full h-full bg-gradient-to-br from-[#0033A1] to-[#3366CC] rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse">
            ⚽
          </div>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#0033A1] to-[#3366CC] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-tight text-white group-hover:text-[#FFCC00] transition-colors">
          Regragui Football
        </span>
        <span className="text-xs text-blue-200 leading-tight font-medium">
          Academy
        </span>
      </div>
    </div>
  );

  const PremiumCard = ({ children, className = "", hover = true }) => (
    <div className={`
      bg-white rounded-2xl border border-gray-100 shadow-lg 
      ${hover ? 'hover:shadow-2xl hover:-translate-y-2' : ''} 
      transition-all duration-500 overflow-hidden backdrop-blur-sm
      ${className}
    `}>
      {children}
    </div>
  );

  const GradientButton = ({ children, variant = "primary", className = "", ...props }) => {
    const variants = {
      primary: "bg-gradient-to-r from-[#0033A1] to-[#3366CC] hover:from-[#001a5c] hover:to-[#0033A1] text-white shadow-lg hover:shadow-xl",
      secondary: "bg-gradient-to-r from-[#FFCC00] to-[#FFD700] hover:from-[#e6b800] hover:to-[#FFCC00] text-[#0033A1] shadow-lg hover:shadow-xl",
      outline: "border-2 border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white"
    };
    
    return (
      <button 
        className={`
          px-8 py-4 font-bold rounded-xl transition-all duration-300 
          transform hover:scale-105 active:scale-95 flex items-center gap-2
          ${variants[variant]} ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  };

  const LanguageSwitcher = () => (
    <div className="relative">
      <button 
        onClick={() => setCurrentLang(currentLang === 'fr' ? 'ar' : 'fr')}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{currentLang === 'fr' ? 'عربي' : 'FR'}</span>
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${currentLang === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0033A1] via-[#001a5c] to-[#0033A1] shadow-2xl backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <AnimatedLogo />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {Object.entries(t.nav).map(([key, value]) => (
                <a 
                  key={key}
                  href={`${key}`} 
                  className="text-white hover:text-[#FFCC00] transition-all duration-300 font-medium relative group"
                >
                  {value}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFCC00] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <GradientButton variant="secondary" className="text-sm">
                {t.hero.cta1}
              </GradientButton>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col space-y-3">
                {Object.entries(t.nav).map(([key, value]) => (
                  <a 
                    key={key}
                    href={`#${key}`} 
                    className="text-white hover:text-[#FFCC00] transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {value}
                  </a>
                ))}
                <div className="pt-4 border-t border-blue-700">
                  <LanguageSwitcher />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0033A1]/80 via-[#001a5c]/60 to-[#0033A1]/80"></div>
            </div>
          ))}
        </div>

        {/* Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="text-white text-[20rem] font-bold animate-pulse">⚽</div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 animate-in fade-in duration-1000">
                <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
                  {t.hero.title}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC00] to-[#FFD700] animate-pulse">
                    {t.hero.subtitle}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-12 font-medium">
                  {t.hero.description}
                </p>
              </div>

              {/* Search Bar */}
              <PremiumCard className="p-8 mb-12 bg-white/95 backdrop-blur-md animate-in slide-in-from-bottom duration-1000 delay-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                  <div>
                    <label className="block text-sm font-bold text-[#0033A1] mb-3">
                      {t.search.center}
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0033A1] transition-colors bg-white">
                      <option>Casablanca Centre</option>
                      <option>Casablanca Maârif</option>
                      <option>Rabat Agdal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0033A1] mb-3">
                      {t.search.fieldType}
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0033A1] transition-colors bg-white">
                      <option>Football à 5</option>
                      <option>Football à 7</option>
                      <option>Football à 11</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0033A1] mb-3">
                      {t.search.date}
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0033A1] transition-colors bg-white"
                    />
                  </div>
                  <GradientButton className="h-14" onClick={() => navigate('/reservation')}>
      <span>{t.search.search}</span>
      <ChevronRight className="w-5 h-5" />
    </GradientButton>
                </div>
              </PremiumCard>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in slide-in-from-bottom duration-1000 delay-500">
                <GradientButton variant="secondary" className="text-lg px-12 py-6">
                  <Play className="w-6 h-6" />
                  {t.hero.cta1}
                </GradientButton>
                <GradientButton variant="outline" className="text-lg px-12 py-6 bg-white/10 backdrop-blur-sm">
                  {t.hero.cta2}
                  <ChevronRight className="w-6 h-6" />
                </GradientButton>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-[#FFCC00] scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[#FFCC00]" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#0033A1] to-[#001a5c] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 transform rotate-12 scale-150">
            {Array.from({length: 32}).map((_, i) => (
              <div key={i} className="text-4xl animate-pulse">⚽</div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "1000+", label: t.stats.players, icon: "👥" },
              { value: "8", label: t.stats.fields, icon: "⚽" },
              { value: "24/7", label: t.stats.availability, icon: "🕒" },
              { value: "98%", label: t.stats.satisfaction, icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-[#FFCC00] mb-2">{stat.value}</div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-[#0033A1] mb-6">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { ...t.features.feature1, icon: "⚽", gradient: "from-blue-500 to-blue-700" },
              { ...t.features.feature2, icon: "🏆", gradient: "from-yellow-500 to-yellow-600" },
              { ...t.features.feature3, icon: "📱", gradient: "from-green-500 to-green-600" }
            ].map((feature, index) => (
              <PremiumCard key={index} className="p-8 text-center group">
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#0033A1] mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Subscriptions Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-[#0033A1] mb-6">
              {t.subscriptions.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.subscriptions.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { ...t.subscriptions.starter, id: 'starter' },
              { ...t.subscriptions.pro, id: 'pro', popular: true },
              { ...t.subscriptions.elite, id: 'elite' }
            ].map((plan, index) => (
              <PremiumCard 
                key={index} 
                className={`p-8 relative ${plan.popular ? 'ring-4 ring-[#FFCC00] scale-105' : ''} ${selectedPlan === plan.id ? 'ring-2 ring-[#0033A1]' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[#FFCC00] to-[#FFD700] text-[#0033A1] px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 {plan.popular}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[#0033A1] mb-2">{plan.name}</h3>
                  <div className="text-sm text-gray-500 mb-4">{plan.matches}</div>
                  <div className="text-5xl font-black text-[#0033A1] mb-2">
                    {plan.price}<span className="text-lg text-gray-500">DH</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <GradientButton 
                  variant={plan.popular ? "secondary" : "primary"}
                  className="w-full justify-center"
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  Choisir ce plan
                  <ChevronRight className="w-5 h-5" />
                </GradientButton>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
  {/*     <footer className="bg-gradient-to-r from-[#0033A1] via-[#001a5c] to-[#0033A1] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <AnimatedLogo />
              <p className="text-blue-200 mt-6 max-w-md leading-relaxed">
                L'académie de football moderne qui révolutionne l'entraînement au Maroc. 
                Réservez vos terrains, développez vos compétences, vivez votre passion.
              </p>
              <div className="flex space-x-4 mt-6">
                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFCC00] hover:text-[#0033A1] transition-all">
                    <span className="text-sm font-bold">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-[#FFCC00]">Liens rapides</h3>
              <ul className="space-y-3">
                {Object.entries(t.nav).map(([key, value]) => (
                  <li key={key}>
                    <a href={`#${key}`} className="text-blue-200 hover:text-[#FFCC00] transition-colors">
                      {value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-[#FFCC00]">Contact</h3>
              <div className="space-y-3 text-blue-200">
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Casablanca, Maroc</p>
                <p className="flex items-center"><Clock className="w-4 h-4 mr-2" /> 24h/24 - 7j/7</p>
                <p>📞 +212 6 12 34 56 78</p>
                <p>✉️ contact@regragui-football.ma</p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-8 mt-12 text-center text-blue-200">
            <p>&copy; 2024 Regragui Football Academy. Tous droits réservés.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default RegraguitFootballAcademy;