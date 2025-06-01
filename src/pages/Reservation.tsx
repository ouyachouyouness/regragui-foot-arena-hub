import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReservationModal from "@/components/ReservationModal";
import { toast } from "@/hooks/use-toast";
import {
  MapPin,
  Calendar,
  Search,
  Star,
  Clock,
  Users,
  Zap,
  Trophy,
  RefreshCw,
  Loader2
} from 'lucide-react';
import {
  searchAvailableFields,
  getAvailableFieldTypes,
  type SearchFilters,
  type SearchResult,
  type Field,
  type TimeSlot
} from '@/firebase/search.service';
import HeroReservation from "@/components/HeroReservation.tsx";

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const selectedCentre = searchParams.get("centre") || "errachidia"; // default fallback
  const selectedTerrain = searchParams.get("terrain") || "all";
  const selectedDateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(selectedDateParam);
  const [selectedType, setSelectedType] = useState(selectedTerrain);


  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [availableFieldTypes, setAvailableFieldTypes] = useState<string[]>([]);

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

  // Effectuer la recherche initiale si des paramètres sont présents
  useEffect(() => {
    if (searchParams.get("date")) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const filters: SearchFilters = {
        centre: selectedCentre,
        fieldType: selectedType,
        date: selectedDate
      };

      const results = await searchAvailableFields(filters);
      setSearchResults(results);

      if (results.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun terrain disponible pour ces critères. Essayez une autre date.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleReservation = (field: Field, timeSlot: TimeSlot) => {
    setSelectedField(field);
    setSelectedTimeSlot(timeSlot);
    setIsReservationModalOpen(true);
  };

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case "foot5": return "Football à 5";
      case "foot7": return "Football à 7";
      default: return type;
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
          transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
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
        <HeroReservation
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            availableFieldTypes={availableFieldTypes}
            isLoading={isLoading}
            onSearch={handleSearch}
            getFieldTypeLabel={getFieldTypeLabel}
        />


        {/* Section des résultats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* En-tête des résultats */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-[#0033A1] mb-2">
                  {searchResults.length} terrain{searchResults.length !== 1 ? 's' : ''} disponible{searchResults.length !== 1 ? 's' : ''}
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
                    onClick={() => setSelectedType("all")}
                    className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Réinitialiser
                </Button>
              </div>
            </div>

            {/* État de chargement */}
            {isLoading ? (
                <div className="text-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-[#0033A1] mx-auto mb-4" />
                  <p className="text-lg text-gray-600">Recherche des créneaux disponibles...</p>
                </div>
            ) : (
                <>
                  {/* Résultats */}
                  {searchResults.length === 0 ? (
                      <PremiumCard className="text-center py-20">
                        <div className="text-6xl mb-6">⚽</div>
                        <h3 className="text-2xl font-bold text-[#0033A1] mb-4">
                          Aucun terrain trouvé
                        </h3>
                        <p className="text-gray-600 mb-8">
                          Essayez de modifier vos critères de recherche ou choisissez une autre date
                        </p>
                        <GradientButton onClick={() => setSelectedType("all")}>
                          Réinitialiser les filtres
                        </GradientButton>
                      </PremiumCard>
                  ) : (
                      <div className="space-y-8">
                        {searchResults.map((result, index) => (
                            <PremiumCard key={result.field.id} className="overflow-hidden animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                              <div className="lg:flex">
                                {/* Image du terrain */}
                                <div className="lg:w-2/5 relative">
                                  <img
                                      src={result.field.image}
                                      alt={result.field.name}
                                      className="w-full h-64 lg:h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                      }}
                                  />
                                  <div className="absolute top-4 left-4">
                                    <Badge className="bg-[#0033A1] text-white">
                                      À partir de {getMinPrice(result.timeSlots)} DH
                                    </Badge>
                                  </div>
                                  {result.field.rating && (
                                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-[#0033A1]">{result.field.rating}</span>
                                      </div>
                                  )}
                                </div>

                                {/* Détails du terrain */}
                                <div className="lg:w-3/5 p-8">
                                  <CardHeader className="p-0 mb-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                      <CardTitle className="text-3xl font-bold text-[#0033A1] mb-2 md:mb-0">
                                        {result.field.name}
                                      </CardTitle>
                                      <div className="flex gap-2">
                                        <Badge variant="secondary" className="bg-[#FFCC00] text-[#0033A1]">
                                          {getFieldTypeLabel(result.field.type)}
                                        </Badge>
                                        <Badge variant="outline" className="border-[#0033A1] text-[#0033A1]">
                                          <MapPin className="w-3 h-3 mr-1" />
                                          Errachidia
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Équipements */}
                                    {result.field.features && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                          {result.field.features.map((feature, i) => (
                                              <span key={i} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                                    {feature}
                                  </span>
                                          ))}
                                        </div>
                                    )}

                                    <CardDescription className="text-base text-gray-600">
                                      Terrain moderne avec gazon synthétique, éclairage LED professionnel
                                    </CardDescription>
                                  </CardHeader>

                                  <CardContent className="p-0">
                                    <div className="flex items-center gap-2 mb-4">
                                      <Clock className="w-5 h-5 text-[#0033A1]" />
                                      <h4 className="font-bold text-lg text-[#0033A1]">
                                        Créneaux disponibles - {selectedDate}
                                      </h4>
                                    </div>

                                    {/* Créneaux horaires */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
                                      {result.timeSlots.map((slot) => (
                                          <div key={slot.id} className="relative">
                                            <GradientButton
                                                variant={slot.available ? "outline" : "secondary"}
                                                disabled={!slot.available}
                                                onClick={() => slot.available && handleReservation(result.field, slot)}
                                                className={`w-full h-auto p-4 flex-col ${
                                                    slot.available
                                                        ? "hover:shadow-lg hover:scale-105 border-gray-200 hover:border-[#0033A1]"
                                                        : "opacity-50 cursor-not-allowed"
                                                }`}
                                            >
                                              <div className="text-lg font-bold mb-1">{slot.time}</div>
                                              <div className="text-sm font-semibold text-[#0033A1]">{slot.price} DH</div>
                                              {!slot.available && (
                                                  <div className="text-xs text-red-500 font-bold mt-1">Réservé</div>
                                              )}
                                            </GradientButton>
                                          </div>
                                      ))}
                                    </div>

                                    {/* Actions rapides */}
                                    <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-100">
                                      <GradientButton
                                          variant="primary"
                                          className="flex-1"
                                          onClick={() => {
                                            const firstAvailable = result.timeSlots.find(slot => slot.available);
                                            if (firstAvailable) handleReservation(result.field, firstAvailable);
                                          }}
                                          disabled={!result.timeSlots.some(slot => slot.available)}
                                      >
                                        <Zap className="w-5 h-5" />
                                        Réservation rapide
                                      </GradientButton>

                                      <Button
                                          variant="outline"
                                          className="flex-1 border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white"
                                      >
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