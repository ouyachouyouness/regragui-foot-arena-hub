// src/components/admin/FieldsManagement.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
    MapPin,
    Star,
    Calendar,
    Loader2,
    Check,
    Settings,
    RefreshCw,
    Zap
} from 'lucide-react';
import {
    fetchFields,
    type Field
} from '@/firebase/admin.service.ts';

const FieldsManagement = () => {
    const [fields, setFields] = useState<Field[]>([]);
    const [isLoadingFields, setIsLoadingFields] = useState(false);

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

    // Load fields on component mount
    useEffect(() => {
        handleFetchFields();
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
        </div>
    );
};

export default FieldsManagement;