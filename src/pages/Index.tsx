
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative academy-gradient text-white min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/70"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1993&q=80')"
          }}
        ></div>
        
        {/* Soccer ball decorations */}
        <div className="absolute top-20 left-10 w-16 h-16 text-white/10 animate-pulse">
          ⚽
        </div>
        <div className="absolute bottom-32 right-20 w-20 h-20 text-yellow-400/20 animate-bounce">
          🏆
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 p-2 animate-scale-in">
                <img 
                  src="/lovable-uploads/6cd8582e-05fb-4fa1-966c-c8ae4e53368e.png" 
                  alt="Regragui Football Academy" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t("home.hero.title")}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                {t("home.hero.subtitle")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-200 animate-fade-in">
              {t("home.hero.description")}
            </p>
            
            {/* Search Bar */}
            <div className="mb-8 animate-scale-in">
              <SearchBar />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button asChild size="lg" className="academy-button text-lg px-8 py-6">
                <Link to="/reservation">{t("home.hero.reserveNow")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900">
                <Link to="/abonnements">{t("home.hero.discoverSubscriptions")}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-yellow-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 soccer-ball"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="relative inline-block laurel-decoration">
              <h2 className="text-4xl font-bold mb-4 text-blue-900">{t("home.features.title")}</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("home.features.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="academy-card text-center hover-scale group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">⚽</span>
                </div>
                <CardTitle className="text-blue-900">{t("home.features.premiumFields")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {t("home.features.premiumFieldsDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="academy-card text-center hover-scale group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🏆</span>
                </div>
                <CardTitle className="text-blue-900">{t("home.features.proCoaching")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {t("home.features.proCoachingDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="academy-card text-center hover-scale group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📱</span>
                </div>
                <CardTitle className="text-blue-900">{t("home.features.easyBooking")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {t("home.features.easyBookingDesc")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 academy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 soccer-ball"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">1000+</div>
              <div className="text-blue-200">{t("home.stats.activePlayers")}</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">5</div>
              <div className="text-blue-200">{t("home.stats.availableFields")}</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-blue-200">{t("home.stats.openAllTime")}</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">95%</div>
              <div className="text-blue-200">{t("home.stats.satisfaction")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">{t("home.cta.title")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t("home.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-900 text-white hover:bg-blue-800 font-semibold px-8 py-6">
              <Link to="/reservation">{t("home.cta.bookField")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-semibold px-8 py-6">
              <Link to="/contact">{t("home.cta.contactUs")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
