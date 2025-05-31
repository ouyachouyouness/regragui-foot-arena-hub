import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Phone, MessageSquare, MapPin, Clock, ChevronDown, Check, X, Send, ExternalLink } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validation, setValidation] = useState({
    name: null,
    email: null,
    phone: null,
    subject: null,
    message: null
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [language, setLanguage] = useState('fr'); // fr ou ar

  const translations = {
    fr: {
      title: "Contactez-nous",
      subtitle: "Une question ? Une demande particulière ? Notre équipe est là pour vous accompagner",
      sendMessage: "Envoyez-nous un message",
      formDesc: "Remplissez le formulaire ci-dessous et nous vous répondrons rapidement",
      fullName: "Nom complet",
      phone: "Téléphone",
      email: "Email",
      subject: "Sujet",
      message: "Message",
      sendButton: "Envoyer le message",
      sending: "Envoi en cours...",
      address: "Adresse",
      hours: "Horaires",
      location: "Localisation",
      locationDesc: "Trouvez-nous facilement grâce à cette carte",
      callNow: "Appeler maintenant",
      whatsapp: "WhatsApp",
      directions: "Itinéraire",
      faq: "Questions Fréquentes",
      support247: "Support 7j/7",
      successTitle: "Message envoyé avec succès !",
      successDesc: "Nous vous répondrons dans les plus brefs délais.",
      required: "requis"
    },
    ar: {
      title: "تواصل معانا",
      subtitle: "عندك سؤال؟ طلب خاص؟ الفريق ديالنا هنا باش يساعدك",
      sendMessage: "بعت لينا رسالة",
      formDesc: "عمر الاستمارة وغنجاوبك بسرعة",
      fullName: "الاسم الكامل",
      phone: "تليفون",
      email: "إيميل",
      subject: "الموضوع",
      message: "الرسالة",
      sendButton: "صيفط الرسالة",
      sending: "كيتصيفط...",
      address: "العنوان",
      hours: "أوقات العمل",
      location: "الموقع",
      locationDesc: "لقانا بسهولة بهاد الخريطة",
      callNow: "اتصل دابا",
      whatsapp: "واتساب",
      directions: "الطريق",
      faq: "الأسئلة المتكررة",
      support247: "دعم 7أيام/7",
      successTitle: "تصيفطت الرسالة بنجاح!",
      successDesc: "غنجاوبك فأقرب وقت.",
      required: "مطلوب"
    }
  };

  const t = translations[language];

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length >= 2 ? 'valid' : value.length > 0 ? 'invalid' : null;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? 'valid' : value.length > 0 ? 'invalid' : null;
      case 'phone':
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(value) ? 'valid' : value.length > 0 ? 'invalid' : null;
      case 'subject':
        return value.length >= 3 ? 'valid' : value.length > 0 ? 'invalid' : null;
      case 'message':
        return value.length >= 10 ? 'valid' : value.length > 0 ? 'invalid' : null;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);

    toast({
      title: t.successTitle,
      description: t.successDesc,
    });

    setIsSubmitting(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    setValidation({
      name: null,
      email: null,
      phone: null,
      subject: null,
      message: null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidation(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      question: language === 'fr' ? "Quels sont vos tarifs ?" : "شنو هي الأسعار ديالكم؟",
      answer: language === 'fr' 
        ? "Nos tarifs varient selon l'heure et le type de terrain. Consultez notre page réservation pour plus de détails."
        : "الأسعار كتختلف حسب الوقت ونوع الملعب. شوف صفحة الحجز باش تعرف التفاصيل."
    },
    {
      question: language === 'fr' ? "Peut-on annuler une réservation ?" : "واش يمكن نلغي الحجز؟",
      answer: language === 'fr'
        ? "Oui, vous pouvez annuler jusqu'à 24h avant votre créneau sans frais. Au-delà, des frais peuvent s'appliquer."
        : "أيه، يمكن تلغي قبل 24 ساعة بلا مصاريف. بعد هاد الوقت، كتكون مصاريف."
    },
    {
      question: language === 'fr' ? "Fournissez-vous le matériel ?" : "واش كتوفرو المعدات؟",
      answer: language === 'fr'
        ? "Nous fournissons les ballons et les chasubles. N'oubliez pas vos chaussures de foot et votre équipement personnel."
        : "كنوفرو الكرة والجلابات. ما تنساش الحذاء ديالك والمعدات الشخصية."
    },
    {
      question: language === 'fr' ? "Y a-t-il un parking ?" : "واش كاين باركينغ؟",
      answer: language === 'fr'
        ? "Oui, nous disposons d'un parking gratuit et sécurisé pour tous nos clients."
        : "أيه، عندنا باركينغ مجاني ومؤمن لكل العملاء."
    }
  ];

  const InputIcon = ({ name }) => {
    const icons = {
      name: User,
      email: Mail,
      phone: Phone,
      subject: MessageSquare,
      message: MessageSquare
    };
    const Icon = icons[name];
    return <Icon className="w-5 h-5 text-gray-400" />;
  };

  const ValidationIcon = ({ status }) => {
    if (status === 'valid') return <Check className="w-5 h-5 text-green-500" />;
    if (status === 'invalid') return <X className="w-5 h-5 text-red-500" />;
    return null;
  };

  return (
    <div className={`pt-16 min-h-screen bg-gray-50 ${language === 'ar' ? 'rtl' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Toggle */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          {language === 'fr' ? '🇲🇦 العربية' : '🇫🇷 Français'}
        </Button>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <Card className="w-96 mx-4 animate-scale-in">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">{t.successTitle}</h3>
              <p className="text-gray-600">{t.successDesc}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="animate-fade-in shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                {t.sendMessage}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {t.formDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <InputIcon name="name" />
                      {t.fullName} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t.fullName}
                        className={`pl-10 pr-10 ${validation.name === 'valid' ? 'border-green-500' : validation.name === 'invalid' ? 'border-red-500' : ''}`}
                      />
                      <div className="absolute left-3 top-3">
                        <InputIcon name="name" />
                      </div>
                      <div className="absolute right-3 top-3">
                        <ValidationIcon status={validation.name} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <InputIcon name="phone" />
                      {t.phone}
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+212 6 XX XX XX XX"
                        className={`pl-10 pr-10 ${validation.phone === 'valid' ? 'border-green-500' : validation.phone === 'invalid' ? 'border-red-500' : ''}`}
                      />
                      <div className="absolute left-3 top-3">
                        <InputIcon name="phone" />
                      </div>
                      <div className="absolute right-3 top-3">
                        <ValidationIcon status={validation.phone} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <InputIcon name="email" />
                    {t.email} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className={`pl-10 pr-10 ${validation.email === 'valid' ? 'border-green-500' : validation.email === 'invalid' ? 'border-red-500' : ''}`}
                    />
                    <div className="absolute left-3 top-3">
                      <InputIcon name="email" />
                    </div>
                    <div className="absolute right-3 top-3">
                      <ValidationIcon status={validation.email} />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    <InputIcon name="subject" />
                    {t.subject} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t.subject}
                      className={`pl-10 pr-10 ${validation.subject === 'valid' ? 'border-green-500' : validation.subject === 'invalid' ? 'border-red-500' : ''}`}
                    />
                    <div className="absolute left-3 top-3">
                      <InputIcon name="subject" />
                    </div>
                    <div className="absolute right-3 top-3">
                      <ValidationIcon status={validation.subject} />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <InputIcon name="message" />
                    {t.message} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder={t.message}
                      className={`pl-10 pr-10 resize-none ${validation.message === 'valid' ? 'border-green-500' : validation.message === 'invalid' ? 'border-red-500' : ''}`}
                    />
                    <div className="absolute left-3 top-3">
                      <InputIcon name="message" />
                    </div>
                    <div className="absolute right-3 top-3">
                      <ValidationIcon status={validation.message} />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 transition-all duration-300 ${isSubmitting ? 'animate-pulse' : 'hover:scale-105'}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.sending}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      {t.sendButton}
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info & Map */}
          <div className="space-y-6 animate-fade-in">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{t.address}</h3>
                  <p className="text-gray-600 text-sm">
                  Regragui Football Academy<br />
                    Errachidia, Maroc
                    
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{t.phone}</h3>
                  <div className="space-y-1">
                    <a href="tel:+212612345678" className="text-gray-600 text-sm hover:text-green-600 transition-colors block">
                      +212 6 12 34 56 78
                    </a>
                    <a href="tel:+212522123456" className="text-gray-600 text-sm hover:text-green-600 transition-colors block">
                      +212 5 22 XX XX XX
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{t.email}</h3>
                  <div className="space-y-1">
                    <a href="mailto:contact@regragui-football.ma" className="text-gray-600 text-sm hover:text-orange-600 transition-colors block">
                      contact@regragui-football.ma
                    </a>
                    <a href="mailto:reservation@regragui-football.ma" className="text-gray-600 text-sm hover:text-orange-600 transition-colors block">
                      reservation@regragui-football.ma
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 relative">
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white animate-pulse">
                    {t.support247}
                  </Badge>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{t.hours}</h3>
                  <p className="text-gray-600 text-sm">
                    Lun - Dim: 06h00 - 24h00<br />
                    7j/7 - 365j/an
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Google Maps */}
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t.location}
                </CardTitle>
                <CardDescription>
                  {t.locationDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-64 bg-gray-200 rounded-b-lg overflow-hidden shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.879639876123!2d-7.603869284842!3d33.57311998070969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2s!4v1644512345678!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Regragui Football Academy Location"
                  ></iframe>
                </div>
                <div className="p-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a 
                      href="https://maps.google.com/maps?q=33.57311998070969,-7.603869284842"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t.directions}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 animate-pulse md:animate-none hover:scale-105 transition-all duration-300" 
                asChild
              >
                <a href="tel:+212612345678" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t.callNow}
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="border-green-500 text-green-600 hover:bg-green-50 font-semibold py-4 animate-pulse md:animate-none hover:scale-105 transition-all duration-300" 
                asChild
              >
                <a 
                  href="https://wa.me/212612345678" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span className="text-green-500">💬</span>
                  {t.whatsapp}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            {t.faq}
          </h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Collapsible open={openFaq === index} onOpenChange={() => toggleFaq(index)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span className="text-left">{faq.question}</span>
                        <ChevronDown 
                          className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${
                            openFaq === index ? 'rotate-180' : ''
                          }`} 
                        />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-2xl md:hidden z-40">
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 animate-pulse" 
              asChild
            >
              <a href="tel:+212612345678" className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                {t.callNow}
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 animate-pulse" 
              asChild
            >
              <a 
                href="https://wa.me/212612345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <span className="text-green-500">💬</span>
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Contact;