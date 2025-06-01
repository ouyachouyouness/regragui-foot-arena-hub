// src/firebase/search.service.ts
import { firestore } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getISOWeek } from 'date-fns';

export interface Field {
    id: string;
    name: string;
    type: string;
    centre: string;
    image: string;
    rating?: number;
    features?: string[];
    maxPlayers?: number;
}

export interface TimeSlot {
    id: string;
    fieldId: string;
    time: string;
    available: boolean;
    price: number;
    date: string;
}

export interface SearchFilters {
    centre: string;
    fieldType: string;
    date: string;
}

export interface SearchResult {
    field: Field;
    timeSlots: TimeSlot[];
}

const fieldsCollection = collection(firestore, 'fields');
const weeklySlotsCollection = collection(firestore, 'weeklySlots');

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

export const searchAvailableFields = async (filters: SearchFilters): Promise<SearchResult[]> => {
    try {
        console.log('Recherche avec filtres:', filters);

        const fieldDocs = await getDocs(fieldsCollection);
        let fields = fieldDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Field[];

        if (filters.centre !== 'all') {
            fields = fields.filter(f => f.centre === filters.centre);
        }
        if (filters.fieldType !== 'all') {
            fields = fields.filter(f => f.type === filters.fieldType);
        }

        console.log('Terrains trouvés:', fields.length);
        if (fields.length === 0) return [];

        const weekString = getWeekString(filters.date);
        const dayKey = getDayKey(filters.date);

        const results: SearchResult[] = [];

        const weeklySnapshot = await getDocs(query(weeklySlotsCollection, where('week', '==', weekString)));
        const weeklyDocs = weeklySnapshot.docs.map(doc => doc.data());

        for (const field of fields) {
            const slotDoc = weeklyDocs.find(w => w.fieldId === field.id);
            if (!slotDoc || !slotDoc.slots || !slotDoc.slots[dayKey]) continue;

            const timeSlots: TimeSlot[] = slotDoc.slots[dayKey].map((slot: any) => ({
                id: `${field.id}_${filters.date}_${slot.time}`,
                fieldId: field.id,
                time: slot.time,
                available: slot.available,
                price: slot.price,
                date: filters.date
            }));

            if (timeSlots.length > 0) {
                results.push({ field, timeSlots });
            }
        }

        console.log('Résultats finaux:', results.length);
        return results;
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        throw new Error('Erreur lors de la recherche des terrains disponibles');
    }
};

export const getAvailableFieldTypes = async (): Promise<string[]> => {
    try {
        const fieldsSnapshot = await getDocs(fieldsCollection);
        const fieldTypes = new Set<string>();

        fieldsSnapshot.docs.forEach(doc => {
            const field = doc.data() as Field;
            if (field.type) {
                fieldTypes.add(field.type);
            }
        });

        return Array.from(fieldTypes).sort();
    } catch (error) {
        console.error('Erreur lors de la récupération des types de terrains:', error);
        return [];
    }
};

export const getAvailableCentres = async (): Promise<string[]> => {
    try {
        const fieldsSnapshot = await getDocs(fieldsCollection);
        const centres = new Set<string>();

        fieldsSnapshot.docs.forEach(doc => {
            const field = doc.data() as Field;
            if (field.centre) {
                centres.add(field.centre);
            }
        });

        return Array.from(centres).sort();
    } catch (error) {
        console.error('Erreur lors de la récupération des centres:', error);
        return ['errachidia'];
    }
};