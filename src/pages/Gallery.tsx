import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { 
  Play, 
  Search, 
  Instagram, 
  Calendar, 
  Filter,
  Grid,
  Camera,
  Trophy,
  Users,
  Heart,
  Share2,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react';

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  date: string;
  likes?: number;
  isNew?: boolean;
}

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ photos: 0, tournaments: 0, matches: 0, followers: 0 });
  const isArabic = i18n.language === 'ar';

  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      type: "image",
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Terrain Alpha - Vue panoramique",
      titleAr: "الملعب ألفا - منظر بانورامي",
      description: "Notre terrain principal avec gazon synthétique de dernière génération",
      descriptionAr: "ملعبنا الرئيسي بالعشب الاصطناعي من آخر جيل",
      category: "terrains",
      date: "2024-01-15",
      likes: 245,
      isNew: true
    },
    {
      id: "2",
      type: "image",
      url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Match de championnat",
      titleAr: "ماتش البطولة",
      description: "Finale du tournoi inter-entreprises",
      descriptionAr: "نهائي البطولة بين الشركات",
      category: "tournois",
      date: "2024-01-20",
      likes: 189
    },
    {
      id: "3",
      type: "video",
      url: "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Entraînement jeunes",
      titleAr: "تدريب الشباب",
      description: "Séance d'entraînement avec nos coachs diplômés",
      descriptionAr: "جلسة تدريب مع مدربينا المتخرجين",
      category: "entrainements",
      date: "2024-01-18",
      likes: 156,
      isNew: true
    },
    {
      id: "4",
      type: "image",
      url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Vestiaires modernes",
      titleAr: "غرف تبديل عصرية",
      description: "Nos installations pour le confort des joueurs",
      descriptionAr: "تجهيزاتنا لراحة اللاعبين",
      category: "installations",
      date: "2024-01-10",
      likes: 98
    },
    {
      id: "5",
      type: "image",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Équipe championne",
      titleAr: "الفريق البطل",
      description: "Remise des trophées du tournoi mensuel",
      descriptionAr: "تسليم كؤوس البطولة الشهرية",
      category: "tournois",
      date: "2024-01-25",
      likes: 312
    },
    {
      id: "6",
      type: "image",
      url: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Éclairage nocturne",
      titleAr: "إضاءة ليلية",
      description: "Nos terrains illuminés pour les matchs en soirée",
      descriptionAr: "ملاعبنا المضاءة للمباريات المسائية",
      category: "terrains",
      date: "2024-01-12",
      likes: 167
    }
  ];

  const categories = [
    { 
      id: "all", 
      label: isArabic ? "شوف الكل" : "Tout voir", 
      labelAr: "شوف الكل",
      icon: "🌟", 
      count: galleryItems.length 
    },
    { 
      id: "terrains", 
      label: isArabic ? "الملاعب" : "Terrains", 
      labelAr: "الملاعب",
      icon: "⚽", 
      count: galleryItems.filter(item => item.category === "terrains").length 
    },
    { 
      id: "tournois", 
      label: isArabic ? "البطولات" : "Tournois", 
      labelAr: "البطولات",
      icon: "🏆", 
      count: galleryItems.filter(item => item.category === "tournois").length 
    },
    { 
      id: "entrainements", 
      label: isArabic ? "التدريبات" : "Entraînements", 
      labelAr: "التدريبات",
      icon: "🎯", 
      count: galleryItems.filter(item => item.category === "entrainements").length 
    },
    { 
      id: "installations", 
      label: isArabic ? "التجهيزات" : "Installations", 
      labelAr: "التجهيزات",
      icon: "🏢", 
      count: galleryItems.filter(item => item.category === "installations").length 
    },
    { 
      id: "videos", 
      label: isArabic ? "الفيديوهات" : "Vidéos", 
      labelAr: "الفيديوهات",
      icon: "📹", 
      count: galleryItems.filter(item => item.type === "video").length 
    },
  ];

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : selectedCategory === "videos"
    ? galleryItems.filter(item => item.type === "video")
    : galleryItems.filter(item => item.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "likes") {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0;
  });

  // Animate stats on mount
  useEffect(() => {
    const targets = { photos: 150, tournaments: 25, matches: 500, followers: 5000 };
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        photos: Math.floor(targets.photos * progress),
        tournaments: Math.floor(targets.tournaments * progress),
        matches: Math.floor(targets.matches * progress),
        followers: Math.floor(targets.followers * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const openLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
    setCurrentImageIndex(sortedItems.findIndex(i => i.id === item.id));
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % sortedItems.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(sortedItems[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? sortedItems.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(sortedItems[prevIndex]);
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

  const GradientButton = ({ children, variant = "primary", className = "", active = false, ...props }) => {
    const variants = {
      primary: "bg-gradient-to-r from-[#0033A1] to-[#3366CC] hover:from-[#001a5c] hover:to-[#0033A1] text-white shadow-lg hover:shadow-xl",
      secondary: "bg-gradient-to-r from-[#FFCC00] to-[#FFD700] hover:from-[#e6b800] hover:to-[#FFCC00] text-[#0033A1] shadow-lg hover:shadow-xl",
      outline: `border-2 ${active ? 'border-[#0033A1] bg-[#0033A1] text-white' : 'border-gray-200 hover:border-[#0033A1] text-gray-700 hover:text-[#0033A1]'} bg-white hover:shadow-lg`,
    };
    
    return (
      <button 
        className={`
          inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all duration-300 
          transform hover:scale-105 active:scale-95
          ${variants[variant]} ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Hero Section with Background */}
      <section className="relative min-h-[60vh] overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          <div className="relative h-full">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0033A1]/90 via-[#001a5c]/80 to-[#0033A1]/90"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-16 h-16 text-white/20 animate-bounce">📸</div>
          <div className="absolute bottom-32 right-20 w-20 h-20 text-[#FFCC00]/30 animate-pulse">🏆</div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 text-white/15 animate-spin">⚽</div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="animate-in fade-in duration-1000">
                <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                  {isArabic ? "معرض الصور" : "Galerie"}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC00] to-[#FFD700]">
                    {isArabic ? "و الفيديوهات" : "& Vidéos"}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 font-medium">
                  {isArabic 
                    ? "اكتشف التجهيزات ديالنا، البطولات والجو الفريد ديال أكاديمية رقراقي"
                    : "Découvrez nos installations, nos tournois et l'ambiance unique de Regragui Football Academy"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section Enhanced */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <PremiumCard 
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white cursor-pointer group hover:scale-105 transition-all duration-500"
            hover={false}
          >
            <a 
              href="https://www.instagram.com/regragui_foot/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-8 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold">
                    {isArabic ? "تابعونا على إنستغرام" : "Suivez-nous sur Instagram"}
                  </h2>
                  <p className="text-purple-100">@regragui_foot • 5K+ followers</p>
                </div>
              </div>
              <p className="text-lg text-purple-100 mb-6">
                {isArabic 
                  ? "لقاو كاع الأخبار، الصور والفيديوهات فالوقت الحقيقي"
                  : "Retrouvez toutes nos actualités, photos et vidéos en temps réel"
                }
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full group-hover:bg-white/30 transition-colors">
                <span className="font-bold">{isArabic ? "زوروا الصفحة" : "Visiter la page"}</span>
                <Share2 className="w-5 h-5" />
              </div>
            </a>
          </PremiumCard>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {categories.map((category) => (
              <GradientButton
                key={category.id}
                variant="outline"
                active={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{category.icon}</span>
                <span>{category.label}</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  {category.count}
                </Badge>
              </GradientButton>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-gray-600">
              <span className="font-semibold">{filteredItems.length}</span> {isArabic ? "عنصر" : "éléments"}
              {selectedCategory !== "all" && (
                <span className="ml-2">
                  • {isArabic ? "تصفية:" : "Filtré par:"} {categories.find(c => c.id === selectedCategory)?.label}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0033A1] transition-colors"
              >
                <option value="date">{isArabic ? "الأحدث" : "Plus récent"}</option>
                <option value="likes">{isArabic ? "الأكثر إعجاباً" : "Plus aimé"}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item, index) => (
              <PremiumCard 
                key={item.id} 
                className="group cursor-pointer animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => openLightbox(item)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.url}
                    alt={isArabic ? item.titleAr || item.title : item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          {item.type === "video" ? (
                            <Play className="w-8 h-8" />
                          ) : (
                            <Search className="w-8 h-8" />
                          )}
                          <span className="font-bold">{isArabic ? "عرض" : "Voir"}</span>
                        </div>
                        {item.likes && (
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            <span className="text-sm">{item.likes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {item.type === "video" && (
                      <Badge className="bg-red-500 text-white">
                        <Play className="w-3 h-3 mr-1" />
                        {isArabic ? "فيديو" : "Vidéo"}
                      </Badge>
                    )}
                    {item.isNew && (
                      <Badge className="bg-green-500 text-white">
                        {isArabic ? "جديد" : "Nouveau"}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-[#0033A1] line-clamp-2">
                    {isArabic ? item.titleAr || item.title : item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {isArabic ? item.descriptionAr || item.description : item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-[#0033A1] text-[#0033A1]">
                      {categories.find(c => c.id === item.category)?.icon} {categories.find(c => c.id === item.category)?.label}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString(isArabic ? 'ar-MA' : 'fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Enhanced */}
      <section className="py-16 bg-gradient-to-r from-[#0033A1] to-[#001a5c] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {isArabic ? "إحصائيات المعرض" : "Statistiques de la galerie"}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { 
                value: animatedStats.photos, 
                suffix: "+", 
                label: isArabic ? "صور مشاركة" : "Photos partagées", 
                icon: "📸",
                color: "text-[#FFCC00]" 
              },
              { 
                value: animatedStats.tournaments, 
                suffix: "", 
                label: isArabic ? "بطولات منظمة" : "Tournois organisés", 
                icon: "🏆",
                color: "text-yellow-400" 
              },
              { 
                value: animatedStats.matches, 
                suffix: "+", 
                label: isArabic ? "مباريات ملعوبة" : "Matchs joués", 
                icon: "⚽",
                color: "text-green-400" 
              },
              { 
                value: animatedStats.followers, 
                suffix: "+", 
                label: isArabic ? "متابعين إنستغرام" : "Followers Instagram", 
                icon: "👥",
                color: "text-pink-400" 
              }
            ].map((stat, index) => (
              <PremiumCard key={index} className="p-6 text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={selectedImage.url}
              alt={isArabic ? selectedImage.titleAr || selectedImage.title : selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">
                {isArabic ? selectedImage.titleAr || selectedImage.title : selectedImage.title}
              </h3>
              <p className="text-gray-300 mb-3">
                {isArabic ? selectedImage.descriptionAr || selectedImage.description : selectedImage.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{currentImageIndex + 1} / {sortedItems.length}</span>
                <span>•</span>
                <span>{new Date(selectedImage.date).toLocaleDateString(isArabic ? 'ar-MA' : 'fr-FR')}</span>
                {selectedImage.likes && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      <span>{selectedImage.likes}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;