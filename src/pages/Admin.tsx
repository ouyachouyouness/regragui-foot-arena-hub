// src/pages/Admin.tsx
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
    Upload,
    FileText,
    MapPin,
    Star,
    Calendar,
    Users,
    Loader2,
    Check,
    X,
    Settings,
    Database,
    FileJson,
    Zap,
    Trophy,
    Image,
    RefreshCw,
    FolderOpen
} from 'lucide-react';
import {
    fetchFields,
    importFields,
    importSlots,
    parseJsonFile,
    getStats,
    type Field
} from '@/firebase/admin.service.ts';
import ScheduleCalendar from '@/components/admin/ScheduleCalendar';

const Admin = () => {
    const [fields, setFields] = useState<Field[]>([]);
    const [isLoadingFields, setIsLoadingFields] = useState(false);
    const [isImportingFields, setIsImportingFields] = useState(false);
    const [isImportingSlots, setIsImportingSlots] = useState(false);
    const [importStats, setImportStats] = useState({ fields: 0, slots: 0 });
    const [stats, setStats] = useState({ totalFields: 0, totalSlots: 0, availableSlots: 0 });

    // Refs for file inputs
    const fieldsFileInputRef = useRef<HTMLInputElement>(null);
    const slotsFileInputRef = useRef<HTMLInputElement>(null);

    // Fetch fields from Firestore
    const handleFetchFields = async () => {
        setIsLoadingFields(true);
        try {
            const fieldsList = await fetchFields();
            setFields(fieldsList);
        } catch (error) {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoadingFields(false);
        }
    };

    // Fetch statistics
    const handleFetchStats = async () => {
        try {
            const statsData = await getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

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

            // Refresh the fields list and stats
            await Promise.all([handleFetchFields(), handleFetchStats()]);

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

            // Refresh stats
            await handleFetchStats();

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

    // Load data on component mount
    useEffect(() => {
        Promise.all([handleFetchFields(), handleFetchStats()]);
    }, []);

    const getFieldTypeLabel = (type: string) => {
        switch (type) {
            case "foot5": return "Football à 5";
            case "foot7": return "Football à 7";
            case "foot11": return "Football à 11";
            default: return type;
        }
    };

    const getCentreLabel = (centre: string) => {
        switch (centre) {
            case "casablanca-centre": return "Casablanca Centre";
            case "casablanca-maarif": return "Casablanca Maârif";
            case "rabat-agdal": return "Rabat Agdal";
            case "marrakech-gueliz": return "Marrakech Guéliz";
            default: return centre;
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
            success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl",
            danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl"
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
        <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#0033A1] to-[#3366CC] rounded-2xl flex items-center justify-center shadow-lg">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[#0033A1] mb-2">
                            Interface Admin
                        </h1>
                        <p className="text-xl text-gray-600">
                            Gestion des terrains et créneaux - Regragui Football Academy
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PremiumCard className="p-6 bg-gradient-to-r from-[#0033A1] to-[#3366CC] text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 font-medium">Terrains importés</p>
                                <p className="text-3xl font-bold">{importStats.fields}</p>
                                <p className="text-xs text-blue-200 mt-1">Total DB: {stats.totalFields}</p>
                            </div>
                            <Database className="w-12 h-12 text-blue-200" />
                        </div>
                    </PremiumCard>

                    <PremiumCard className="p-6 bg-gradient-to-r from-[#FFCC00] to-[#FFD700] text-[#0033A1]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#0033A1]/70 font-medium">Créneaux importés</p>
                                <p className="text-3xl font-bold">{importStats.slots}</p>
                                <p className="text-xs text-[#0033A1]/70 mt-1">Total DB: {stats.totalSlots}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-[#0033A1]/70" />
                        </div>
                    </PremiumCard>

                    <PremiumCard className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 font-medium">Créneaux disponibles</p>
                                <p className="text-3xl font-bold">{stats.availableSlots}</p>
                                <p className="text-xs text-green-200 mt-1">Sur {stats.totalSlots} total</p>
                            </div>
                            <Trophy className="w-12 h-12 text-green-200" />
                        </div>
                    </PremiumCard>
                </div>
            </div>

            {/* Main Content */}
            <PremiumCard className="p-8">
                <Tabs defaultValue="dev" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg h-auto">
                        <TabsTrigger
                            value="dev"
                            className="data-[state=active]:bg-[#0033A1] data-[state=active]:text-white font-semibold text-sm py-2 px-4 rounded-md transition-all duration-300 whitespace-nowrap"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Dev
                        </TabsTrigger>
                        <TabsTrigger
                            value="terrains"
                            className="data-[state=active]:bg-[#0033A1] data-[state=active]:text-white font-semibold text-sm py-2 px-4 rounded-md transition-all duration-300 whitespace-nowrap"
                        >
                            <Database className="w-4 h-4 mr-2" />
                            Terrains
                        </TabsTrigger>
                        <TabsTrigger
                            value="schedule"
                            className="data-[state=active]:bg-[#0033A1] data-[state=active]:text-white font-semibold text-sm py-2 px-4 rounded-md transition-all duration-300 whitespace-nowrap"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Créneaux
                        </TabsTrigger>
                    </TabsList>

                    {/* Dev Tab */}
                    <TabsContent value="dev" className="space-y-8">
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
                    </TabsContent>

                    {/* Terrains Tab */}
                    <TabsContent value="terrains" className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-[#0033A1] mb-2">
                                    🏟️ Gestion des terrains
                                </h2>
                                <p className="text-gray-600">
                                    {fields.length} terrain{fields.length !== 1 ? 's' : ''} dans la base de données
                                </p>
                            </div>

                            <GradientButton onClick={handleFetchFields} disabled={isLoadingFields}>
                                {isLoadingFields ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-5 h-5" />
                                )}
                                Actualiser
                            </GradientButton>
                        </div>

                        {isLoadingFields ? (
                            <div className="text-center py-20">
                                <Loader2 className="w-12 h-12 animate-spin text-[#0033A1] mx-auto mb-4" />
                                <p className="text-lg text-gray-600">Chargement des terrains...</p>
                            </div>
                        ) : fields.length === 0 ? (
                            <PremiumCard className="text-center py-20">
                                <div className="text-6xl mb-6">🏟️</div>
                                <h3 className="text-2xl font-bold text-[#0033A1] mb-4">
                                    Aucun terrain trouvé
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    Utilisez l'onglet "Dev" pour importer vos terrains
                                </p>
                            </PremiumCard>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {fields.map((field, index) => (
                                    <PremiumCard
                                        key={field.id}
                                        className="overflow-hidden animate-in slide-in-from-bottom duration-500"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="relative">
                                            {/* Field Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={field.image}
                                                    alt={field.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                                {/* Rating Badge */}
                                                {field.rating && (
                                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-bold text-[#0033A1]">{field.rating}</span>
                                                    </div>
                                                )}

                                                {/* ID Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-[#0033A1] text-white font-mono">
                                                        ID: {field.id}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Field Details */}
                                            <div className="p-6">
                                                <div className="mb-4">
                                                    <h3 className="text-2xl font-bold text-[#0033A1] mb-2">
                                                        {field.name}
                                                    </h3>

                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <Badge variant="secondary" className="bg-[#FFCC00] text-[#0033A1]">
                                                            {getFieldTypeLabel(field.type)}
                                                        </Badge>
                                                        <Badge variant="outline" className="border-[#0033A1] text-[#0033A1]">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {getCentreLabel(field.centre)}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Features */}
                                                {field.features && field.features.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                            <Zap className="w-4 h-4 text-[#0033A1]" />
                                                            Équipements
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {field.features.map((feature, i) => (
                                                                <div key={i} className="flex items-center gap-2">
                                                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                                    <GradientButton variant="primary" className="flex-1 text-sm">
                                                        <Settings className="w-4 h-4" />
                                                        Modifier
                                                    </GradientButton>
                                                    <GradientButton variant="secondary" className="flex-1 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        Créneaux
                                                    </GradientButton>
                                                </div>
                                            </div>
                                        </div>
                                    </PremiumCard>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Schedule Tab */}
                    <TabsContent value="schedule" className="space-y-8">
                        <ScheduleCalendar />
                    </TabsContent>
                </Tabs>
            </PremiumCard>
        </div>
    );
};

export default Admin;