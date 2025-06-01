// src/components/admin/ReservationsManagement.tsx
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    DollarSign,
    User,
    Eye,
    Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedForCancel, setSelectedForCancel] = useState<Reservation | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<Reservation | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const snapshot = await getDocs(collection(firestore, 'reservations'));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Reservation[];
                setReservations(data);
            } catch (error) {
                console.error('Erreur chargement réservations:', error);
                toast({
                    title: 'Erreur',
                    description: 'Impossible de charger les réservations.',
                    variant: 'destructive'
                });
            }
        };
        fetchReservations();
    }, []);

    const handleStatusChange = async (id: string, newStatus: Reservation['status']) => {
        try {
            await updateDoc(doc(firestore, 'reservations', id), { status: newStatus });
            setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            toast({ title: 'Statut mis à jour', description: `Réservation ${id.slice(0,5)} -> ${newStatus}` });
        } catch (err) {
            console.error(err);
            toast({ title: 'Erreur', description: "Échec de la mise à jour du statut.", variant: 'destructive' });
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-[#0033A1]">Réservations</h1>
            {reservations.length === 0 ? (
                <p className="text-gray-600">Aucune réservation trouvée.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border text-sm bg-white rounded shadow overflow-hidden">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Terrain</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Heure</th>
                            <th className="p-3">Prix</th>
                            <th className="p-3">Statut</th>
                            <th className="p-3">Utilisateur</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reservations.map((res) => (
                            <tr key={res.id} className="border-t hover:bg-gray-50">
                                <td className="p-3 font-mono text-xs">{res.id.slice(0, 5)}</td>
                                <td className="p-3 font-medium">{res.fieldName}</td>
                                <td className="p-3"><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(res.date)}</div></td>
                                <td className="p-3"><div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {res.time}</div></td>
                                <td className="p-3"><div className="flex items-center gap-2 text-[#0033A1] font-bold"><DollarSign className="w-4 h-4" /> {res.price} DH</div></td>
                                <td className="p-3">
                                    {res.status === 'confirmée' && (
                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Confirmée
                                        </Badge>
                                    )}
                                    {res.status === 'en attente' && (
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                            <AlertCircle className="w-3 h-3 mr-1" /> En attente
                                        </Badge>
                                    )}
                                    {res.status === 'annulée' && (
                                        <Badge className="bg-red-100 text-red-800 border-red-300">
                                            <XCircle className="w-3 h-3 mr-1" /> Annulée
                                        </Badge>
                                    )}
                                </td>
                                <td className="p-3">
                                    <div className="font-semibold">{res.userName}</div>
                                    <div className="text-gray-500 text-xs">{res.userEmail}</div>
                                </td>
                                <td className="p-3 text-center">
                                    <div className="inline-flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedDetails(res)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Select value={res.status} onValueChange={(value) => value === 'annulée' ? setSelectedForCancel(res) : handleStatusChange(res.id, value as Reservation['status'])}>
                                            <SelectTrigger className="w-8 h-8 p-0 border border-gray-300">
                                                <Settings className="w-4 h-4" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="confirmée">Confirmer</SelectItem>
                                                <SelectItem value="en attente">En attente</SelectItem>
                                                <SelectItem value="annulée">Annuler</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => setSelectedForCancel(res)}>
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Détails */}
            {selectedDetails && (
                <Dialog open={!!selectedDetails} onOpenChange={() => setSelectedDetails(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Détails de la réservation</DialogTitle>
                        </DialogHeader>
                        <div className="text-sm space-y-2">
                            <p><b>Terrain:</b> {selectedDetails.fieldName}</p>
                            <p><b>Date:</b> {formatDate(selectedDetails.date)}</p>
                            <p><b>Heure:</b> {selectedDetails.time}</p>
                            <p><b>Prix:</b> {selectedDetails.price} DH</p>
                            <p><b>Utilisateur:</b> {selectedDetails.userName} ({selectedDetails.userEmail})</p>
                            {selectedDetails.notes && <p><b>Notes:</b> {selectedDetails.notes}</p>}
                            <p><b>Status:</b> {selectedDetails.status}</p>
                            <p><b>Créé le:</b> {new Date(selectedDetails.createdAt).toLocaleString('fr-FR')}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Confirmation annulation */}
            {selectedForCancel && (
                <Dialog open={!!selectedForCancel} onOpenChange={() => setSelectedForCancel(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Annuler la réservation ?</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">Cette action est <b>irréversible</b>. Voulez-vous vraiment annuler la réservation de {selectedForCancel.userName} pour le {formatDate(selectedForCancel.date)} à {selectedForCancel.time} ?</p>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setSelectedForCancel(null)}>Annuler</Button>
                            <Button variant="destructive" onClick={() => { handleStatusChange(selectedForCancel.id, 'annulée'); setSelectedForCancel(null); }}>Confirmer</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default ReservationsManagement;