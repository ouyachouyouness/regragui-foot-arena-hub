
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";
import ReservationModal from "@/components/ReservationModal";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

interface Field {
  id: string;
  name: string;
  type: string;
  centre: string;
  image: string;
  timeSlots: TimeSlot[];
}

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || new Date().toISOString().split('T')[0]
  );
  const [selectedCentre, setSelectedCentre] = useState(searchParams.get("centre") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("terrain") || "");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  // Mock data for fields
  const mockFields: Field[] = [
    {
      id: "1",
      name: "Terrain Alpha",
      type: "foot5",
      centre: "casablanca-centre",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeSlots: [
        { id: "1", time: "08:00", available: true, price: 200 },
        { id: "2", time: "10:00", available: false, price: 200 },
        { id: "3", time: "12:00", available: true, price: 250 },
        { id: "4", time: "14:00", available: true, price: 250 },
        { id: "5", time: "16:00", available: false, price: 300 },
        { id: "6", time: "18:00", available: true, price: 300 },
        { id: "7", time: "20:00", available: true, price: 350 },
        { id: "8", time: "22:00", available: true, price: 350 },
      ]
    },
    {
      id: "2",
      name: "Terrain Beta",
      type: "foot5",
      centre: "casablanca-centre",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeSlots: [
        { id: "9", time: "08:00", available: true, price: 200 },
        { id: "10", time: "10:00", available: true, price: 200 },
        { id: "11", time: "12:00", available: false, price: 250 },
        { id: "12", time: "14:00", available: true, price: 250 },
        { id: "13", time: "16:00", available: true, price: 300 },
        { id: "14", time: "18:00", available: false, price: 300 },
        { id: "15", time: "20:00", available: true, price: 350 },
        { id: "16", time: "22:00", available: true, price: 350 },
      ]
    },
    {
      id: "3",
      name: "Terrain Gamma",
      type: "foot7",
      centre: "casablanca-maarif",
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeSlots: [
        { id: "17", time: "08:00", available: true, price: 300 },
        { id: "18", time: "10:00", available: true, price: 300 },
        { id: "19", time: "12:00", available: true, price: 350 },
        { id: "20", time: "14:00", available: false, price: 350 },
        { id: "21", time: "16:00", available: true, price: 400 },
        { id: "22", time: "18:00", available: true, price: 400 },
        { id: "23", time: "20:00", available: false, price: 450 },
        { id: "24", time: "22:00", available: true, price: 450 },
      ]
    }
  ];

  const filteredFields = mockFields.filter(field => {
    if (selectedCentre && field.centre !== selectedCentre) return false;
    if (selectedType && field.type !== selectedType) return false;
    return true;
  });

  const handleReservation = (field: Field, timeSlot: TimeSlot) => {
    setSelectedField(field);
    setSelectedTimeSlot(timeSlot);
    setIsReservationModalOpen(true);
  };

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case "foot5": return "Football à 5";
      case "foot7": return "Football à 7";
      case "foot11": return "Football à 11";
      default: return type;
    }
  };

  const getCentreLabel = (centre: string) => {
    switch (centre) {
      case "casablanca-centre": return "Casablanca Centre";
      case "casablanca-maarif": return "Casablanca Maârif";
      case "rabat-agdal": return "Rabat Agdal";
      case "marrakech-gueliz": return "Marrakech Guéliz";
      default: return centre;
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Réservation de terrains</h1>
          <p className="text-xl text-gray-600">Trouvez et réservez le terrain parfait pour votre match</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-lg shadow">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Centre</label>
            <Select value={selectedCentre} onValueChange={setSelectedCentre}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les centres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les centres</SelectItem>
                <SelectItem value="casablanca-centre">Casablanca Centre</SelectItem>
                <SelectItem value="casablanca-maarif">Casablanca Maârif</SelectItem>
                <SelectItem value="rabat-agdal">Rabat Agdal</SelectItem>
                <SelectItem value="marrakech-gueliz">Marrakech Guéliz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de terrain</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les types</SelectItem>
                <SelectItem value="foot5">Football à 5</SelectItem>
                <SelectItem value="foot7">Football à 7</SelectItem>
                <SelectItem value="foot11">Football à 11</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredFields.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">Aucun terrain trouvé pour vos critères</p>
              <Button onClick={() => {
                setSelectedCentre("");
                setSelectedType("");
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            filteredFields.map((field) => (
              <Card key={field.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={field.image}
                      alt={field.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-2xl">{field.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{getFieldTypeLabel(field.type)}</Badge>
                          <Badge variant="outline">{getCentreLabel(field.centre)}</Badge>
                        </div>
                      </div>
                      <CardDescription>
                        Terrain moderne avec gazon synthétique, éclairage LED professionnel
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <h4 className="font-semibold mb-3">Créneaux disponibles - {selectedDate}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {field.timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={slot.available ? "outline" : "secondary"}
                            disabled={!slot.available}
                            onClick={() => slot.available && handleReservation(field, slot)}
                            className={`p-3 h-auto ${
                              slot.available 
                                ? "hover:bg-green-50 hover:border-green-500 hover:text-green-700" 
                                : "opacity-50"
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-semibold">{slot.time}</div>
                              <div className="text-sm">{slot.price} DH</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

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
