import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Users, Search, Loader2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchAvailableFields, getAvailableFieldTypes, type SearchFilters } from '@/firebase/search.service';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [availableFieldTypes, setAvailableFieldTypes] = useState<string[]>([]);
  const navigate = useNavigate();

  // États pour la recherche
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    centre: 'errachidia',
    fieldType: 'all',
    date: new Date().toISOString().split('T')[0]
  });

  // Charger les types de terrains disponibles
  useEffect(() => {
    const loadFieldTypes = async () => {
      try {
        const types = await getAvailableFieldTypes();
        setAvailableFieldTypes(types);
      } catch (error) {
        console.error('Erreur lors du chargement des types de terrains:', error);
      }
    };

    loadFieldTypes();
  }, []);

  // Obtenir le label pour le type de terrain
  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case "foot5": return "Football à 5";
      case "foot7": return "Football à 7";
      default: return type;
    }
  };

  // Gérer la recherche
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      console.log('Recherche avec filtres:', searchFilters);

      // Effectuer la recherche via Firebase
      const results = await searchAvailableFields(searchFilters);

      if (results.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun terrain disponible pour ces critères. Essayez une autre date.",
          variant: "destructive",
        });
        return;
      }

      // Naviguer vers la page de réservation avec les paramètres
      const searchParams = new URLSearchParams({
        centre: searchFilters.centre,
        terrain: searchFilters.fieldType,
        date: searchFilters.date
      });

      navigate(`/reservation?${searchParams.toString()}`);

    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

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
    };

    return (
        <button
            className={`
          px-8 py-4 font-bold rounded-xl transition-all duration-300 
          transform hover:scale-105 active:scale-95 flex items-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${variants[variant]} ${className}
        `}
            {...props}
        >
          {children}
        </button>
    );
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="Terrain de football"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0033A1]/80 via-[#001a5c]/60 to-[#0033A1]/80"></div>
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
                    Réserve ton terrain.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC00] to-[#FFD700] animate-pulse">
                    Joue comme un pro.
                  </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-blue-100 mb-12 font-medium">
                    L'académie de football moderne qui révolutionne l'entraînement à Errachidia
                  </p>
                </div>

                {/* Barre de recherche */}
                <PremiumCard className="p-8 mb-12 bg-white/95 backdrop-blur-md animate-in slide-in-from-bottom duration-1000 delay-300">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    {/* Centre (fixé à Errachidia) */}
                    <div>
                      <label className="block text-sm font-bold text-[#0033A1] mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Centre
                      </label>
                      <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium">
                        Errachidia
                      </div>
                    </div>

                    {/* Type de terrain */}
                    <div>
                      <label className="block text-sm font-bold text-[#0033A1] mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Type de terrain
                      </label>
                      <select
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0033A1] transition-colors bg-white"
                          value={searchFilters.fieldType}
                          onChange={(e) => setSearchFilters(prev => ({ ...prev, fieldType: e.target.value }))}
                      >
                        <option value="all">Tous les types</option>
                        {availableFieldTypes.map(type => (
                            <option key={type} value={type}>
                              {getFieldTypeLabel(type)}
                            </option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-bold text-[#0033A1] mb-3">
                        Date
                      </label>
                      <input
                          type="date"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0033A1] transition-colors bg-white"
                          value={searchFilters.date}
                          onChange={(e) => setSearchFilters(prev => ({ ...prev, date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Bouton de recherche */}
                    <GradientButton
                        className="h-14 justify-center"
                        onClick={handleSearch}
                        disabled={isSearching}
                    >
                      {isSearching ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                          <Search className="w-5 h-5" />
                      )}
                      {isSearching ? "Recherche..." : "Rechercher"}
                    </GradientButton>
                  </div>
                </PremiumCard>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in slide-in-from-bottom duration-1000 delay-500">
                  <GradientButton variant="secondary" className="text-lg px-12 py-6">
                    <Play className="w-6 h-6" />
                    Réserver maintenant
                  </GradientButton>
                  <GradientButton
                      variant="primary"
                      className="text-lg px-12 py-6 bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#0033A1]"
                      onClick={() => navigate('/abonnements')}
                  >
                    Découvrir les abonnements
                    <ChevronRight className="w-6 h-6" />
                  </GradientButton>
                </div>
              </div>
            </div>
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
                { value: "500+", label: "Joueurs actifs", icon: "👥" },
                { value: "6", label: "Terrains premium", icon: "⚽" },
                { value: "24/7", label: "Ouvert tous les jours", icon: "🕒" },
                { value: "98%", label: "Satisfaction client", icon: "⭐" }
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
                Pourquoi choisir Regragui Football ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                Une expérience premium avec des installations de classe mondiale à Errachidia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Terrains Premium",
                  desc: "Gazon synthétique dernière génération, éclairage LED professionnel",
                  icon: "⚽",
                  gradient: "from-blue-500 to-blue-700"
                },
                {
                  title: "Coaching Pro",
                  desc: "Entraîneurs diplômés et méthodes d'entraînement modernes",
                  icon: "🏆",
                  gradient: "from-yellow-500 to-yellow-600"
                },
                {
                  title: "Réservation Facile",
                  desc: "Système de réservation en ligne simple et rapide",
                  icon: "📱",
                  gradient: "from-green-500 to-green-600"
                }
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
      </div>
  );
};

export default Index;