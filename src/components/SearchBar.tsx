import { useNavigate } from "react-router-dom";
import { MapPin, Users, Search, Loader2 } from "lucide-react";

const SearchBar = ({
                       selectedDate,
                       setSelectedDate,
                       selectedType,
                       setSelectedType,
                       availableFieldTypes,
                       isLoading,
                       onSearch,
                       getFieldTypeLabel
                   }) => {
    const navigate = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedDate) params.set("date", selectedDate);
        if (selectedType && selectedType !== "all") params.set("terrain", selectedType);
        params.set("centre", "errachidia");
        navigate(`/reservation?${params.toString()}`);
        onSearch?.();
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <section className="bg-gradient-to-r from-[#0033A1] via-[#001a5c] to-[#0033A1] text-white py-20 relative">
            {/* Background emojis */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="grid grid-cols-6 gap-8 transform rotate-12 scale-150">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="text-6xl animate-pulse">⚽</div>
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-black mb-6">Réservation de terrains</h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            Trouvez et réservez le terrain parfait pour votre match à Errachidia
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            {/* Centre */}
                            <div>
                                <label className="block text-sm font-bold text-[#0033A1] mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Centre
                                </label>
                                <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 font-medium">
                                    Errachidia
                                </div>
                            </div>

                            {/* Type de terrain */}
                            <div>
                                <label className="block text-sm font-bold text-[#0033A1] mb-2 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Type de terrain
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:border-[#0033A1] focus:ring-1 focus:ring-[#0033A1]"
                                >
                                    <option value="all">Tous les types</option>
                                    {availableFieldTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {getFieldTypeLabel
                                                ? getFieldTypeLabel(type)
                                                : type === "foot5" ? "Football à 5"
                                                    : type === "foot7" ? "Football à 7"
                                                        : type === "foot11" ? "Football à 11"
                                                            : type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-bold text-[#0033A1] mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:border-[#0033A1] focus:ring-1 focus:ring-[#0033A1]"
                                    style={{ colorScheme: "light" }}
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={today}
                                />
                            </div>

                            {/* Bouton */}
                            <div>
                                <button
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                    className="w-full h-14 flex justify-center items-center px-6 py-3 bg-[#0033A1] text-white font-bold rounded-lg hover:bg-[#001a5c] transition"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Recherche...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5 mr-2" />
                                            Rechercher
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
    );
};

export default SearchBar;
