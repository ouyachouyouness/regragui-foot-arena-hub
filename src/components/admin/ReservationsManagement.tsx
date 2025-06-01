import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
    Eye,
    XCircle,
    RefreshCw,
    Filter,
    Calendar,
    MapPin,
    Clock,
    User,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Settings
} from 'lucide-react';

// Types
interface Reservation {
    id: string;
    fieldName: string;
    fieldId: string;
    date: string;
    time: string;
    price: number;
    status: 'confirmée' | 'en attente' | 'annulée';
    userName: string;
    userEmail: string;
    userPhone?: string;
    createdAt: string;
    notes?: string;
}

const ReservationsManagement = () => {
    // Mock data - données de démonstration
    const mockReservations: Reservation[] = [
        {
            id: "R001",
            fieldName: "Terrain Alpha Premium",
            fieldId: "1",
            date: "2024-12-15",
            time: "18:00",
            price: 300,
            status: "confirmée",
            userName: "Ahmed Benali",
            userEmail: "ahmed.benali@email.com",
            userPhone: "+212 6 12 34 56 78",
            createdAt: "2024-12-10T14:30:00Z",
            notes: "Match d'entreprise"
        },
        {
            id: "R002",
            fieldName: "Terrain Beta Elite",
            fieldId: "2",
            date: "2024-12-16",
            time: "20:00",
            price: 350,
            status: "en attente",
            userName: "Fatima Zahra",
            userEmail: "fatima.zahra@email.com",
            userPhone: "+212 6 87 65 43 21",
            createdAt: "2024-12-11T09:15:00Z"
        },
        {
            id: "R003",
            fieldName: "Terrain Gamma Pro",
            fieldId: "3",
            date: "2024-12-14",
            time: "16:00",
            price: 400,
            status: "annulée",
            userName: "Omar Alami",
            userEmail: "omar.alami@email.com",
            createdAt: "2024-12-09T16:45:00Z",
            notes: "Annulé par le client"
        },
        {
            id: "R004",
            fieldName: "Terrain Alpha Premium",
            fieldId: "1",
            date: "2024-12-17",
            time: "14:00",
            price: 250,
            status: "confirmée",
            userName: "Youssef Tazi",
            userEmail: "youssef.tazi@email.com",
            userPhone: "+212 6 11 22 33 44",
            createdAt: "2024-12-12T11:20:00Z"
        },
        {
            id: "R005",
            fieldName: "Terrain Beta Elite",
            fieldId: "2",
            date: "2024-12-18",
            time: "10:00",
            price: 200,
            status: "en attente",
            userName: "Aicha Bennani",
            userEmail: "aicha.bennani@email.com",
            createdAt: "2024-12-13T08:30:00Z",
            notes: "Première réservation"
        },
        {
            id: "R006",
            fieldName: "Terrain Gamma Pro",
            fieldId: "3",
            date: "2024-12-19",
            time: "22:00",
            price: 450,
            status: "confirmée",
            userName: "Karim Senhaji",
            userEmail: "karim.senhaji@email.com",
            userPhone: "+212 6 99 88 77 66",
            createdAt: "2024-12-13T15:45:00Z",
            notes: "Match nocturne"
        },
        {
            id: "R007",
            fieldName: "Terrain Alpha Premium",
            fieldId: "1",
            date: "2024-12-20",
            time: "12:00",
            price: 250,
            status: "en attente",
            userName: "Laila Chraibi",
            userEmail: "laila.chraibi@email.com",
            createdAt: "2024-12-14T10:15:00Z"
        }
    ];

    // State
    const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedField, setSelectedField] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    // Filtrage (pour l'instant ne fait rien, juste pour la démo)
    const filteredReservations = reservations;

    // Actions simulées
    const handleViewDetails = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setIsDetailsModalOpen(true);
    };

    const handleCancelReservation = (reservationId: string) => {
        setReservations(prev =>
            prev.map(res =>
                res.id === reservationId
                    ? { ...res, status: 'annulée' as const }
                    : res
            )
        );
        toast({
            title: "Réservation annulée",
            description: `La réservation ${reservationId} a été annulée (mode démo)`,
        });
    };

    const handleChangeStatus = (reservationId: string, newStatus: 'confirmée' | 'en attente' | 'annulée') => {
        setReservations(prev =>
            prev.map(res =>
                res.id === reservationId
                    ? { ...res, status: newStatus }
                    : res
            )
        );
        toast({
            title: "Statut modifié",
            description: `Réservation ${reservationId} maintenant ${newStatus} (mode démo)`,
        });
    };

    // Utilitaires pour l'affichage
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmée':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmée
                    </Badge>
                );
            case 'en attente':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        En attente
                    </Badge>
                );
            case 'annulée':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-300">
                        <XCircle className="w-3 h-3 mr-1" />
                        Annulée
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleString('fr-FR');
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
            danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl",
            success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
        };

        return (
            <button
                className={`
                    inline-flex items-center justify-center gap-2 px-4 py-2 font-bold rounded-lg transition-all duration-300 
                    transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm
                    ${variants[variant]} ${className}
                `}
                {...props}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#0033A1] mb-2">
                        📅 Gestion des réservations
                    </h2>
                    <p className="text-gray-600">
                        {filteredReservations.length} réservation{filteredReservations.length !== 1 ? 's' : ''} trouvée{filteredReservations.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <GradientButton>
                    <RefreshCw className="w-4 h-4" />
                    Actualiser
                </GradientButton>
            </div>

            {/* Filtres */}
            <PremiumCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-[#0033A1]" />
                    <h3 className="text-lg font-bold text-[#0033A1]">Filtres</h3>
                    <Badge variant="outline" className="text-xs">Mode démo</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MapPin className="w-4 h-4" />
                            Terrain
                        </label>
                        <Select value={selectedField} onValueChange={setSelectedField}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les terrains" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les terrains</SelectItem>
                                <SelectItem value="1">Terrain Alpha Premium</SelectItem>
                                <SelectItem value="2">Terrain Beta Elite</SelectItem>
                                <SelectItem value="3">Terrain Gamma Pro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CheckCircle className="w-4 h-4" />
                            Statut
                        </label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="confirmée">Confirmée</SelectItem>
                                <SelectItem value="en attente">En attente</SelectItem>
                                <SelectItem value="annulée">Annulée</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Calendar className="w-4 h-4" />
                            Date
                        </label>
                        <Select disabled>
                            <SelectTrigger>
                                <SelectValue placeholder="Toutes les dates" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les dates</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </PremiumCard>

            {/* Tableau des réservations */}
            <PremiumCard>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0033A1]">
                        <Calendar className="w-5 h-5" />
                        Liste des réservations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-bold text-gray-900">ID</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-900">Terrain</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-900">Date</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-900">Heure</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-900">Prix</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-900">Statut</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-900">Utilisateur</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredReservations.map((reservation) => (
                                <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <span className="font-mono text-sm">{reservation.id}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium">{reservation.fieldName}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-[#0033A1]" />
                                            {formatDate(reservation.date)}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[#0033A1]" />
                                            {reservation.time}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 font-bold text-[#0033A1]">
                                            <DollarSign className="w-4 h-4" />
                                            {reservation.price} DH
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        {getStatusBadge(reservation.status)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <div className="font-medium">{reservation.userName}</div>
                                            <div className="text-sm text-gray-500">{reservation.userEmail}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 justify-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleViewDetails(reservation)}
                                                className="h-8 px-3"
                                            >
                                                <Eye className="w-3 h-3" />
                                            </Button>

                                            <Select onValueChange={(value) => handleChangeStatus(reservation.id, value as any)}>
                                                <SelectTrigger className="h-8 w-24">
                                                    <Settings className="w-3 h-3" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="confirmée">Confirmer</SelectItem>
                                                    <SelectItem value="en attente">En attente</SelectItem>
                                                    <SelectItem value="annulée">Annuler</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {reservation.status !== 'annulée' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCancelReservation(reservation.id)}
                                                    className="h-8 px-3 border-red-300 text-red-600 hover:bg-red-50"
                                                >
                                                    <XCircle className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </PremiumCard>

            {/* Modal de détails */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-[#0033A1]" />
                            Détails de la réservation {selectedReservation?.id}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedReservation && (
                        <div className="space-y-6">
                            {/* Statut et terrain */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Statut</label>
                                    <div>{getStatusBadge(selectedReservation.status)}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Terrain</label>
                                    <div className="font-medium">{selectedReservation.fieldName}</div>
                                </div>
                            </div>

                            {/* Date et heure */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Date</label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[#0033A1]" />
                                        {formatDate(selectedReservation.date)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Heure</label>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#0033A1]" />
                                        {selectedReservation.time}
                                    </div>
                                </div>
                            </div>

                            {/* Prix */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Prix</label>
                                <div className="flex items-center gap-2 text-2xl font-bold text-[#0033A1]">
                                    <DollarSign className="w-6 h-6" />
                                    {selectedReservation.price} DH
                                </div>
                            </div>

                            {/* Informations utilisateur */}
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#0033A1]" />
                                    Informations client
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Nom</label>
                                        <div className="font-medium">{selectedReservation.userName}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <div>{selectedReservation.userEmail}</div>
                                    </div>
                                    {selectedReservation.userPhone && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Téléphone</label>
                                            <div>{selectedReservation.userPhone}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Détails supplémentaires */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Date de création</label>
                                    <div className="text-sm text-gray-600">{formatDateTime(selectedReservation.createdAt)}</div>
                                </div>
                                {selectedReservation.notes && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Notes</label>
                                        <div className="p-3 bg-blue-50 rounded-lg text-sm">{selectedReservation.notes}</div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <GradientButton
                                    variant="success"
                                    className="flex-1"
                                    onClick={() => {
                                        handleChangeStatus(selectedReservation.id, 'confirmée');
                                        setIsDetailsModalOpen(false);
                                    }}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Confirmer
                                </GradientButton>
                                <GradientButton
                                    variant="danger"
                                    className="flex-1"
                                    onClick={() => {
                                        handleCancelReservation(selectedReservation.id);
                                        setIsDetailsModalOpen(false);
                                    }}
                                >
                                    <XCircle className="w-4 h-4" />
                                    Annuler
                                </GradientButton>
                            </div>

                            <div className="text-xs text-center text-gray-500 pt-2 border-t">
                                ⚠️ Mode démo - Les actions ne modifient pas la base de données
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReservationsManagement;