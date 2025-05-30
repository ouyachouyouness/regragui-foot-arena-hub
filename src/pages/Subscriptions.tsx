
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  name: string;
  description: string;
  matches: number;
  players: string;
  price: number;
  originalPrice?: number;
  features: string[];
  popular?: boolean;
  color: string;
}

const Subscriptions = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const subscriptions: Subscription[] = [
    {
      id: "starter",
      name: "Starter",
      description: "Parfait pour débuter",
      matches: 4,
      players: "4-6 joueurs",
      price: 600,
      originalPrice: 800,
      color: "from-blue-500 to-blue-600",
      features: [
        "4 matchs de 1h",
        "Terrains football à 5",
        "Support client",
        "Réservation flexible",
      ]
    },
    {
      id: "premium",
      name: "Premium",
      description: "Le plus populaire",
      matches: 8,
      players: "6-10 joueurs",
      price: 1100,
      originalPrice: 1600,
      popular: true,
      color: "from-green-500 to-green-600",
      features: [
        "8 matchs de 1h",
        "Tous types de terrains",
        "Support prioritaire",
        "Réservation flexible",
        "1 match bonus offert",
        "Vestiaires premium",
      ]
    },
    {
      id: "elite",
      name: "Elite",
      description: "Pour les équipes régulières",
      matches: 12,
      players: "8-12 joueurs",
      price: 1500,
      originalPrice: 2400,
      color: "from-orange-500 to-orange-600",
      features: [
        "12 matchs de 1h",
        "Tous types de terrains",
        "Coach personnel",
        "Support 24/7",
        "Réservation prioritaire",
        "3 matchs bonus offerts",
        "Vestiaires VIP",
        "Analyse de performance",
      ]
    }
  ];

  const handleSubscribe = async (subscription: Subscription) => {
    setIsLoading(subscription.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Abonnement souscrit !",
      description: `Vous avez souscrit à l'abonnement ${subscription.name}. Vous recevrez un email de confirmation.`,
    });
    
    setIsLoading(null);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Abonnements</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez l'abonnement qui correspond à vos besoins et économisez sur vos réservations
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptions.map((sub) => (
            <Card 
              key={sub.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                sub.popular ? 'ring-2 ring-green-500 shadow-lg' : ''
              }`}
            >
              {sub.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className={`bg-gradient-to-r ${sub.color} text-white text-center py-2 text-sm font-semibold`}>
                    🔥 Le plus populaire
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center ${sub.popular ? 'pt-12' : 'pt-6'}`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${sub.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <span className="text-2xl text-white font-bold">{sub.matches}</span>
                </div>
                <CardTitle className="text-2xl">{sub.name}</CardTitle>
                <CardDescription className="text-lg">{sub.description}</CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {sub.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">{sub.originalPrice} DH</span>
                    )}
                    <span className="text-3xl font-bold text-gray-900">{sub.price} DH</span>
                  </div>
                  <div className="text-sm text-gray-600">{sub.players}</div>
                  {sub.originalPrice && (
                    <Badge variant="secondary" className="mt-2">
                      Économisez {sub.originalPrice - sub.price} DH
                    </Badge>
                  )}
                </div>

                <ul className="space-y-3 mb-8 text-left">
                  {sub.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handleSubscribe(sub)}
                  disabled={isLoading === sub.id}
                  className={`w-full bg-gradient-to-r ${sub.color} hover:opacity-90 transition-opacity`}
                >
                  {isLoading === sub.id ? "Traitement..." : "Choisir cet abonnement"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Questions Fréquentes</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment utiliser mon abonnement ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Une fois votre abonnement activé, vous pouvez réserver vos créneaux directement sur notre plateforme. 
                  Chaque réservation décompte un match de votre forfait.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quelle est la durée de validité ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tous nos abonnements sont valides 6 mois à partir de la date d'achat. 
                  Vous avez donc largement le temps d'utiliser tous vos matchs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je partager mon abonnement ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui ! Votre abonnement peut être utilisé pour différents groupes de joueurs. 
                  Seul le nombre total de matchs est limité.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Que se passe-t-il si j'annule ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vous pouvez annuler votre réservation jusqu'à 24h à l'avance sans perdre votre crédit. 
                  En cas d'annulation tardive, le match sera décompté.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-green-600 to-orange-600 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Besoin d'aide pour choisir ?</h2>
          <p className="mb-6">Notre équipe est là pour vous conseiller l'abonnement qui vous convient le mieux</p>
          <Button className="bg-white text-green-600 hover:bg-gray-100">
            Nous contacter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
