
import SearchBar from "@/components/SearchBar";

const HeroReservation = ({
                             selectedDate,
                             setSelectedDate,
                             selectedType,
                             setSelectedType,
                             availableFieldTypes,
                             isLoading,
                             onSearch,
                             getFieldTypeLabel
                         }) => {
    return (
        <section className="bg-gradient-to-r from-[#0033A1] via-[#001a5c] to-[#0033A1] text-white py-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-6 gap-8 transform rotate-12 scale-150">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="text-6xl animate-pulse">⚽</div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12 animate-in fade-in duration-1000">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                        Réservation de terrains
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-medium">
                        Trouvez et réservez le terrain parfait pour votre match à Errachidia
                    </p>
                </div>

                <SearchBar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    availableFieldTypes={availableFieldTypes}
                    isLoading={isLoading}
                    onSearch={onSearch}
                    getFieldTypeLabel={getFieldTypeLabel}
                />
            </div>
        </section>
    );
};

export default HeroReservation;
