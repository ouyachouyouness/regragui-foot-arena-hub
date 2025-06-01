// src/firebase/adminService.ts
import { firestore } from './firebase';
import { collection, addDoc, getDocs, doc, setDoc, query, where } from 'firebase/firestore';

export interface Field {
    id?: string;
    name: string;
    type: string;
    centre: string;
    image: string;
    rating?: number;
    features?: string[];
}

export interface Slot {
    id?: string;
    fieldId: string;
    time: string;
    available?: boolean;
    price?: number;
    date?: string;
}


// Nouvelle interface pour weeklySlots
export interface WeeklySlot {
    time: string;
    available: boolean;
    price: number;
}

export interface WeeklySlots {
    fieldId: string;
    week: string; // Format: "2025-W19"
    slots: {
        lundi: WeeklySlot[];
        mardi: WeeklySlot[];
        mercredi: WeeklySlot[];
        jeudi: WeeklySlot[];
        vendredi: WeeklySlot[];
        samedi: WeeklySlot[];
        dimanche: WeeklySlot[];
    };
}

// Collection reference
const weeklySlotsCollection = collection(firestore, 'weeklySlots');


// Collection references
const fieldsCollection = collection(firestore, 'fields');
const slotsCollection = collection(firestore, 'slots');

/**
 * Fetch all fields from Firestore
 */
export const fetchFields = async (): Promise<Field[]> => {
    try {
        const fieldSnapshot = await getDocs(fieldsCollection);
        const fieldsList = fieldSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Field[];
        return fieldsList;
    } catch (error) {
        console.error('Error fetching fields:', error);
        throw new Error('Impossible de charger les terrains');
    }
};

/**
 * Fetch all slots from Firestore
 */
export const fetchSlots = async (): Promise<Slot[]> => {
    try {
        const slotsSnapshot = await getDocs(slotsCollection);
        const slotsList = slotsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Slot[];
        return slotsList;
    } catch (error) {
        console.error('Error fetching slots:', error);
        throw new Error('Impossible de charger les créneaux');
    }
};

/**
 * Fetch slots for a specific field
 */
export const fetchSlotsByField = async (fieldId: string): Promise<Slot[]> => {
    try {
        const q = query(slotsCollection, where('fieldId', '==', fieldId));
        const slotsSnapshot = await getDocs(q);
        const slotsList = slotsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Slot[];
        return slotsList;
    } catch (error) {
        console.error('Error fetching slots for field:', fieldId, error);
        throw new Error('Impossible de charger les créneaux du terrain');
    }
};

/**
 * Import fields from JSON data
 */
export const importFields = async (fieldsData: Field[]): Promise<number> => {
    if (!Array.isArray(fieldsData)) {
        throw new Error('Le fichier doit contenir un tableau de terrains');
    }

    let successCount = 0;
    const errors: string[] = [];

    for (const field of fieldsData) {
        try {
            // Validate required fields
            if (!field.name || !field.type || !field.centre || !field.image) {
                errors.push(`Terrain "${field.name || 'sans nom'}": champs requis manquants`);
                continue;
            }

            const fieldData = {
                name: field.name,
                type: field.type,
                centre: field.centre,
                image: field.image,
                rating: field.rating || null,
                features: field.features || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Use custom ID if provided, otherwise let Firestore generate one
            if (field.id) {
                await setDoc(doc(fieldsCollection, field.id), fieldData);
            } else {
                await addDoc(fieldsCollection, fieldData);
            }

            successCount++;
        } catch (error) {
            console.error('Error importing field:', field.name, error);
            errors.push(`Erreur pour "${field.name}": ${error.message}`);
        }
    }

    if (errors.length > 0) {
        console.warn('Import errors:', errors);
    }

    return successCount;
};

/**
 * Import slots from JSON data
 */
export const importSlots = async (slotsData: Slot[]): Promise<number> => {
    if (!Array.isArray(slotsData)) {
        throw new Error('Le fichier doit contenir un tableau de créneaux');
    }

    let successCount = 0;
    const errors: string[] = [];

    for (const slot of slotsData) {
        try {
            // Validate required fields
            if (!slot.fieldId || !slot.time) {
                errors.push(`Créneau manquant fieldId ou time`);
                continue;
            }

            const slotData = {
                fieldId: slot.fieldId,
                time: slot.time,
                available: slot.available !== undefined ? slot.available : true,
                price: slot.price || 200,
                date: slot.date || new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await addDoc(slotsCollection, slotData);
            successCount++;
        } catch (error) {
            console.error('Error importing slot:', slot, error);
            errors.push(`Erreur pour créneau ${slot.time}: ${error.message}`);
        }
    }

    if (errors.length > 0) {
        console.warn('Import errors:', errors);
    }

    return successCount;
};

/**
 * Delete a field by ID
 */
export const deleteField = async (fieldId: string): Promise<void> => {
    try {
        await doc(fieldsCollection, fieldId).delete();
    } catch (error) {
        console.error('Error deleting field:', error);
        throw new Error('Impossible de supprimer le terrain');
    }
};

/**
 * Update a field
 */
export const updateField = async (fieldId: string, fieldData: Partial<Field>): Promise<void> => {
    try {
        await setDoc(doc(fieldsCollection, fieldId), {
            ...fieldData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating field:', error);
        throw new Error('Impossible de mettre à jour le terrain');
    }
};

/**
 * Parse and validate JSON file
 */
export const parseJsonFile = async (file: File): Promise<any> => {
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        return data;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Format JSON invalide. Vérifiez la syntaxe du fichier.');
        }
        throw new Error('Impossible de lire le fichier. Vérifiez qu\'il s\'agit d\'un fichier JSON valide.');
    }
};

/**
 * Get statistics
 */
export const getStats = async () => {
    try {
        const [fieldsSnapshot, slotsSnapshot] = await Promise.all([
            getDocs(fieldsCollection),
            getDocs(slotsCollection)
        ]);

        return {
            totalFields: fieldsSnapshot.size,
            totalSlots: slotsSnapshot.size,
            availableSlots: slotsSnapshot.docs.filter(doc => doc.data().available).length
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        throw new Error('Impossible de charger les statistiques');
    }
};

/**
 * Import weekly slots from JSON data
 */
export const importWeeklySlots = async (weeklySlotsData: WeeklySlots[]): Promise<{ success: number; errors: string[] }> => {
    if (!Array.isArray(weeklySlotsData)) {
        throw new Error('Le fichier doit contenir un tableau de créneaux hebdomadaires');
    }

    let successCount = 0;
    const errors: string[] = [];

    for (const weeklySlot of weeklySlotsData) {
        try {
            // Validate required fields
            if (!weeklySlot.fieldId || !weeklySlot.week || !weeklySlot.slots) {
                errors.push(`Objet manquant fieldId, week ou slots`);
                continue;
            }

            // Validate week format (should be YYYY-WNN)
            const weekPattern = /^\d{4}-W\d{2}$/;
            if (!weekPattern.test(weeklySlot.week)) {
                errors.push(`Format de semaine invalide: "${weeklySlot.week}". Attendu: YYYY-WNN (ex: 2025-W19)`);
                continue;
            }

            // Validate slots structure
            const requiredDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
            const missingDays = requiredDays.filter(day => !weeklySlot.slots[day]);
            if (missingDays.length > 0) {
                errors.push(`Jours manquants pour ${weeklySlot.fieldId}_${weeklySlot.week}: ${missingDays.join(', ')}`);
                continue;
            }

            // Validate each day's slots
            let isValidSlots = true;
            for (const [dayName, daySlots] of Object.entries(weeklySlot.slots)) {
                if (!Array.isArray(daySlots)) {
                    errors.push(`Les créneaux du ${dayName} doivent être un tableau pour ${weeklySlot.fieldId}_${weeklySlot.week}`);
                    isValidSlots = false;
                    break;
                }

                for (const slot of daySlots) {
                    if (!slot.time || typeof slot.available !== 'boolean' || typeof slot.price !== 'number') {
                        errors.push(`Créneau invalide le ${dayName} pour ${weeklySlot.fieldId}_${weeklySlot.week}: manque time, available ou price`);
                        isValidSlots = false;
                        break;
                    }
                }

                if (!isValidSlots) break;
            }

            if (!isValidSlots) continue;

            // Create document data
            const weeklySlotData = {
                fieldId: weeklySlot.fieldId,
                week: weeklySlot.week,
                slots: weeklySlot.slots,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Use custom ID: fieldId_week (ex: "1_2025-W19")
            const documentId = `${weeklySlot.fieldId}_${weeklySlot.week}`;
            await setDoc(doc(weeklySlotsCollection, documentId), weeklySlotData);

            successCount++;

        } catch (error) {
            console.error('Error importing weekly slot:', weeklySlot, error);
            errors.push(`Erreur pour ${weeklySlot.fieldId}_${weeklySlot.week}: ${error.message}`);
        }
    }

    return { success: successCount, errors };
};

/**
 * Fetch all weekly slots
 */
export const fetchWeeklySlots = async (): Promise<WeeklySlots[]> => {
    try {
        const snapshot = await getDocs(weeklySlotsCollection);
        const weeklySlotsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (WeeklySlots & { id: string })[];
        return weeklySlotsList;
    } catch (error) {
        console.error('Error fetching weekly slots:', error);
        throw new Error('Impossible de charger les créneaux hebdomadaires');
    }
};

/**
 * Fetch weekly slots for a specific field
 */
export const fetchWeeklySlotsByField = async (fieldId: string): Promise<WeeklySlots[]> => {
    try {
        const q = query(weeklySlotsCollection, where('fieldId', '==', fieldId));
        const snapshot = await getDocs(q);
        const weeklySlotsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (WeeklySlots & { id: string })[];
        return weeklySlotsList;
    } catch (error) {
        console.error('Error fetching weekly slots for field:', fieldId, error);
        throw new Error('Impossible de charger les créneaux hebdomadaires du terrain');
    }
};

export const getStatsWithWeeklySlots = async () => {
    try {
        const [fieldsSnapshot, slotsSnapshot, weeklySlotsSnapshot] = await Promise.all([
            getDocs(fieldsCollection),
            getDocs(slotsCollection),
            getDocs(weeklySlotsCollection)
        ]);

        return {
            totalFields: fieldsSnapshot.size,
            totalSlots: slotsSnapshot.size,
            totalWeeklySlots: weeklySlotsSnapshot.size,
            availableSlots: slotsSnapshot.docs.filter(doc => doc.data().available).length
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        throw new Error('Impossible de charger les statistiques');
    }
};