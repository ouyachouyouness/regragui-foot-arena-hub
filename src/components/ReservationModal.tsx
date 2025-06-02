import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { getISOWeek } from "date-fns";
import { 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  User, 
  Calendar,
  Trophy,
  Zap,
  CheckCircle,
  CreditCard,
  Star,
  Timer,
  Target,
  Loader2
} from "lucide-react";

interface Field {
  id: string;
  name: string;
  type: string;
  centre: string;
  image: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field | null;
  timeSlot: TimeSlot | null;
  date: string;
}

const ReservationModal = ({ isOpen, onClose, field, timeSlot, date }: ReservationModalProps) => {
  const [playerCount, setPlayerCount] = useState("10");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  const getWeekString = (dateStr: string): string => {
    const date = new Date(dateStr);
    const week = getISOWeek(date);
    const year = date.getFullYear();
    return `${year}-W${week.toString().padStart(2, '0')}`;
  };

  const getDayKey = (dateStr: string): string => {
    const dayNum = new Date(dateStr).getDay();
    return ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][dayNum];
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!contactName.trim()) newErrors.contactName = "Le nom est requis";
    if (!contactPhone.trim()) newErrors.contactPhone = "Le téléphone est requis";
    if (!playerCount || parseInt(playerCount) < 2) newErrors.playerCount = "Minimum 2 joueurs";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    if (!field || !timeSlot) return;

    try {
      // 1. Enregistrer la réservation
      const reservationData = {
        fieldId: field.id,
        fieldName: field.name,
        fieldType: field.type,
        centre: field.centre,
        date,
        time: timeSlot.time,
        price: timeSlot.price,
        playerCount: parseInt(playerCount),
        contactName,
        contactPhone,
        notes,
        status: "en attente",
        createdAt: new Date().toISOString(),
        userEmail: user?.email || "demo@raftelsystem.com"
      };

      const docRef = await addDoc(collection(firestore, "reservations"), reservationData);
      const reservationId = docRef.id;

      // 2. Modifier le créneau dans weeklySlots
      const week = getWeekString(date);
      const dayKey = getDayKey(date);
      const weeklySlotDocId = `${field.id}_${week}`;
      const weeklySlotRef = doc(firestore, "weeklySlots", weeklySlotDocId);
      const weeklySlotSnap = await getDoc(weeklySlotRef);

      if (weeklySlotSnap.exists()) {
        const weeklyData = weeklySlotSnap.data();
        const slots = weeklyData.slots || {};
        const daySlots = slots[dayKey] || [];

        const updatedDaySlots = daySlots.map((slot: any) =>
            slot.time === timeSlot.time
                ? { ...slot, available: false, reservationId }
                : slot
        );

        await updateDoc(weeklySlotRef, {
          [`slots.${dayKey}`]: updatedDaySlots
        });
      }

      setIsSubmitting(false);
      setShowConfirmation(true);

    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la réservation. Réessayez.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onClose();
    
    // Reset form
    setPlayerCount("10");
    setContactName("");
    setContactPhone("");
    setNotes("");
    setErrors({});
  };

  const getCentreLabel = (centre: string) => {
    switch (centre) {
      case "casablanca-centre": return "Casablanca Centre";
      case "casablanca-maarif": return "Casablanca Maârif";
      case "rabat-agdal": return "Rabat Agdal";
      case "marrakech-gueliz": return "Marrakech Guéliz";
      case "errachidia": return "Errachidia";
      default: return centre;
    }
  };

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case "foot5": return "Football à 5";
      case "foot7": return "Football à 7";
      case "foot11": return "Football à 11";
      default: return type;
    }
  };

  const depositAmount = timeSlot ? Math.round(timeSlot.price * 0.25) : 0;

  if (!field || !timeSlot) return null;

  return (
    <>
      {/* Main Reservation Modal */}
      <Dialog open={isOpen && !showConfirmation} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-br from-[#0033A1] via-[#001a5c] to-[#0033A1] border-none">
          {/* Header with Football Theme */}
          <div className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 gap-2 transform rotate-12 scale-150">
                {Array.from({length: 32}).map((_, i) => (
                  <div key={i} className="text-2xl text-white animate-pulse">⚽</div>
                ))}
              </div>
            </div>
            
            {/* Stadium Lights Effect */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"></div>
            
            <DialogHeader className="relative z-10 p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-[#0033A1]" />
                </div>
                <DialogTitle className="text-3xl font-black text-white">
                  Confirmer la réservation
                </DialogTitle>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-[#FFCC00] text-[#0033A1] px-4 py-2 text-sm font-bold">
                  {getFieldTypeLabel(field.type)}
                </Badge>
                <Badge variant="outline" className="border-white text-white px-4 py-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {getCentreLabel(field.centre)}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <div className="px-6 pb-8 space-y-6">
            {/* Match Card Summary */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={field.image} 
                    alt={field.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#0033A1] flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {field.name}
                  </h3>
                  <p className="text-[#0033A1]/70 flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-[#FFCC00] text-[#FFCC00]" />
                    Terrain premium avec éclairage LED
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                  <Calendar className="w-6 h-6 text-[#0033A1] mx-auto mb-2" />
                  <p className="text-xs text-[#0033A1]/70 font-medium">DATE</p>
                  <p className="font-bold text-[#0033A1]">
                    {new Date(date).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-green-600 font-medium">HEURE</p>
                  <p className="font-bold text-green-900">{timeSlot.time}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <Timer className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-purple-600 font-medium">DURÉE</p>
                  <p className="font-bold text-purple-900">1h30</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <CreditCard className="w-6 h-6 text-[#FFCC00] mx-auto mb-2" />
                  <p className="text-xs text-yellow-600 font-medium">PRIX</p>
                  <p className="font-bold text-yellow-900">{timeSlot.price} DH</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Informations de réservation
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="playerCount" className="text-white font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Nombre de joueurs
                    </Label>
                    <Input
                      id="playerCount"
                      type="number"
                      min="2"
                      max="22"
                      value={playerCount}
                      onChange={(e) => setPlayerCount(e.target.value)}
                      className={`bg-white/90 border-2 ${errors.playerCount ? 'border-red-400' : 'border-white/50'} focus:border-[#FFCC00] h-12`}
                      required
                    />
                    {errors.playerCount && <p className="text-red-300 text-sm mt-1">{errors.playerCount}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contactName" className="text-white font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nom du responsable
                    </Label>
                    <Input
                      id="contactName"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className={`bg-white/90 border-2 ${errors.contactName ? 'border-red-400' : 'border-white/50'} focus:border-[#FFCC00] h-12`}
                      placeholder={user?.name || "Votre nom complet"}
                      required
                    />
                    {errors.contactName && <p className="text-red-300 text-sm mt-1">{errors.contactName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactPhone" className="text-white font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className={`bg-white/90 border-2 ${errors.contactPhone ? 'border-red-400' : 'border-white/50'} focus:border-[#FFCC00] h-12`}
                    placeholder={user?.phone || "+212 6 XX XX XX XX"}
                    required
                  />
                  {errors.contactPhone && <p className="text-red-300 text-sm mt-1">{errors.contactPhone}</p>}
                </div>

                <div>
                  <Label htmlFor="notes" className="text-white font-medium">
                    Notes (optionnel)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-white/90 border-2 border-white/50 focus:border-[#FFCC00]"
                    placeholder="Informations supplémentaires, demandes spéciales..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-[#FFCC00] to-[#FFD700] rounded-2xl p-6 text-[#0033A1] shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    <span className="font-bold text-lg">Acompte à régler maintenant:</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black">{depositAmount} DH</div>
                    <div className="text-sm opacity-75">25% du total ({timeSlot.price} DH)</div>
                  </div>
                </div>
                <div className="bg-[#0033A1]/10 rounded-xl p-3 text-sm">
                  💰 Le reste ({timeSlot.price - depositAmount} DH) sera réglé sur place le jour du match
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 pb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 h-12 border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0033A1] font-bold"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting} 
                  className="flex-1 h-12 bg-gradient-to-r from-[#FFCC00] to-[#FFD700] hover:from-[#e6b800] hover:to-[#e6b800] text-[#0033A1] font-bold text-base shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Confirmation...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Confirmer
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Success Modal */}
      <Dialog open={showConfirmation} onOpenChange={handleConfirmationClose}>
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 border-none p-0 overflow-hidden">
          {/* Celebration Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl animate-pulse">
              🏆
            </div>
          </div>

          {/* Confetti Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({length: 20}).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${Math.random() * 20 + 10}px`
                }}
              >
                {['⚽', '🏆', '🥅', '👕'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>

          <div className="relative z-10 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h2 className="text-3xl font-black mb-4">
              🎉 Réservation enregistrée !
            </h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 space-y-4">
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span>Votre demande a bien été transmise à l'administration</span>
              </div>
              
              <div className="flex items-center gap-3 text-lg">
                <Timer className="w-6 h-6 text-yellow-300" />
                <span>Elle est en attente de validation</span>
              </div>
              
              <div className="bg-yellow-400 text-green-900 rounded-xl p-4 font-bold">
                <div className="flex items-center gap-2 justify-center text-xl">
                  <CreditCard className="w-6 h-6" />
                  Acompte à régler: {depositAmount} DH
                </div>
                <div className="text-sm mt-2 opacity-80">
                  Merci de passer à l'accueil pour confirmer votre réservation
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleConfirmationClose}
                className="w-full h-14 bg-white text-green-600 hover:bg-gray-100 font-bold text-lg shadow-2xl"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Parfait, c'est noté !
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleConfirmationClose}
                className="w-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-green-600 font-medium"
              >
                Voir mes réservations
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservationModal;