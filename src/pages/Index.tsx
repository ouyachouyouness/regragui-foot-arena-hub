
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-green-900 text-white min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1993&q=80')"
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Réserve ton terrain.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-500">
                Joue comme un pro.
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-fade-in">
              L'académie de football moderne qui révolutionne l'entraînement au Maroc
            </p>
            
            {/* Search Bar */}
            <div className="mb-8 animate-scale-in">
              <SearchBar />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                <Link to="/reservation">Réserver maintenant</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-black">
                <Link to="/abonnements">Découvrir les abonnements</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pourquoi choisir Regragui Football ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une expérience de football unique avec des installations modernes et un encadrement professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover-scale group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">⚽</span>
                </div>
                <CardTitle>Terrains Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Terrains en gazon synthétique de dernière génération, éclairage LED professionnel
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🏆</span>
                </div>
                <CardTitle>Encadrement Pro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Entraîneurs diplômés et expérimentés pour développer vos compétences
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📱</span>
                </div>
                <CardTitle>Réservation Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Réservez en quelques clics, gérez vos abonnements et suivez vos progrès
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-gray-400">Joueurs actifs</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">5</div>
              <div className="text-gray-400">Terrains disponibles</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Ouvert tous les jours</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">95%</div>
              <div className="text-gray-400">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez la communauté Regragui Football et vivez votre passion du football autrement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link to="/reservation">Réserver un terrain</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
