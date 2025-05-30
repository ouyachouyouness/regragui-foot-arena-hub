
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchBar = () => {
  const [centre, setCentre] = useState("all");
  const [terrain, setTerrain] = useState("all");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (centre && centre !== "all") searchParams.set('centre', centre);
    if (terrain && terrain !== "all") searchParams.set('terrain', terrain);
    if (date) searchParams.set('date', date);
    navigate(`/reservation?${searchParams.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg p-6 shadow-xl max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Centre
          </label>
          <Select value={centre} onValueChange={setCentre}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un centre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les centres</SelectItem>
              <SelectItem value="casablanca-centre">Casablanca Centre</SelectItem>
              <SelectItem value="casablanca-maarif">Casablanca Maârif</SelectItem>
              <SelectItem value="rabat-agdal">Rabat Agdal</SelectItem>
              <SelectItem value="marrakech-gueliz">Marrakech Guéliz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de terrain
          </label>
          <Select value={terrain} onValueChange={setTerrain}>
            <SelectTrigger>
              <SelectValue placeholder="Terrain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="foot5">Football à 5</SelectItem>
              <SelectItem value="foot7">Football à 7</SelectItem>
              <SelectItem value="foot11">Football à 11</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="w-full"
          />
        </div>

        <Button 
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 h-10 font-semibold"
        >
          Voir les disponibilités
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
