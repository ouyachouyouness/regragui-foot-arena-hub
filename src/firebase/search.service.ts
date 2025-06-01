// src/firebase/search.service.ts
import { firestore } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

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

// Collections
const fieldsCollection = collection(firestore, 'fields');
const slotsCollection = collection(firestore, 'slots');

/**
 * Rechercher les terrains disponibles selon les critères
 */
export const searchAvailableFields = async (filters: SearchFilters): Promise<SearchResult[]> => {
    try {
        console.log('Recherche avec filtres:', filters);

        // 1. Construire la requête pour les terrains
        let fieldQuery = query(fieldsCollection);

        // Filtrer par centre (obligatoire pour Errachidia)
        if (filters.centre && filters.centre !== 'all') {
            fieldQuery = query(fieldQuery, where('centre', '==', filters.centre));
        }

        // Filtrer par type de terrain
        if (filters.fieldType && filters.fieldType !== 'all') {
            fieldQuery = query(fieldQuery, where('type', '==', filters.fieldType));
        }

        // Récupérer les terrains
        const fieldsSnapshot = await getDocs(fieldQuery);
        const fields = fieldsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Field[];

        console.log('Terrains trouvés:', fields.length);

        if (fields.length === 0) {
            return [];
        }

        // 2. Récupérer les créneaux pour chaque terrain pour la date donnée
        const results: SearchResult[] = [];

        for (const field of fields) {
            try {
                // Requête pour les créneaux du terrain à la date donnée
                const slotsQuery = query(
                    slotsCollection,
                    where('fieldId', '==', field.id),
                    where('date', '==', filters.date),
                    orderBy('time', 'asc')
                );

                const slotsSnapshot = await getDocs(slotsQuery);
                const timeSlots = slotsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as TimeSlot[];

                // Filtrer par nombre de joueurs si spécifié
                let filteredField = field;
                if (filters.maxPlayers) {
                    // Vérifier si le terrain peut accueillir le nombre de joueurs
                    const fieldMaxPlayers = getMaxPlayersForFieldType(field.type);
                    if (fieldMaxPlayers < filters.maxPlayers) {
                        continue; // Passer au terrain suivant
                    }
                }

                // Ajouter seulement si le terrain a des créneaux
                if (timeSlots.length > 0) {
                    results.push({
                        field: filteredField,
                        timeSlots
                    });
                }
            } catch (error) {
                console.error(`Erreur lors de la récupération des créneaux pour le terrain ${field.id}:`, error);
            }
        }

        console.log('Résultats finaux:', results.length);
        return results;

    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        throw new Error('Erreur lors de la recherche des terrains disponibles');
    }
};

/**
 * Obtenir le nombre maximum de joueurs pour un type de terrain
 */
export const getMaxPlayersForFieldType = (fieldType: string): number => {
    switch (fieldType) {
        case 'foot5':
            return 5;
        case 'foot7':
            return 7;
        default:
            return 7; // Par défaut
    }
};

/**
 * Obtenir les types de terrains disponibles
 */
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

/**
 * Obtenir les centres disponibles
 */
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
        return ['errachidia']; // Valeur par défaut
    }
};

/**
 * Vérifier la disponibilité d'un créneau spécifique
 */
export const checkSlotAvailability = async (slotId: string): Promise<boolean> => {
    try {
        const slotQuery = query(slotsCollection, where('id', '==', slotId));
        const slotSnapshot = await getDocs(slotQuery);

        if (!slotSnapshot.empty) {
            const slotData = slotSnapshot.docs[0].data() as TimeSlot;
            return slotData.available;
        }

        return false;
    } catch (error) {
        console.error('Erreur lors de la vérification de disponibilité:', error);
        return false;
    }
};

/**
 * Obtenir les créneaux d'un terrain pour une date donnée
 */
export const getFieldSlots = async (fieldId: string, date: string): Promise<TimeSlot[]> => {
    try {
        const slotsQuery = query(
            slotsCollection,
            where('fieldId', '==', fieldId),
            where('date', '==', date),
            orderBy('time', 'asc')
        );

        const slotsSnapshot = await getDocs(slotsQuery);
        return slotsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as TimeSlot[];

    } catch (error) {
        console.error('Erreur lors de la récupération des créneaux:', error);
        return [];
    }
};