
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      type: "image",
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Terrain Alpha - Vue panoramique",
      description: "Notre terrain principal avec gazon synthétique de dernière génération",
      category: "terrains",
      date: "2024-01-15"
    },
    {
      id: "2",
      type: "image",
      url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Match de championnat",
      description: "Finale du tournoi inter-entreprises",
      category: "tournois",
      date: "2024-01-20"
    },
    {
      id: "3",
      type: "image",
      url: "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Entraînement jeunes",
      description: "Séance d'entraînement avec nos coachs diplômés",
      category: "entrainements",
      date: "2024-01-18"
    },
    {
      id: "4",
      type: "image",
      url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Vestiaires modernes",
      description: "Nos installations pour le confort des joueurs",
      category: "installations",
      date: "2024-01-10"
    },
    {
      id: "5",
      type: "image",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Équipe championne",
      description: "Remise des trophées du tournoi mensuel",
      category: "tournois",
      date: "2024-01-25"
    },
    {
      id: "6",
      type: "image",
      url: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Éclairage nocturne",
      description: "Nos terrains illuminés pour les matchs en soirée",
      category: "terrains",
      date: "2024-01-12"
    }
  ];

  const categories = [
    { id: "all", label: "Tout voir", count: galleryItems.length },
    { id: "terrains", label: "Terrains", count: galleryItems.filter(item => item.category === "terrains").length },
    { id: "tournois", label: "Tournois", count: galleryItems.filter(item => item.category === "tournois").length },
    { id: "entrainements", label: "Entraînements", count: galleryItems.filter(item => item.category === "entrainements").length },
    { id: "installations", label: "Installations", count: galleryItems.filter(item => item.category === "installations").length },
  ];

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Galerie</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos installations, nos tournois et l'ambiance unique de Regragui Football Academy
          </p>
        </div>

        {/* Instagram Feed Integration */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Suivez-nous sur Instagram</h2>
          <p className="mb-4">Retrouvez toutes nos actualités, photos et vidéos en temps réel</p>
          <Button asChild className="bg-white text-purple-600 hover:bg-gray-100">
            <a 
              href="https://www.instagram.com/regragui_foot/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @regragui_foot
            </a>
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "hover:bg-green-50"
              }`}
            >
              {category.label}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-scale group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.type === "video" ? (
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">▶️</span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🔍</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{item.category}</Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
            <div className="text-gray-600">Photos partagées</div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-600 mb-2">25</div>
            <div className="text-gray-600">Tournois organisés</div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Matchs joués</div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-600 mb-2">5K+</div>
            <div className="text-gray-600">Followers Instagram</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
