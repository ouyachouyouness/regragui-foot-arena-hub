// src/components/admin/DevTools.tsx - Version mise à jour avec importation weeklySlots

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
    Loader2,
    FileJson,
    FolderOpen,
    Calendar,
    Clock
} from 'lucide-react';
import {
    importFields,
    importSlots,
    importWeeklySlots,
    parseJsonFile,
    type Field,
    type WeeklySlots
} from '@/firebase/admin.service.ts';

interface DevToolsProps {
    onImportSuccess: () => void;
    setImportStats: React.Dispatch<React.SetStateAction<{ fields: number; slots: number; weeklySlots: number }>>;
}

const DevTools = ({ onImportSuccess, setImportStats }: DevToolsProps) => {
    const [isImportingFields, setIsImportingFields] = useState(false);
    const [isImportingSlots, setIsImportingSlots] = useState(false);
    const [isImportingWeeklySlots, setIsImportingWeeklySlots] = useState(false);

    // Refs for file inputs
    const fieldsFileInputRef = useRef<HTMLInputElement>(null);
    const slotsFileInputRef = useRef<HTMLInputElement>(null);
    const weeklySlotsFileInputRef = useRef<HTMLInputElement>(null);

    // Handle fields file selection
    const handleFieldsFileSelect = () => {
        fieldsFileInputRef.current?.click();
    };

    // Handle slots file selection
    const handleSlotsFileSelect = () => {
        slotsFileInputRef.current?.click();
    };

    // Handle weekly slots file selection
    const handleWeeklySlotsFileSelect = () => {
        weeklySlotsFileInputRef.current?.click();
    };

    // Import fields from JSON
    const handleFieldsImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImportingFields(true);

        try {
            const fieldsData = await parseJsonFile(file);
            const successCount = await importFields(fieldsData);

            setImportStats(prev => ({ ...prev, fields: prev.fields + successCount }));

            toast({
                title: "Import réussi !",
                description: `${successCount} terrains importés avec succès`,
            });

            onImportSuccess();

        } catch (error) {
            console.error('Error importing fields:', error);
            toast({
                title: "Erreur d'import",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsImportingFields(false);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    // Import slots from JSON
    const handleSlotsImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImportingSlots(true);

        try {
            const slotsData = await parseJsonFile(file);
            const successCount = await importSlots(slotsData);

            setImportStats(prev => ({ ...prev, slots: prev.slots + successCount }));

            toast({
                title: "Import réussi !",
                description: `${successCount} créneaux importés avec succès`,
            });

            onImportSuccess();

        } catch (error) {
            console.error('Error importing slots:', error);
            toast({
                title: "Erreur d'import",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsImportingSlots(false);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    // Import weekly slots from JSON
    const handleWeeklySlotsImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImportingWeeklySlots(true);

        try {
            const weeklySlotsData = await parseJsonFile(file);
            const result = await importWeeklySlots(weeklySlotsData);

            setImportStats(prev => ({ ...prev, weeklySlots: prev.weeklySlots + result.success }));

            if (result.errors.length > 0) {
                toast({
                    title: "Import partiellement réussi",
                    description: `${result.success} créneaux hebdomadaires importés, ${result.errors.length} erreurs. Voir console pour détails.`,
                    variant: "default",
                });
                console.warn('Import errors:', result.errors);
            } else {
                toast({
                    title: "Import réussi !",
                    description: `${result.success} créneaux hebdomadaires importés avec succès`,
                });
            }

            onImportSuccess();

        } catch (error) {
            console.error('Error importing weekly slots:', error);
            toast({
                title: "Erreur d'import",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsImportingWeeklySlots(false);
            if (event.target) {
                event.target.value = '';
            }
        }
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
            tertiary: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
        };

        return (
            <button
                className={`
                    inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all duration-300 
                    transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    ${variants[variant]} ${className}
                `}
                {...props}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0033A1] mb-2">
                    🛠️ Outils de développement
                </h2>
                <p className="text-gray-600 mb-8">
                    Importez vos données JSON dans Firebase Firestore
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Fields Import */}
                    <PremiumCard className="p-8 border-2 border-[#0033A1]/20 hover:border-[#0033A1]/40 transition-colors">
                        <CardHeader className="p-0 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-[#0033A1] to-[#3366CC] rounded-xl flex items-center justify-center">
                                    <FileJson className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-[#0033A1]">Import Terrains</CardTitle>
                                    <CardDescription className="text-sm">
                                        Collection <code className="bg-gray-100 px-2 py-1 rounded text-[#0033A1] font-mono text-xs">fields</code>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3">Structure attendue :</h4>
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#0033A1] overflow-x-auto">
                                    <pre className="text-xs text-gray-700 font-mono">
{`[
  {
    "id": "1",
    "name": "Terrain Alpha",
    "type": "foot5",
    "centre": "casablanca-centre",
    "image": "https://...",
    "rating": 4.9,
    "features": ["Gazon", "LED"]
  }
]`}
                                    </pre>
                                </div>
                            </div>

                            <input
                                ref={fieldsFileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleFieldsImport}
                                style={{ display: 'none' }}
                            />

                            <GradientButton
                                variant="primary"
                                className="w-full h-12 text-sm"
                                disabled={isImportingFields}
                                onClick={handleFieldsFileSelect}
                            >
                                {isImportingFields ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Import...
                                    </>
                                ) : (
                                    <>
                                        <FolderOpen className="w-5 h-5" />
                                        Terrains (.json)
                                    </>
                                )}
                            </GradientButton>
                        </CardContent>
                    </PremiumCard>

                    {/* Slots Import */}
                    <PremiumCard className="p-8 border-2 border-[#FFCC00]/30 hover:border-[#FFCC00]/60 transition-colors">
                        <CardHeader className="p-0 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-[#FFCC00] to-[#FFD700] rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-[#0033A1]" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-[#0033A1]">Import Créneaux</CardTitle>
                                    <CardDescription className="text-sm">
                                        Collection <code className="bg-gray-100 px-2 py-1 rounded text-[#0033A1] font-mono text-xs">slots</code>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3">Structure attendue :</h4>
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#FFCC00] overflow-x-auto">
                                    <pre className="text-xs text-gray-700 font-mono">
{`[
  {
    "fieldId": "1",
    "time": "08:00",
    "available": true,
    "price": 200,
    "date": "2024-01-15"
  }
]`}
                                    </pre>
                                </div>
                            </div>

                            <input
                                ref={slotsFileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleSlotsImport}
                                style={{ display: 'none' }}
                            />

                            <GradientButton
                                variant="secondary"
                                className="w-full h-12 text-sm"
                                disabled={isImportingSlots}
                                onClick={handleSlotsFileSelect}
                            >
                                {isImportingSlots ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Import...
                                    </>
                                ) : (
                                    <>
                                        <FolderOpen className="w-5 h-5" />
                                        Créneaux (.json)
                                    </>
                                )}
                            </GradientButton>
                        </CardContent>
                    </PremiumCard>

                    {/* Weekly Slots Import - NOUVELLE SECTION */}
                    <PremiumCard className="p-8 border-2 border-purple-300 hover:border-purple-500 transition-colors">
                        <CardHeader className="p-0 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-[#0033A1]">Import Hebdomadaire</CardTitle>
                                    <CardDescription className="text-sm">
                                        Collection <code className="bg-gray-100 px-2 py-1 rounded text-[#0033A1] font-mono text-xs">weeklySlots</code>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3">Structure attendue :</h4>
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500 overflow-x-auto">
                                    <pre className="text-xs text-gray-700 font-mono">
{`[
  {
    "fieldId": "1",
    "week": "2025-W19",
    "slots": {
      "lundi": [
        {
          "time": "08:00",
          "available": true,
          "price": 200
        }
      ],
      "mardi": [...],
      "mercredi": [...],
      "jeudi": [...],
      "vendredi": [...],
      "samedi": [...],
      "dimanche": [...]
    }
  }
]`}
                                    </pre>
                                </div>
                            </div>

                            <input
                                ref={weeklySlotsFileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleWeeklySlotsImport}
                                style={{ display: 'none' }}
                            />

                            <GradientButton
                                variant="tertiary"
                                className="w-full h-12 text-sm"
                                disabled={isImportingWeeklySlots}
                                onClick={handleWeeklySlotsFileSelect}
                            >
                                {isImportingWeeklySlots ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Import...
                                    </>
                                ) : (
                                    <>
                                        <FolderOpen className="w-5 h-5" />
                                        Hebdomadaire (.json)
                                    </>
                                )}
                            </GradientButton>
                        </CardContent>
                    </PremiumCard>
                </div>

                {/* Notes importantes */}
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border-l-4 border-[#0033A1]">
                    <h3 className="font-bold text-[#0033A1] mb-3 flex items-center gap-2">
                        <FileJson className="w-5 h-5" />
                        Notes importantes
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• <strong>Weekly Slots</strong> : L'ID du document sera automatiquement <code className="bg-white px-2 py-1 rounded">fieldId_week</code> (ex: "1_2025-W19")</li>
                        <li>• <strong>Validation</strong> : Le format de semaine doit être YYYY-WNN (ex: 2025-W19)</li>
                        <li>• <strong>Jours requis</strong> : Tous les jours de la semaine doivent être présents (lundi à dimanche)</li>
                        <li>• <strong>Mise à jour</strong> : Si un document existe déjà, il sera remplacé</li>
                        <li>• <strong>Erreurs</strong> : Les erreurs de validation sont affichées dans la console</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DevTools;