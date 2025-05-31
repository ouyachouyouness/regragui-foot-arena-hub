import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { 
  Clock, 
  Users, 
  Star, 
  Check, 
  Zap, 
  Trophy, 
  Shield, 
  Gift,
  MapPin,
  Calendar,
  Loader2,
  ChevronRight,
  Info
} from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  hours: number;
  price: number;
  pricePerHour: number;
  features: string[];
  featuresAr: string[];
  popular?: boolean;
  bestValue?: boolean;
  color: string;
  icon: string;
}

const Subscriptions = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const isArabic = i18n.language === 'ar';

  // Real subscription plans based on the flyer
  const subscriptions: Subscription[] = [
    {
      id: "starter",
      name: "Pack Starter",
      nameAr: "باقة المبتدئين",
      description: "Parfait pour découvrir l'académie",
      descriptionAr: "مثالي لاكتشاف الأكاديمية",
      hours: 4,
      price: 750,
      pricePerHour: 187.5,
      color: "from-[#0033A1] to-[#3366CC]",
      icon: "⚽",
      features: [
        "4 heures de jeu",
        "Tous types de terrains",
        "Réservation flexible",
        "Support client",
        "Vestiaires standards"
      ],
      featuresAr: [
        "4 ساعات لعب",
        "جميع أنواع الملاعب",
        "حجز مرن",
        "دعم العملاء",
        "غرف تبديل عادية"
      ]
    },
    {
      id: "premium",
      name: "Pack Premium",
      nameAr: "باقة بريميوم",
      description: "Le plus populaire - Excellent rapport qualité/prix",
      descriptionAr: "الأكثر شعبية - أفضل قيمة مقابل السعر",
      hours: 8,
      price: 1500,
      pricePerHour: 187.5,
      color: "from-[#FFCC00] to-[#FFD700]",
      icon: "🏆",
      popular: true,
      bestValue: true,
      features: [
        "8 heures de jeu",
        "Tous types de terrains",
        "Réservation prioritaire",
        "Support prioritaire",
        "Vestiaires premium",
        "1 boisson offerte"
      ],
      featuresAr: [
        "8 ساعات لعب",
        "جميع أنواع الملاعب",
        "حجز بالأولوية",
        "دعم بالأولوية",
        "غرف تبديل ممتازة",
        "مشروب مجاني"
      ]
    },
    {
      id: "pro",
      name: "Pack Pro",
      nameAr: "باقة برو",
      description: "Pour les joueurs réguliers",
      descriptionAr: "للاعبين المنتظمين",
      hours: 10,
      price: 1600,
      pricePerHour: 160,
      color: "from-green-500 to-green-600",
      icon: "💎",
      features: [
        "10 heures de jeu",
        "Tous types de terrains",
        "Réservation prioritaire",
        "Support 24/7",
        "Vestiaires VIP",
        "Analyse de performance",
        "Coach occasionnel"
      ],
      featuresAr: [
        "10 ساعات لعب",
        "جميع أنواع الملاعب",
        "حجز بالأولوية",
        "دعم 24/7",
        "غرف تبديل VIP",
        "تحليل الأداء",
        "مدرب أحياناً"
      ]
    },
    {
      id: "elite",
      name: "Pack Elite",
      nameAr: "باقة النخبة",
      description: "L'expérience ultime pour les passionnés",
      descriptionAr: "التجربة المثلى للمتحمسين",
      hours: 12,
      price: 1750,
      pricePerHour: 145.8,
      color: "from-purple-500 to-purple-600",
      icon: "👑",
      features: [
        "12 heures de jeu",
        "Tous types de terrains",
        "Réservation VIP",
        "Support dédié 24/7",
        "Vestiaires privés",
        "Coach personnel",
        "Analyse complète",
        "Équipements premium"
      ],
      featuresAr: [
        "12 ساعة لعب",
        "جميع أنواع الملاعب",
        "حجز VIP",
        "دعم مخصص 24/7",
        "غرف تبديل خاصة",
        "مدرب شخصي",
        "تحليل شامل",
        "معدات ممتازة"
      ]
    }
  ];

  const handleSubscribe = async (subscription: Subscription) => {
    setIsLoading(subscription.id);
    setSelectedPlan(subscription.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: isArabic ? "تم الاشتراك!" : "Abonnement souscrit !",
      description: isArabic 
        ? `لقد اشتركت في ${subscription.nameAr}. ستتلقى رسالة تأكيد.`
        : `Vous avez souscrit à l'abonnement ${subscription.name}. Vous recevrez un email de confirmation.`,
    });
    
    setIsLoading(null);
    setSelectedPlan(null);
  };

  const PremiumCard = ({ children, className = "", hover = true }) => (
    <div className={`
      bg-white rounded-2xl border border-gray-100 shadow-lg 
      ${hover ? 'hover:shadow-2xl hover:-translate-y-2' : ''} 
      transition-all duration-500 overflow-hidden backdrop-blur-sm
      ${className}
    `}>
      {children}
    </div>
  );

  const GradientButton = ({ children, variant = "primary", className = "", disabled, ...props }) => {
    const variants = {
      primary: "bg-gradient-to-r from-[#0033A1] to-[#3366CC] hover:from-[#001a5c] hover:to-[#0033A1] text-white shadow-lg hover:shadow-xl",
      secondary: "bg-gradient-to-r from-[#FFCC00] to-[#FFD700] hover:from-[#e6b800] hover:to-[#FFCC00] text-[#0033A1] shadow-lg hover:shadow-xl",
      outline: "border-2 border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white bg-white",
    };
    
    return (
      <button 
        className={`
          inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl transition-all duration-300 
          transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${variants[variant]} ${className}
        `}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0033A1] via-[#001a5c] to-[#0033A1] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 transform rotate-12 scale-150">
            {Array.from({length: 32}).map((_, i) => (
              <div key={i} className="text-4xl animate-pulse">⚽</div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              {isArabic ? "باقات الاشتراك" : "Nos Abonnements"}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-medium">
              {isArabic 
                ? "اختر الباقة التي تناسب احتياجاتك ووفر في حجوزاتك"
                : "Choisissez l'abonnement qui correspond à vos besoins et économisez sur vos réservations"
              }
            </p>
          </div>

          {/* Important Notice */}
          <PremiumCard className="max-w-4xl mx-auto p-6 bg-white/95 backdrop-blur-md mb-8">
            <div className="flex items-center gap-3 text-[#0033A1]">
              <Info className="w-6 h-6 flex-shrink-0" />
              <p className="font-semibold">
                {isArabic 
                  ? "الساعات قابلة للاستخدام بحرية دون حد زمني للأيام - صالحة 6 أشهر"
                  : "Les heures sont à utiliser librement sans limite de jour - Validité 6 mois"
                }
              </p>
            </div>
          </PremiumCard>
        </div>
      </section>

      {/* Subscription Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {subscriptions.map((sub, index) => (
              <PremiumCard 
                key={sub.id} 
                className={`relative ${
                  sub.popular ? 'ring-4 ring-[#FFCC00] lg:scale-110' : ''
                } ${selectedPlan === sub.id ? 'ring-2 ring-[#0033A1]' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {sub.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 {isArabic ? "الأكثر شعبية" : "Le plus populaire"}
                    </div>
                  </div>
                )}

                {sub.bestValue && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                      <Gift className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <CardHeader className={`text-center pb-4 ${sub.popular ? 'pt-8' : 'pt-6'}`}>
                  <div className={`w-20 h-20 bg-gradient-to-r ${sub.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform`}>
                    {sub.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-[#0033A1] mb-2">
                    {isArabic ? sub.nameAr : sub.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 font-medium">
                    {isArabic ? sub.descriptionAr : sub.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center px-6 pb-6">
                  {/* Pricing */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                    <div className="text-4xl font-black text-[#0033A1] mb-2">
                      {sub.price} <span className="text-lg text-gray-500">DH</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {isArabic ? `${sub.hours} ساعات` : `${sub.hours} heures`}
                    </div>
                    <div className="text-xs text-green-600 font-bold">
                      {sub.pricePerHour.toFixed(1)} DH/{isArabic ? 'ساعة' : 'heure'}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 text-left">
                    {(isArabic ? sub.featuresAr : sub.features).map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <GradientButton 
                    onClick={() => handleSubscribe(sub)}
                    disabled={isLoading === sub.id}
                    className={`w-full ${sub.popular ? 'from-[#FFCC00] to-[#FFD700] text-[#0033A1]' : ''}`}
                  >
                    {isLoading === sub.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isArabic ? "جارٍ المعالجة..." : "Traitement..."}
                      </>
                    ) : (
                      <>
                        {isArabic ? "اختيار هذه الباقة" : "Choisir cet abonnement"}
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </GradientButton>
                </CardContent>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0033A1] mb-4">
              {isArabic ? "مقارنة الباقات" : "Comparaison des formules"}
            </h2>
            <p className="text-xl text-gray-600">
              {isArabic ? "اختر الباقة المثالية لك" : "Trouvez la formule parfaite pour vous"}
            </p>
          </div>

          <PremiumCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#0033A1] to-[#3366CC] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">
                      {isArabic ? "الباقة" : "Formule"}
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      {isArabic ? "الساعات" : "Heures"}
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      {isArabic ? "السعر" : "Prix"}
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      {isArabic ? "السعر/ساعة" : "Prix/heure"}
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      {isArabic ? "الوفورات" : "Économies"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub, index) => (
                    <tr key={sub.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${sub.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                            {sub.icon}
                          </div>
                          <div>
                            <div className="font-bold text-[#0033A1]">
                              {isArabic ? sub.nameAr : sub.name}
                            </div>
                            {sub.popular && (
                              <Badge variant="secondary" className="text-xs bg-[#FFCC00] text-[#0033A1]">
                                {isArabic ? "شعبي" : "Populaire"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-lg">
                        {sub.hours}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-lg text-[#0033A1]">
                        {sub.price} DH
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {sub.pricePerHour.toFixed(1)} DH
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sub.hours >= 8 && (
                          <span className="text-green-600 font-bold">
                            {isArabic ? "وفر" : "Économisez"} {((200 * sub.hours) - sub.price)} DH
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PremiumCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#0033A1]">
              {isArabic ? "أسئلة متكررة" : "Questions Fréquentes"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: isArabic ? "كيف أستخدم اشتراكي؟" : "Comment utiliser mon abonnement ?",
                  answer: isArabic 
                    ? "بمجرد تفعيل اشتراكك، يمكنك حجز الملاعب مباشرة على منصتنا. كل حجز يخصم ساعة من باقتك."
                    : "Une fois votre abonnement activé, vous pouvez réserver vos créneaux directement sur notre plateforme. Chaque réservation décompte une heure de votre forfait."
                },
                {
                  question: isArabic ? "ما هي مدة الصلاحية؟" : "Quelle est la durée de validité ?",
                  answer: isArabic 
                    ? "جميع اشتراكاتنا صالحة لمدة 6 أشهر من تاريخ الشراء."
                    : "Tous nos abonnements sont valides 6 mois à partir de la date d'achat."
                },
                {
                  question: isArabic ? "هل يمكنني مشاركة اشتراكي؟" : "Puis-je partager mon abonnement ?",
                  answer: isArabic 
                    ? "نعم! يمكن استخدام اشتراكك لمجموعات مختلفة من اللاعبين."
                    : "Oui ! Votre abonnement peut être utilisé pour différents groupes de joueurs."
                },
                {
                  question: isArabic ? "ماذا لو ألغيت؟" : "Que se passe-t-il si j'annule ?",
                  answer: isArabic 
                    ? "يمكنك إلغاء حجزك حتى 24 ساعة مقدماً دون فقدان رصيدك."
                    : "Vous pouvez annuler votre réservation jusqu'à 24h à l'avance sans perdre votre crédit."
                }
              ].map((faq, index) => (
                <PremiumCard key={index} className="p-6 hover:shadow-xl">
                  <h3 className="font-bold text-lg text-[#0033A1] mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#FFCC00] rounded-full flex items-center justify-center text-[#0033A1] text-sm font-bold">
                      ?
                    </div>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </PremiumCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FFCC00] via-[#FFD700] to-[#FFCC00] text-[#0033A1]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {isArabic ? "محتاج مساعدة في الاختيار؟" : "Besoin d'aide pour choisir ?"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-medium">
            {isArabic 
              ? "فريقنا هنا لمساعدتك في اختيار الاشتراك المناسب لك"
              : "Notre équipe est là pour vous conseiller l'abonnement qui vous convient le mieux"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton className="bg-[#0033A1] text-white hover:bg-[#001a5c]">
              <Users className="w-5 h-5" />
              {isArabic ? "تواصل معنا" : "Nous contacter"}
            </GradientButton>
            <GradientButton variant="outline" className="border-[#0033A1] text-[#0033A1] hover:bg-[#0033A1] hover:text-white">
              <MapPin className="w-5 h-5" />
              {isArabic ? "زيارة الأكاديمية" : "Visiter l'académie"}
            </GradientButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;