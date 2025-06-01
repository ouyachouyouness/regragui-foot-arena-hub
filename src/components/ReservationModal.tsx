import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        userEmail: "demo@raftelsystem.com"
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

      toast({
        title: "Réservation enregistrée !",
        description: `Votre demande a été envoyée et est en attente de confirmation.`,
      });

      onClose();
      setPlayerCount("10");
      setContactName("");
      setContactPhone("");
      setNotes("");
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la réservation. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!field || !timeSlot) return null;

  const getCentreLabel = (centre: string) => {
    switch (centre) {
      case "casablanca-centre": return "Casablanca Centre";
      case "casablanca-maarif": return "Casablanca Maârif";
      case "rabat-agdal": return "Rabat Agdal";
      case "marrakech-gueliz": return "Marrakech Guéliz";
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

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmer la réservation</DialogTitle>
          </DialogHeader>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Détails de la réservation</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Terrain:</span> {field.name}</p>
              <p><span className="font-medium">Type:</span> {getFieldTypeLabel(field.type)}</p>
              <p><span className="font-medium">Centre:</span> {getCentreLabel(field.centre)}</p>
              <p><span className="font-medium">Date:</span> {new Date(date).toLocaleDateString('fr-FR')}</p>
              <p><span className="font-medium">Heure:</span> {timeSlot.time}</p>
              <p><span className="font-medium">Prix:</span> {timeSlot.price} DH</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="playerCount">Nombre de joueurs prévus</Label>
              <Input
                  id="playerCount"
                  type="number"
                  min="2"
                  max="22"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(e.target.value)}
                  required
              />
            </div>

            <div>
              <Label htmlFor="contactName">Nom du responsable</Label>
              <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={user?.name || "Votre nom complet"}
                  required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Téléphone</Label>
              <Input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder={user?.phone || "+212 6 XX XX XX XX"}
                  required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informations supplémentaires..."
                  rows={3}
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total à payer:</span>
                <span className="text-2xl font-bold text-green-600">{timeSlot.price} DH</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Confirmation..." : "Confirmer la réservation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};

export default ReservationModal;
