
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchBar = () => {
  const [centre, setCentre] = useState("all");
  const [terrain, setTerrain] = useState("all");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (centre && centre !== "all") searchParams.set('centre', centre);
    if (terrain && terrain !== "all") searchParams.set('terrain', terrain);
    if (date) searchParams.set('date', date);
    navigate(`/reservation?${searchParams.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="academy-card p-6 max-w-4xl mx-auto relative overflow-hidden">
      {/* Soccer ball pattern background */}
      <div className="absolute inset-0 soccer-ball"></div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            {t("search.centre")}
          </label>
          <Select value={centre} onValueChange={setCentre}>
            <SelectTrigger className="border-blue-200 focus:border-blue-500">
              <SelectValue placeholder={t("search.chooseCentre")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("search.allCentres")}</SelectItem>
              <SelectItem value="casablanca-centre">{t("search.centres.casablancaCentre")}</SelectItem>
              <SelectItem value="casablanca-maarif">{t("search.centres.casablancaMaarif")}</SelectItem>
              <SelectItem value="rabat-agdal">{t("search.centres.rabatAgdal")}</SelectItem>
              <SelectItem value="marrakech-gueliz">{t("search.centres.marrakechGueliz")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            {t("search.fieldType")}
          </label>
          <Select value={terrain} onValueChange={setTerrain}>
            <SelectTrigger className="border-blue-200 focus:border-blue-500">
              <SelectValue placeholder={t("search.fieldType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("search.allTypes")}</SelectItem>
              <SelectItem value="foot5">{t("search.fieldTypes.foot5")}</SelectItem>
              <SelectItem value="foot7">{t("search.fieldTypes.foot7")}</SelectItem>
              <SelectItem value="foot11">{t("search.fieldTypes.foot11")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            {t("search.date")}
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="w-full border-blue-200 focus:border-blue-500"
          />
        </div>

        <Button 
          onClick={handleSearch}
          className="academy-button h-10 relative overflow-hidden group"
        >
          <span className="relative z-10">{t("search.viewAvailability")}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
