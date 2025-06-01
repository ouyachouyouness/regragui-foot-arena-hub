// src/components/admin/ScheduleCalendar.tsx - Version avec calcul de dates corrigé
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    Settings,
    ChevronLeft,
    ChevronRight,
    Plus,
    AlertTriangle
} from 'lucide-react';
import {
    fetchFields,
    fetchWeeklySlotsByField,
    type Field,
    type WeeklySlots,
    type WeeklySlot
} from '@/firebase/admin.service.ts';

// Types
interface TimeSlot extends WeeklySlot {
    id: string;
    dayName: string;
    date: string;
    exists: boolean; // Indique si le créneau existe dans la DB
}

interface WeekDay {
    name: string;
    date: string;
    shortName: string;
    dayKey: keyof WeeklySlots['slots']; // 'lundi', 'mardi', etc.
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
    const [currentWeek, setCurrentWeek] = useState<string>(''); // Format: 2025-W19
    const [weeklySlots, setWeeklySlots] = useState<WeeklySlots | null>(null);

    // Generate time slots from 8h to 22h (every hour)
    const generateTimeSlots = (): string[] => {
        const slots = [];
        for (let hour = 8; hour <= 22; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    };

    // Get ISO week number
    const getISOWeek = (date: Date): number => {
        const tempDate = new Date(date.getTime());
        tempDate.setHours(0, 0, 0, 0);
        // Set to Thursday of this week (4 is Thursday)
        tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
        const yearStart = new Date(tempDate.getFullYear(), 0, 1);
        const weekNo = Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
        return weekNo;
    };

    // Get current week in ISO format (YYYY-WNN)
    const getCurrentWeek = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const week = getISOWeek(now);
        return `${year}-W${week.toString().padStart(2, '0')}`;
    };

    // Get Monday of ISO week
    const getMondayOfISOWeek = (year: number, week: number): Date => {
        const simple = new Date(year, 0, 1 + (week - 1) * 7);
        const dayOfWeek = simple.getDay(); // 0 (Sun) to 6 (Sat)

        const monday = new Date(simple);
        // getDay() correction: ISO week starts on Monday (1), so shift accordingly
        const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
        monday.setDate(simple.getDate() + diff);

        return monday;
    };


    const monday = getMondayOfISOWeek(2025, 23);
    console.log(monday.toDateString()); // ✅ "Mon Jun 02 2025"



    // Generate week from week string (YYYY-WNN)
    const generateWeekFromString = (weekString: string): WeekDay[] => {
        const [year, weekNum] = weekString.split('-W');
        const yearNum = parseInt(year);
        const weekNumber = parseInt(weekNum);

        // Get Monday of this ISO week
        const monday = getMondayOfISOWeek(yearNum, weekNumber);

        const days = [];
        const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const shortNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const dayKeys: (keyof WeeklySlots['slots'])[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            days.push({
                name: dayNames[i],
                shortName: shortNames[i],
                date: `${day.getFullYear()}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`,
                dayKey: dayKeys[i]
            });
            console.log(`${dayNames[i]} (${dayKeys[i]}): ${day.toISOString().split('T')[0]} - Weekday: ${day.getDay()}`);

        }

        return days;
    };

    // Generate schedule data from weeklySlots
    const generateScheduleFromWeeklySlots = (weeklySlots: WeeklySlots | null): {[key: string]: TimeSlot} => {
        const schedule: {[key: string]: TimeSlot} = {};

        weekDays.forEach((day) => {
            timeSlots.forEach((time) => {
                const key = `${day.date}-${time}`;

                // Check if slot exists in weeklySlots
                const daySlots = weeklySlots?.slots[day.dayKey] || [];
                const existingSlot = daySlots.find(slot => slot.time === time);

                if (existingSlot) {
                    // Slot exists in database
                    schedule[key] = {
                        id: `${selectedFieldId}-${day.date}-${time}`,
                        time,
                        available: existingSlot.available,
                        price: existingSlot.price,
                        dayName: day.name,
                        date: day.date,
                        exists: true
                    };
                } else {
                    // Slot doesn't exist in database - show as empty
                    schedule[key] = {
                        id: `${selectedFieldId}-${day.date}-${time}`,
                        time,
                        available: false,
                        price: 0,
                        dayName: day.name,
                        date: day.date,
                        exists: false
                    };
                }
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

    // Load weekly slots for field and week
    const loadWeeklySlots = async (fieldId: string, week: string) => {
        setIsLoading(true);
        try {
            const slots = await fetchWeeklySlotsByField(fieldId);
            const weekSlots = slots.find(s => s.week === week);
            setWeeklySlots(weekSlots || null);

            // Generate schedule data
            const schedule = generateScheduleFromWeeklySlots(weekSlots || null);
            setScheduleData(schedule);

        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger les créneaux",
                variant: "destructive",
            });
            setWeeklySlots(null);
            // Generate empty schedule
            const schedule = generateScheduleFromWeeklySlots(null);
            setScheduleData(schedule);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle field selection
    const handleFieldSelect = async (fieldId: string) => {
        setSelectedFieldId(fieldId);
        const field = fields.find(f => f.id === fieldId);
        setSelectedField(field || null);

        if (fieldId && currentWeek) {
            await loadWeeklySlots(fieldId, currentWeek);
        }
    };

    // Handle week navigation
    const navigateWeek = (direction: 'prev' | 'next') => {
        const [year, weekNum] = currentWeek.split('-W');
        let newYear = parseInt(year);
        let newWeek = parseInt(weekNum);

        if (direction === 'next') {
            newWeek += 1;
            if (newWeek > 52) {
                // Check if year has 53 weeks
                const lastWeekOfYear = getISOWeek(new Date(newYear, 11, 31));
                if (newWeek > lastWeekOfYear) {
                    newWeek = 1;
                    newYear += 1;
                }
            }
        } else {
            newWeek -= 1;
            if (newWeek < 1) {
                newYear -= 1;
                // Get last week of previous year
                const lastWeekOfPrevYear = getISOWeek(new Date(newYear, 11, 31));
                newWeek = lastWeekOfPrevYear;
            }
        }

        const newWeekString = `${newYear}-W${newWeek.toString().padStart(2, '0')}`;
        setCurrentWeek(newWeekString);
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
            case 'create':
                toast({
                    title: "Créneau à créer",
                    description: `Créer le créneau ${selectedSlot.time} le ${selectedSlot.dayName} (mode démo)`,
                });
                break;
            case 'edit':
                toast({
                    title: "Modification simulée",
                    description: `Modifier le créneau ${selectedSlot.time} (mode démo)`,
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
    const getStatusColor = (slot: TimeSlot) => {
        if (!slot.exists) {
            return 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100';
        }

        if (slot.available) {
            return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
        } else {
            return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200';
        }
    };

    // Get status icon
    const getStatusIcon = (slot: TimeSlot) => {
        if (!slot.exists) {
            return <Plus className="w-4 h-4" />;
        }

        if (slot.available) {
            return <CheckCircle className="w-4 h-4" />;
        } else {
            return <XCircle className="w-4 h-4" />;
        }
    };

    // Get week info
    const getWeekInfo = () => {
        if (weekDays.length === 0) return '';
        const firstDay = new Date(weekDays[0]?.date);
        const lastDay = new Date(weekDays[6]?.date);

        return `Semaine ${currentWeek} - Du ${firstDay.toLocaleDateString('fr-FR')} au ${lastDay.toLocaleDateString('fr-FR')}`;
    };

    // Initialize component
    useEffect(() => {
        loadFields();
        setTimeSlots(generateTimeSlots());
        const week = getCurrentWeek();
        setCurrentWeek(week);
    }, []);

    // Update week days when current week changes
    useEffect(() => {
        if (currentWeek) {
            const days = generateWeekFromString(currentWeek);
            setWeekDays(days);
        }
    }, [currentWeek]);

    // Reload data when week or field changes
    useEffect(() => {
        if (selectedFieldId && currentWeek && weekDays.length > 0) {
            loadWeeklySlots(selectedFieldId, currentWeek);
        }
    }, [selectedFieldId, currentWeek, weekDays.length]);

    useEffect(() => {
        if (selectedFieldId && currentWeek && weekDays.length === 7) {
            loadWeeklySlots(selectedFieldId, currentWeek);
        }
    }, [weekDays]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#0033A1] mb-2">
                        📅 Gestion des créneaux
                    </h2>
                    <p className="text-gray-600">
                        Visualisez et gérez les créneaux horaires par terrain depuis la base de données
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
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

                                {weeklySlots ? (
                                    <Badge className="bg-green-100 text-green-800">
                                        Créneaux chargés
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-orange-300 text-orange-600">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Aucun créneau
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Week Navigation */}
            {selectedFieldId && (
                <Card className="border-2 border-purple-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-[#0033A1]">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Navigation par semaine
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateWeek('prev')}
                                    className="border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Précédente
                                </Button>
                                <div className="px-4 py-2 bg-[#0033A1] text-white rounded-lg font-medium text-center min-w-[200px]">
                                    {currentWeek}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateWeek('next')}
                                    className="border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white"
                                >
                                    Suivante
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-gray-600">{getWeekInfo()}</p>
                    </CardContent>
                </Card>
            )}

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
                            {getWeekInfo()}
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
                                <span className="text-sm font-medium">Non disponible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                                    <Plus className="w-2 h-2 text-gray-400" />
                                </div>
                                <span className="text-sm font-medium">Pas de créneau (vide)</span>
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
                                    {weekDays.map((day) => {
                                        const [yyyy, mm, dd] = day.date.split('-');
                                        const localDate = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));

                                        return (
                                            <div key={day.date} className="p-3 text-center bg-[#0033A1] text-white rounded">
                                                <div className="font-bold">{day.shortName}</div>
                                                <div className="text-xs opacity-90">
                                                    {localDate.getDate()}/{localDate.getMonth() + 1}
                                                </div>
                                            </div>
                                        );
                                    })}

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
                                                        ${slot ? getStatusColor(slot) : 'bg-gray-50 border-gray-200'}
                                                        hover:scale-105 active:scale-95
                                                    `}
                                                >
                                                    {slot && (
                                                        <div className="text-center">
                                                            <div className="flex items-center justify-center mb-1">
                                                                {getStatusIcon(slot)}
                                                            </div>
                                                            {slot.exists ? (
                                                                <div className="text-xs font-bold">
                                                                    {slot.price} DH
                                                                </div>
                                                            ) : (
                                                                <div className="text-xs text-gray-400">
                                                                    Vide
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
                            Créneau {selectedSlot?.time} - {selectedSlot?.dayName}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedSlot && (
                        <div className="space-y-4">
                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <Label>Statut :</Label>
                                {!selectedSlot.exists ? (
                                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                                        <Plus className="w-3 h-3 mr-1" />
                                        Pas de créneau
                                    </Badge>
                                ) : selectedSlot.available ? (
                                    <Badge className="bg-green-100 text-green-800 border-green-300">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Disponible
                                    </Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-800 border-red-300">
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Non disponible
                                    </Badge>
                                )}
                            </div>

                            {/* Date et heure */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Label>Date :</Label>
                                    <span className="font-medium">
                                        {new Date(selectedSlot.date).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Label>Heure :</Label>
                                    <span className="font-medium">{selectedSlot.time}</span>
                                </div>
                            </div>

                            {/* Price (only if exists) */}
                            {selectedSlot.exists && (
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
                            )}

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                {!selectedSlot.exists ? (
                                    <Button
                                        onClick={() => handleSlotAction('create')}
                                        className="bg-blue-600 hover:bg-blue-700 col-span-2"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Créer ce créneau
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => handleSlotAction('edit')}
                                            variant="outline"
                                            className="border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Modifier
                                        </Button>
                                        <Button
                                            onClick={() => handleSlotAction(selectedSlot.available ? 'disable' : 'enable')}
                                            className={selectedSlot.available ?
                                                "bg-red-600 hover:bg-red-700" :
                                                "bg-green-600 hover:bg-green-700"
                                            }
                                        >
                                            <Power className="w-4 h-4 mr-2" />
                                            {selectedSlot.available ? 'Désactiver' : 'Activer'}
                                        </Button>
                                    </>
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