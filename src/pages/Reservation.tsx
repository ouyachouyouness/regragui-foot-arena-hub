import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReservationModal from "@/components/ReservationModal";
import { useTranslation } from "react-i18next";
import { 
  MapPin, 
  Calendar, 
  Search, 
  Filter,
  Star,
  Clock,
  Users,
  Zap,
  Trophy,
  RefreshCw,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
  popular?: boolean;
}

interface Field {
  id: string;
  name: string;
  type: string;
  centre: string;
  image: string;
  timeSlots: TimeSlot[];
  rating?: number;
  features?: string[];
}

const Reservation = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || new Date().toISOString().split('T')[0]
  );
  const [selectedCentre, setSelectedCentre] = useState(searchParams.get("centre") || "all");
  const [selectedType, setSelectedType] = useState(searchParams.get("terrain") || "all");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced mock data with more details
  const mockFields: Field[] = [
    {
      id: "1",
      name: "Terrain Alpha Premium",
      type: "foot5",
      centre: "casablanca-centre",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      features: ["Gazon synthétique premium", "Éclairage LED", "Vestiaires VIP", "Parking gratuit"],
      timeSlots: [
        { id: "1", time: "08:00", available: true, price: 200 },
        { id: "2", time: "10:00", available: false, price: 200 },
        { id: "3", time: "12:00", available: true, price: 250 },
        { id: "4", time: "14:00", available: true, price: 250 },
        { id: "5", time: "16:00", available: false, price: 300 },
        { id: "6", time: "18:00", available: true, price: 300, popular: true },
        { id: "7", time: "20:00", available: true, price: 350, popular: true },
        { id: "8", time: "22:00", available: true, price: 350 },
      ]
    },
    {
      id: "2",
      name: "Terrain Beta Elite",
      type: "foot5",
      centre: "casablanca-centre",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      features: ["Gazon synthétique", "Éclairage LED", "Vestiaires", "Snack-bar"],
      timeSlots: [
        { id: "9", time: "08:00", available: true, price: 200 },
        { id: "10", time: "10:00", available: true, price: 200 },
        { id: "11", time: "12:00", available: false, price: 250 },
        { id: "12", time: "14:00", available: true, price: 250 },
        { id: "13", time: "16:00", available: true, price: 300 },
        { id: "14", time: "18:00", available: false, price: 300 },
        { id: "15", time: "20:00", available: true, price: 350, popular: true },
        { id: "16", time: "22:00", available: true, price: 350 },
      ]
    },
    {
      id: "3",
      name: "Terrain Gamma Pro",
      type: "foot7",
      centre: "casablanca-maarif",
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      features: ["Terrain élargi", "Éclairage professionnel", "Vestiaires premium", "Zone spectateurs"],
      timeSlots: [
        { id: "17", time: "08:00", available: true, price: 300 },
        { id: "18", time: "10:00", available: true, price: 300 },
        { id: "19", time: "12:00", available: true, price: 350 },
        { id: "20", time: "14:00", available: false, price: 350 },
        { id: "21", time: "16:00", available: true, price: 400 },
        { id: "22", time: "18:00", available: true, price: 400, popular: true },
        { id: "23", time: "20:00", available: false, price: 450 },
        { id: "24", time: "22:00", available: true, price: 450 },
      ]
    }
  ];

  const filteredFields = mockFields.filter(field => {
    if (selectedCentre !== "all" && field.centre !== selectedCentre) return false;
    if (selectedType !== "all" && field.type !== selectedType) return false;
    return true;
  });

  const handleReservation = (field: Field, timeSlot: TimeSlot) => {
    setSelectedField(field);
    setSelectedTimeSlot(timeSlot);
    setIsReservationModalOpen(true);
  };

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case "foot5": return t("search.fieldTypes.foot5") || "Football à 5";
      case "foot7": return t("search.fieldTypes.foot7") || "Football à 7";
      case "foot11": return t("search.fieldTypes.foot11") || "Football à 11";
      default: return type;
    }
  };

  const getCentreLabel = (centre: string) => {
    switch (centre) {
      case "casablanca-centre": return t("search.centres.casablancaCentre") || "Casablanca Centre";
      case "casablanca-maarif": return t("search.centres.casablancaMaarif") || "Casablanca Maârif";
      case "rabat-agdal": return t("search.centres.rabatAgdal") || "Rabat Agdal";
      case "marrakech-gueliz": return t("search.centres.marrakechGueliz") || "Marrakech Guéliz";
      default: return centre;
    }
  };

  const getMinPrice = (timeSlots: TimeSlot[]) => {
    const availableSlots = timeSlots.filter(slot => slot.available);
    return availableSlots.length > 0 ? Math.min(...availableSlots.map(slot => slot.price)) : 0;
  };

  const PremiumCard = ({ children, className = "", hover = true }) => (
    <div className={`
      bg-white rounded-2xl border border-gray-100 shadow-lg 
      ${hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''} 
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
      outline: "border-2 border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white bg-white",
      success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
    };
    
    return (
      <button 
        className={`
          inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all duration-300 
          transform hover:scale-105 active:scale-95
          ${variants[variant]} ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0033A1] via-[#001a5c] to-[#0033A1] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 gap-8 transform rotate-12 scale-150">
            {Array.from({length: 24}).map((_, i) => (
              <div key={i} className="text-6xl animate-pulse">⚽</div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-in fade-in duration-1000">
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              {t("reservation.title") || "Réservation de terrains"}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-medium">
              {t("reservation.description") || "Trouvez et réservez le terrain parfait pour votre match"}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <PremiumCard className="p-8 max-w-6xl mx-auto bg-white/95 backdrop-blur-md animate-in slide-in-from-bottom duration-1000 delay-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#0033A1]">
                  <Calendar className="w-4 h-4" />
                  {t("search.date") || "Date"}
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="border-2 border-gray-200 focus:border-[#0033A1] rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#0033A1]">
                  <MapPin className="w-4 h-4" />
                  {t("search.centre") || "Centre"}
                </label>
                <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-[#0033A1] rounded-xl h-12">
                    <SelectValue placeholder={t("search.allCentres") || "Tous les centres"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.allCentres") || "Tous les centres"}</SelectItem>
                    <SelectItem value="casablanca-centre">Casablanca Centre</SelectItem>
                    <SelectItem value="casablanca-maarif">Casablanca Maârif</SelectItem>
                    <SelectItem value="rabat-agdal">Rabat Agdal</SelectItem>
                    <SelectItem value="marrakech-gueliz">Marrakech Guéliz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#0033A1]">
                  <Users className="w-4 h-4" />
                  {t("search.fieldType") || "Type de terrain"}
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-[#0033A1] rounded-xl h-12">
                    <SelectValue placeholder={t("search.allTypes") || "Tous les types"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.allTypes") || "Tous les types"}</SelectItem>
                    <SelectItem value="foot5">Football à 5</SelectItem>
                    <SelectItem value="foot7">Football à 7</SelectItem>
                    <SelectItem value="foot11">Football à 11</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <GradientButton onClick={handleSearch} className="h-12" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {t("search.search") || "Rechercher"}
              </GradientButton>
            </div>
          </PremiumCard>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#0033A1] mb-2">
                {filteredFields.length} terrains disponibles
              </h2>
              <p className="text-gray-600">
                Le {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCentre("all");
                  setSelectedType("all");
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Réinitialiser
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#0033A1] mx-auto mb-4" />
              <p className="text-lg text-gray-600">Recherche des créneaux disponibles...</p>
            </div>
          ) : (
            <>
              {/* Results */}
              {filteredFields.length === 0 ? (
                <PremiumCard className="text-center py-20">
                  <div className="text-6xl mb-6">⚽</div>
                  <h3 className="text-2xl font-bold text-[#0033A1] mb-4">
                    {t("reservation.noFieldsFound") || "Aucun terrain trouvé"}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <GradientButton onClick={() => {
                    setSelectedCentre("all");
                    setSelectedType("all");
                  }}>
                    {t("reservation.resetFilters") || "Réinitialiser les filtres"}
                  </GradientButton>
                </PremiumCard>
              ) : (
                <div className="space-y-8">
                  {filteredFields.map((field, index) => (
                    <PremiumCard key={field.id} className="overflow-hidden animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="lg:flex">
                        {/* Field Image */}
                        <div className="lg:w-2/5 relative">
                          <img
                            src={field.image}
                            alt={field.name}
                            className="w-full h-64 lg:h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-[#0033A1] text-white">
                              À partir de {getMinPrice(field.timeSlots)} DH
                            </Badge>
                          </div>
                          {field.rating && (
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold text-[#0033A1]">{field.rating}</span>
                            </div>
                          )}
                        </div>

                        {/* Field Details */}
                        <div className="lg:w-3/5 p-8">
                          <CardHeader className="p-0 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                              <CardTitle className="text-3xl font-bold text-[#0033A1] mb-2 md:mb-0">
                                {field.name}
                              </CardTitle>
                              <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-[#FFCC00] text-[#0033A1]">
                                  {getFieldTypeLabel(field.type)}
                                </Badge>
                                <Badge variant="outline" className="border-[#0033A1] text-[#0033A1]">
                                  {getCentreLabel(field.centre)}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Features */}
                            {field.features && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {field.features.map((feature, i) => (
                                  <span key={i} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <CardDescription className="text-base text-gray-600">
                              {t("reservation.modernField") || "Terrain moderne avec gazon synthétique, éclairage LED professionnel"}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="p-0">
                            <div className="flex items-center gap-2 mb-4">
                              <Clock className="w-5 h-5 text-[#0033A1]" />
                              <h4 className="font-bold text-lg text-[#0033A1]">
                                {t("reservation.availableSlots") || "Créneaux disponibles"} - {selectedDate}
                              </h4>
                            </div>
                            
                            {/* Time Slots */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
                              {field.timeSlots.map((slot) => (
                                <div key={slot.id} className="relative">
                                  <GradientButton
                                    variant={slot.available ? "outline" : "secondary"}
                                    disabled={!slot.available}
                                    onClick={() => slot.available && handleReservation(field, slot)}
                                    className={`w-full h-auto p-4 flex-col ${
                                      slot.available 
                                        ? "hover:shadow-lg hover:scale-105 border-gray-200 hover:border-[#0033A1]" 
                                        : "opacity-50 cursor-not-allowed"
                                    }`}
                                  >
                                    {slot.popular && slot.available && (
                                      <div className="absolute -top-2 -right-2">
                                        <div className="bg-red-500 text-white p-1 rounded-full text-xs">
                                          🔥
                                        </div>
                                      </div>
                                    )}
                                    <div className="text-lg font-bold mb-1">{slot.time}</div>
                                    <div className="text-sm font-semibold text-[#0033A1]">{slot.price} DH</div>
                                    {slot.popular && slot.available && (
                                      <div className="text-xs text-red-500 font-bold mt-1">🔥 Populaire</div>
                                    )}
                                  </GradientButton>
                                </div>
                              ))}
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-100">
                              <GradientButton 
                                variant="primary" 
                                className="flex-1"
                                onClick={() => {
                                  const firstAvailable = field.timeSlots.find(slot => slot.available);
                                  if (firstAvailable) handleReservation(field, firstAvailable);
                                }}
                              >
                                <Zap className="w-5 h-5" />
                                Réservation rapide
                              </GradientButton>
                              
                              <Button variant="outline" className="flex-1 border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white">
                                <Trophy className="w-5 h-5 mr-2" />
                                Voir les détails
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </PremiumCard>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        field={selectedField}
        timeSlot={selectedTimeSlot}
        date={selectedDate}
      />
    </div>
  );
};

export default Reservation;