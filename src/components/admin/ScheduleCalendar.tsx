// src/components/admin/ScheduleCalendar.tsx
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
    Calendar,
    Clock,
    Edit,
    Eye,
    Power,
    UserPlus,
    MapPin,
    DollarSign,
    CheckCircle,
    XCircle,
    Loader2,
    Settings
} from 'lucide-react';
import { fetchFields, fetchSlotsByField, type Field } from '@/firebase/admin.service.ts';

// Types
interface TimeSlot {
    id: string;
    time: string;
    status: 'available' | 'reserved' | 'disabled';
    price: number;
    bookedBy?: string;
}

interface WeekDay {
    name: string;
    date: string;
    shortName: string;
}

const ScheduleCalendar = () => {
    const [fields, setFields] = useState<Field[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string>('');
    const [selectedField, setSelectedField] = useState<Field | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [scheduleData, setScheduleData] = useState<{[key: string]: TimeSlot}>({});
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Generate current week
    const generateCurrentWeek = (): WeekDay[] => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);

        const days = [];
        const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const shortNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            days.push({
                name: dayNames[i],
                shortName: shortNames[i],
                date: day.toISOString().split('T')[0]
            });
        }

        return days;
    };

    // Generate time slots (demo data)
    const generateTimeSlots = (): string[] => {
        const slots = [];
        for (let hour = 8; hour <= 22; hour += 2) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    };

    // Generate demo schedule data
    const generateDemoSchedule = (fieldId: string): {[key: string]: TimeSlot} => {
        const schedule: {[key: string]: TimeSlot} = {};
        const statuses: ('available' | 'reserved' | 'disabled')[] = ['available', 'available', 'available', 'reserved', 'disabled'];

        weekDays.forEach((day, dayIndex) => {
            timeSlots.forEach((time, timeIndex) => {
                const key = `${day.date}-${time}`;
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const basePrice = selectedField?.type === 'foot11' ? 500 : selectedField?.type === 'foot7' ? 300 : 200;

                schedule[key] = {
                    id: `${fieldId}-${day.date}-${time}`,
                    time,
                    status: randomStatus,
                    price: basePrice + (timeIndex > 3 ? 100 : 0), // Evening premium
                    bookedBy: randomStatus === 'reserved' ? 'Client Demo' : undefined
                };
            });
        });

        return schedule;
    };

    // Load fields
    const loadFields = async () => {
        try {
            const fieldsList = await fetchFields();
            setFields(fieldsList);
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger les terrains",
                variant: "destructive",
            });
        }
    };

    // Handle field selection
    const handleFieldSelect = async (fieldId: string) => {
        setSelectedFieldId(fieldId);
        setIsLoading(true);

        try {
            const field = fields.find(f => f.id === fieldId);
            setSelectedField(field || null);

            // Generate demo schedule
            const demoSchedule = generateDemoSchedule(fieldId);
            setScheduleData(demoSchedule);

        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger les créneaux",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle slot click
    const handleSlotClick = (day: WeekDay, time: string) => {
        const key = `${day.date}-${time}`;
        const slot = scheduleData[key];
        if (slot) {
            setSelectedSlot(slot);
            setIsModalOpen(true);
        }
    };

    // Handle slot action (demo)
    const handleSlotAction = (action: string) => {
        if (!selectedSlot) return;

        switch (action) {
            case 'reserve':
                toast({
                    title: "Réservation simulée",
                    description: `Créneau ${selectedSlot.time} réservé (mode démo)`,
                });
                break;
            case 'cancel':
                toast({
                    title: "Annulation simulée",
                    description: `Réservation ${selectedSlot.time} annulée (mode démo)`,
                });
                break;
            case 'disable':
                toast({
                    title: "Désactivation simulée",
                    description: `Créneau ${selectedSlot.time} désactivé (mode démo)`,
                });
                break;
            case 'enable':
                toast({
                    title: "Activation simulée",
                    description: `Créneau ${selectedSlot.time} activé (mode démo)`,
                });
                break;
        }
        setIsModalOpen(false);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
            case 'reserved':
                return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200';
            case 'disabled':
                return 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-500';
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'available':
                return <CheckCircle className="w-4 h-4" />;
            case 'reserved':
                return <UserPlus className="w-4 h-4" />;
            case 'disabled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Initialize component
    useEffect(() => {
        loadFields();
        setWeekDays(generateCurrentWeek());
        setTimeSlots(generateTimeSlots());
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#0033A1] mb-2">
                        📅 Gestion des créneaux
                    </h2>
                    <p className="text-gray-600">
                        Visualisez et gérez les créneaux horaires par terrain
                    </p>
                </div>
            </div>

            {/* Field Selector */}
            <Card className="border-2 border-[#0033A1]/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0033A1]">
                        <MapPin className="w-5 h-5" />
                        Sélection du terrain
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedFieldId} onValueChange={handleFieldSelect}>
                        <SelectTrigger className="w-full md:w-96 border-2 border-gray-200 focus:border-[#0033A1] h-12">
                            <SelectValue placeholder="Choisir un terrain pour afficher les créneaux..." />
                        </SelectTrigger>
                        <SelectContent>
                            {fields.map((field) => (
                                <SelectItem key={field.id} value={field.id!}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-[#0033A1] rounded-full"></div>
                                        <span className="font-medium">{field.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {field.type === 'foot5' ? '5v5' : field.type === 'foot7' ? '7v7' : '11v11'}
                                        </Badge>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {selectedField && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-[#0033A1] rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0033A1]">{selectedField.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedField.type === 'foot5' ? 'Football à 5' :
                                            selectedField.type === 'foot7' ? 'Football à 7' : 'Football à 11'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Calendar View */}
            {!selectedFieldId ? (
                <Card className="text-center py-20">
                    <CardContent>
                        <div className="text-6xl mb-6">📅</div>
                        <h3 className="text-2xl font-bold text-[#0033A1] mb-4">
                            Sélectionnez un terrain
                        </h3>
                        <p className="text-gray-600">
                            Veuillez sélectionner un terrain pour afficher les créneaux horaires
                        </p>
                    </CardContent>
                </Card>
            ) : isLoading ? (
                <Card className="text-center py-20">
                    <CardContent>
                        <Loader2 className="w-12 h-12 animate-spin text-[#0033A1] mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Chargement des créneaux...</p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#0033A1]">
                            <Calendar className="w-5 h-5" />
                            Semaine du {weekDays[0]?.date} au {weekDays[6]?.date}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                                <span className="text-sm font-medium">Disponible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                                <span className="text-sm font-medium">Réservé</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                                <span className="text-sm font-medium">Désactivé</span>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
                                {/* Header */}
                                <div className="grid grid-cols-8 gap-1 mb-2">
                                    <div className="p-3 text-center font-bold text-[#0033A1] bg-gray-50 rounded">
                                        Horaires
                                    </div>
                                    {weekDays.map((day) => (
                                        <div key={day.date} className="p-3 text-center bg-[#0033A1] text-white rounded">
                                            <div className="font-bold">{day.shortName}</div>
                                            <div className="text-xs opacity-90">
                                                {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Time slots */}
                                {timeSlots.map((time) => (
                                    <div key={time} className="grid grid-cols-8 gap-1 mb-1">
                                        <div className="p-3 text-center font-semibold text-[#0033A1] bg-gray-50 rounded flex items-center justify-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {time}
                                        </div>
                                        {weekDays.map((day) => {
                                            const key = `${day.date}-${time}`;
                                            const slot = scheduleData[key];

                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => handleSlotClick(day, time)}
                                                    className={`
                            p-2 rounded border-2 transition-all duration-200 cursor-pointer
                            ${slot ? getStatusColor(slot.status) : 'bg-gray-50 border-gray-200'}
                            hover:scale-105 active:scale-95
                          `}
                                                >
                                                    {slot && (
                                                        <div className="text-center">
                                                            <div className="flex items-center justify-center mb-1">
                                                                {getStatusIcon(slot.status)}
                                                            </div>
                                                            <div className="text-xs font-bold">
                                                                {slot.price} DH
                                                            </div>
                                                            {slot.bookedBy && (
                                                                <div className="text-xs opacity-75 truncate">
                                                                    {slot.bookedBy}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Slot Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#0033A1]" />
                            Créneau {selectedSlot?.time}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedSlot && (
                        <div className="space-y-4">
                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <Label>Statut :</Label>
                                <Badge className={`${
                                    selectedSlot.status === 'available' ? 'bg-green-100 text-green-800' :
                                        selectedSlot.status === 'reserved' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                }`}>
                                    {getStatusIcon(selectedSlot.status)}
                                    <span className="ml-1 capitalize">{selectedSlot.status}</span>
                                </Badge>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <Label htmlFor="price">Prix :</Label>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-[#0033A1]" />
                                    <Input
                                        id="price"
                                        value={selectedSlot.price}
                                        onChange={() => {}} // Demo mode
                                        className="w-24"
                                        disabled
                                    />
                                    <span className="text-sm text-gray-600">DH</span>
                                </div>
                            </div>

                            {/* Booked by */}
                            {selectedSlot.bookedBy && (
                                <div className="flex items-center gap-3">
                                    <Label>Réservé par :</Label>
                                    <span className="font-medium">{selectedSlot.bookedBy}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                {selectedSlot.status === 'available' && (
                                    <>
                                        <Button
                                            onClick={() => handleSlotAction('reserve')}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Réserver
                                        </Button>
                                        <Button
                                            onClick={() => handleSlotAction('disable')}
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Désactiver
                                        </Button>
                                    </>
                                )}

                                {selectedSlot.status === 'reserved' && (
                                    <>
                                        <Button
                                            onClick={() => handleSlotAction('cancel')}
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Annuler
                                        </Button>
                                        <Button variant="outline">
                                            <Eye className="w-4 h-4 mr-2" />
                                            Détails
                                        </Button>
                                    </>
                                )}

                                {selectedSlot.status === 'disabled' && (
                                    <Button
                                        onClick={() => handleSlotAction('enable')}
                                        className="bg-[#0033A1] hover:bg-[#001a5c] col-span-2"
                                    >
                                        <Power className="w-4 h-4 mr-2" />
                                        Réactiver
                                    </Button>
                                )}
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

export default ScheduleCalendar;