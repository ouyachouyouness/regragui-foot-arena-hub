// src/components/admin/DevTools.tsx
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
    Loader2,
    FileJson,
    FolderOpen,
    Calendar
} from 'lucide-react';
import {
    importFields,
    importSlots,
    parseJsonFile,
    type Field
} from '@/firebase/admin.service.ts';

interface DevToolsProps {
    onImportSuccess: () => void;
    setImportStats: React.Dispatch<React.SetStateAction<{ fields: number; slots: number }>>;
}

const DevTools = ({ onImportSuccess, setImportStats }: DevToolsProps) => {
    const [isImportingFields, setIsImportingFields] = useState(false);
    const [isImportingSlots, setIsImportingSlots] = useState(false);

    // Refs for file inputs
    const fieldsFileInputRef = useRef<HTMLInputElement>(null);
    const slotsFileInputRef = useRef<HTMLInputElement>(null);

    // Handle fields file selection
    const handleFieldsFileSelect = () => {
        fieldsFileInputRef.current?.click();
    };

    // Handle slots file selection
    const handleSlotsFileSelect = () => {
        slotsFileInputRef.current?.click();
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

            // Trigger refresh in parent component
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
            // Reset file input
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

            // Trigger refresh in parent component
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
            // Reset file input
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Fields Import */}
                    <PremiumCard className="p-8 border-2 border-[#0033A1]/20 hover:border-[#0033A1]/40 transition-colors">
                        <CardHeader className="p-0 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-[#0033A1] to-[#3366CC] rounded-xl flex items-center justify-center">
                                    <FileJson className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl text-[#0033A1]">Import Terrains</CardTitle>
                                    <CardDescription className="text-base">
                                        Collection <code className="bg-gray-100 px-2 py-1 rounded text-[#0033A1] font-mono">fields</code>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3">Structure attendue :</h4>
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#0033A1] overflow-x-auto">
                                    <pre className="text-sm text-gray-700 font-mono">
{`[
  {
    "id": "1",
    "name": "Terrain Alpha Premium",
    "type": "foot5",
    "centre": "casablanca-centre",
    "image": "https://...",
    "rating": 4.9,
    "features": ["Gazon synthétique", "LED"]
  }
]`}
                                    </pre>
                                </div>
                            </div>

                            {/* Hidden file input */}
                            <input
                                ref={fieldsFileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleFieldsImport}
                                style={{ display: 'none' }}
                            />

                            {/* Import button */}
                            <GradientButton
                                variant="primary"
                                className="w-full h-14 text-lg"
                                disabled={isImportingFields}
                                onClick={handleFieldsFileSelect}
                            >
                                {isImportingFields ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Import en cours...
                                    </>
                                ) : (
                                    <>
                                        <FolderOpen className="w-6 h-6" />
                                        Sélectionner fichier terrains (.json)
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
                                    <CardTitle className="text-2xl text-[#0033A1]">Import Créneaux</CardTitle>
                                    <CardDescription className="text-base">
                                        Collection <code className="bg-gray-100 px-2 py-1 rounded text-[#0033A1] font-mono">slots</code>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3">Structure attendue :</h4>
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#FFCC00] overflow-x-auto">
                                    <pre className="text-sm text-gray-700 font-mono">
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

                            {/* Hidden file input */}
                            <input
                                ref={slotsFileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleSlotsImport}
                                style={{ display: 'none' }}
                            />

                            {/* Import button */}
                            <GradientButton
                                variant="secondary"
                                className="w-full h-14 text-lg"
                                disabled={isImportingSlots}
                                onClick={handleSlotsFileSelect}
                            >
                                {isImportingSlots ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Import en cours...
                                    </>
                                ) : (
                                    <>
                                        <FolderOpen className="w-6 h-6" />
                                        Sélectionner fichier créneaux (.json)
                                    </>
                                )}
                            </GradientButton>
                        </CardContent>
                    </PremiumCard>
                </div>
            </div>
        </div>
    );
};

export default DevTools;