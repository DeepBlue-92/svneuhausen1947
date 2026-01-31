import React, { useEffect, useState } from 'react';
import { Clock, MapPin, User, ChevronRight, Info, Mail, Calendar, Download, FileText, Trophy, ExternalLink, Image as ImageIcon, CalendarCheck, Instagram, Globe, BookOpen } from 'lucide-react';
import { PicFussball, PicKinderFussball, PicKarate, PicSchwertkampf, PicTennis, PicTurnen, PicKinderTurnen } from './Pictograms';
import { Post, CalendarEvent, GalleryImage, PageType } from '../types';

interface SportDetailViewProps {
  sportId: string;
  posts?: Post[];
  events?: CalendarEvent[];
  galleryImages?: GalleryImage[];
  onNavigate?: (page: PageType) => void;
}

// --- STATIC CONTENT FOR DOWNLOADS ---
const TENNIS_TRAINING_INFO = `Tennistraining für Kinder, Jugendliche, Damen und Herren - Einsteiger

Habt ihr Lust auf Tennis?
Die Tennisabteilung des SV Neuhausen bietet auch heuer wieder ihr beliebtes Tennistraining für Kinder, Jugendliche, Damen und Herren (Einsteiger) an. Werde Teil der Gemeinschaft und bring dich ins Spiel!

Das wöchentliche Training für Kindergarten-Kinder, Kinder, Jugendliche beginnt am 3. Mai (sofern das Wetter mitspielt).

ZEITEN
16:45 – 17:45 Uhr: Tennis Kindergarten 
17:00 – 18:00 Uhr: Kindertraining
18:00 – 19:00 Uhr: Jugendtraining

HERREN (EINSTEIGER)
Beginn: 3. Mai
18:00 – 20:00 Uhr: Herren Anfänger

DAMEN (EINSTEIGER)
Beginn: 8. Mai (montags)
Gruppe 1: 17.00 – 18.30 Uhr
Gruppe 2: 18:30 – 20.00 Uhr

KOSTEN
Die ersten beiden Trainings sind kostenlos (Schnuppern).
Danach Unkostenbeitrag: 30,- €.
Mitgliedschaft im Tennisverein ist dann notwendig.

ANMELDUNG
Per E-Mail an: m_biermacher@web.de oder johann.wendl@t-online.de
Infos: Name, (bei Kindern: Erziehungsberechtigter), Gruppe, Telefon, E-Mail.

Weitere Infos auf der Homepage.
Vorstandschaft Tennisabteilung SV Neuhausen`;
// ------------------------------------

const HALLENPLAN_URL = "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/246d8ac10bd9d627bc92d5cce178ccb83e2a3c7f/Turnhallenbelegungsplan-25-26.pdf";

const GalleryWidget: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
        // Sequentially cycle through images
        setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
      <div className="bg-white rounded-[24px] shadow-sm p-4 border border-slate-100 mt-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="text-club-600" size={20}/> Impressionen
          </h3>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 shadow-inner group">
              <img 
                  src={images[currentIndex].imageUrl} 
                  alt={images[currentIndex].title}
                  className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium text-sm md:text-base drop-shadow-sm">
                      {images[currentIndex].title}
                  </p>
              </div>
          </div>
      </div>
  );
};

const SportDetailView: React.FC<SportDetailViewProps> = ({ sportId, posts = [], events = [], galleryImages = [], onNavigate }) => {
  
  const handleDownload = (fileName: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper to determine if location should be shown
  // We hide it for Fussball, Kinderfussball and Tennis as requested
  const showLocation = !['fussball', 'kinderfussball', 'tennis'].includes(sportId);

  // Load FuPa Widget Script when viewing football
  useEffect(() => {
    if (sportId === 'fussball') {
      const script = document.createElement('script');
      script.src = "https://widget-api.fupa.net/vendor/widget.js?v1";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [sportId]);

  // Data Dictionary with correct contacts (Static Content)
  const sportsData: Record<string, any> = {
    fussball: {
      title: "Fußball",
      subtitle: "Senioren und Jugend",
      description: "Der SV Neuhausen spielt seit der Saison 2023/24 in einer Spielgemeinschaft mit dem SC Weihmichl und ist mit einer 1. Mannschaft und der Reserve in der Kreisklasse Landshut vertreten.",
      image: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/46dd414905746a9faecafcbff514033fb6ad5435/banner_sportplatz1.png",
      icon: <PicFussball className="w-full h-full" />,
      training: [
        { team: "1. Mannschaft", time: "Di & Do 19:00 - 21:00", loc: "Stadion" },
        { team: "Alte Herren", time: "Mi 19:30 - 21:00", loc: "Kunstrasen" },
        { team: "A-Jugend", time: "Mo & Mi 18:00 - 19:30", loc: "Kunstrasen" }
      ],
      contacts: [
          { name: "Christian Meier", role: "Abteilungsleiter", phone: "0160 / 7732726", email: "christianmeier9@t-online.de" },
          { name: "Valjmir Aljilji", role: "Trainer Senioren", phone: "", email: "" },
          { name: "Jürgen Stadler", role: "Trainer Senioren", phone: "", email: "" },
          { name: "Christoph Holland", role: "Trainer Senioren", phone: "", email: "" },
      ]
    },
    kinderfussball: {
      title: "Kinderfußball",
      subtitle: "Spiel und Spaß für Bambini",
      description: (
        <>
          <p className="mb-4">
            Willkommen bei unserem Kindertraining für Bambini im Alter von ca. 4-6 Jahren! Hier lernen die kleinen Sportler spielerisch die Grundlagen des Fußballs und verbessern ihre Beweglichkeit.
          </p>
          <p>
            Unsere Trainer sorgen für eine abwechslungsreiche Umgebung, in der Kinder Freude am Spiel haben und sich aktiv bewegen können.
          </p>
        </>
      ),
      image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=2000",
      icon: <PicKinderFussball className="w-full h-full" />,
      training: [
        { team: "3-4 Jahre", time: "Mi 16:15 - 17:00", loc: "Sportplatz Unterneuhausen" },
        { team: "5-6 Jahre", time: "Mi 17:00 - 18:00", loc: "Sportplatz Unterneuhausen" }
      ],
      contact: { name: "Anna & Andreas Reithmeier", role: "Leitung", phone: "" }
    },
    tennis: {
      title: "Tennis",
      subtitle: "Spiel, Satz und Sieg",
      description: (
          <>
            <p className="mb-4">
                Die Tennisabteilung wurde im Jahr 1993 gegründet und verfügt über zwei bestens gepflegte Sandplätze und ein eigenes Vereinsheim in idyllischer Lage.
            </p>
            <p className="mb-4">
                Wir bieten allen Tennisbegeisterten von jung bis alt die Möglichkeit, Tennis zu erlernen, zu verbessern und im Verein zu spielen. 
                Neben dem breitensportlichen Aspekt kommt die Geselligkeit an den Vereinsabenden und Turnieren nicht zu kurz.
            </p>
            <p className="font-bold text-club-600">
                Neumitglieder sind uns jederzeit sehr gerne willkommen.
            </p>
          </>
      ),
      image: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/902d56d7e9976b21d1cf807738d859daa0b7a9df/tennisanlage1.jpg",
      descriptionImage: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/8f18a9f9aafc14eb955f87ea1cef24c5a1f9a896/tennisheim1.jpg",
      icon: <PicTennis className="w-full h-full" />,
      training: [
        { team: "Damentraining", time: "Mo 17:00 - 20:00", loc: "Tennisanlage" },
        { team: "Doppeltraining", time: "Di 17:00 - 20:00", loc: "Tennisanlage" },
        { team: "Seniorentennis", time: "Mi 08:30 - 11:30", loc: "Tennisanlage" },
        { team: "Tenniskindergarten (Gr. 1)", time: "Mi 15:30 - 16:15", loc: "Tennisanlage" },
        { team: "Tenniskindergarten (Gr. 2)", time: "Mi 16:17 - 17:00", loc: "Tennisanlage" },
        { team: "Kinder- und Jugendtraining", time: "Mi 17:00 - 18:00", loc: "Tennisanlage" },
        { team: "Herrentraining", time: "Mi 18:00 - 20:00", loc: "Tennisanlage" },
        { team: "Doppeltraining", time: "Fr 15:00 - 20:00", loc: "Tennisanlage" }
      ],
      contacts: [
          { 
              name: "Johann Wendl", 
              role: "Abteilungsleiter Tennis", 
              phone: "0151 / 520 95453", 
              email: "johann.wendl@t-online.de",
              imageUrl: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/eac820f0cb700da7bef184206f866113aefe8157/wendl.png"
          },
          { 
              name: "Rüdiger Knyrim", 
              role: "Sportwart Herren", 
              phone: "01522 / 4109127", 
              email: "ruediger.knyrim@t-online.de",
              imageUrl: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/eac820f0cb700da7bef184206f866113aefe8157/knyrim.png"
          },
          { 
              name: "Markus Biermacher", 
              role: "Sportwart Kinder, Jugend, Damen", 
              phone: "0151 / 21052018", 
              email: "m_biermacher@web.de",
              imageUrl: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/main/biermacher.png"
          }
      ],
      downloads: [],
      yearlyScheduleTitle: "Jahresprogramm 2026",
      yearlySchedule: [
        { date: "Info", event: "Das Jahresprogramm steht noch nicht fest, wird aber so bald wie möglich hier veröffentlicht." }
      ]
    },
    karate: {
          title: "Karate",
          subtitle: "Shorin-Ryu Seibukan Karate",
          description: (
              <>
                <p className="mb-4 font-medium text-slate-800">
                    Die Karategruppe im SV Neuhausen besteht seit 1998.
                </p>
                <p className="mb-4">
                    Der Karatestil heißt <strong>Shorin-Ryu Seibukan Karate</strong>, ein traditioneller Stil von der japanischen Inselgruppe Okinawa, dem Ursprung des Karate. 
                    Das Dojo (Trainingsort) Seibukan Karate - SV Neuhausen ist ein Verein des BKB (Bayrischer Karate Bund e.V.) im DKV (Deutscher Karate Verband e.V.). 
                    Zudem ist es in den Verband der Stilrichtung, Shorin-Ryu Seibukan Karate-Union Deutschland e.V. eingebunden.
                </p>

                <h3 className="font-bold text-slate-900 mt-6 mb-2">Für wen ist Karate geeignet?</h3>
                <p className="mb-4">
                    Karate ist für alle Altersgruppen geeignet. So trainieren beim SV Neuhausen Jugendliche und Erwachsene. 
                    Da es keine eigene Kindergruppe gibt, sind Kinder zwar willkommen, sollten aber schon so konzentriert und diszipliniert sein, dass sie zusammen mit den Erwachsenen trainieren können.
                </p>

                <h3 className="font-bold text-slate-900 mt-6 mb-2">Körper & Geist</h3>
                <p className="mb-4">
                    Karate trainiert Körper und Geist. Neben den rein körperlichen Fähigkeiten wie Kraft, Schnelligkeit, Gleichgewicht und Flexibilität werden auch Konzentration, (Selbst)Disziplin und Koordination gefördert. 
                    Die Kombination aus hoher Konzentration bei den Techniken und Abläufen und der körperlichen Anstrengung wirkt entspannend und fördert das Wohlbefinden. 
                    Nicht zuletzt stellt Karate eine effektive Form der Selbstverteidigung dar.
                </p>

                <h3 className="font-bold text-slate-900 mt-6 mb-2">Historischer Hintergrund</h3>
                <p className="mb-4">
                    Karate (Kara = leer, te = Hand) ist eine Kampfkunst, deren Ursprünge vermutlich bis ins Jahr 520 n. Chr. zurückreichen. 
                    Im Laufe der Zeit vermischten sich ursprüngliche Kampfkunsttechniken auf Okinawa mit Techniken, die von chinesischen Mönchen auf die Insel gebracht wurden. 
                    Daraus entwickelten sich in den Dörfern Shuri, Tomari und Naha verschiedene Stilrichtungen.
                </p>
                <p className="mb-4">
                    Der Stil Shorin-Ryu Seibukan entstand aus dem Stil Sukunaihayashi-Ryu, den dessen Gründer Chotoku Kyan aus dem Shuri-Te und Tomari-Te entwickelte. 
                    Der Gründer des Shorin-Ryu Seibukan, Zenryu Shimabukuro trainierte 10 Jahre lang unter Sensei Chotoku Kyan. 
                    Sein Sohn Zenpo Shimabukuro ist heute Supreme Sensei der International Okinawan Shorin-Ryu Seibukan Association (IOSSKA) und unterrichtet im Honbu Dojo (Haupt-Dojo) auf Okinawa.
                </p>
              </>
          ),
          image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=2000",
          icon: <PicKarate className="w-full h-full" />,
          training: [
              { team: "Jugendliche & Erwachsene (Anfänger/Mittelstufe)", time: "Mi 18:45 - 19:45", loc: "Turnhalle Unterneuhausen" },
              { team: "Jugendliche & Erwachsene (Fortgeschrittene)", time: "Mi 19:45 - 20:45", loc: "Turnhalle Unterneuhausen" }
          ],
          contacts: [
              { 
                  name: "Manfred Rabl", 
                  role: "Abteilungsleiter", 
                  phone: "08708 / 1344", 
                  email: "seibukan-karate.neuhausen@t-online.de",
                  imageUrl: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/169d77d6d5bd2dc434b729a18ba62d961a47150e/rabl1.png"
              }
          ],
          downloads: [
              { title: "Hallenbelegungsplan 2025/26", url: HALLENPLAN_URL }
          ]
      },
      kinderturnen: {
          title: "Kinderturnen",
          subtitle: "Bewegung macht Spaß",
          description: (
              <>
                <p className="mb-4">Hier turnen Kinder im Alter von ca. 2 bis 6 Jahren und entwickeln so mit viel Spaß und auf spielerische Art ihre motorischen Fähigkeiten weiter.</p>
                <p className="mb-4 font-bold text-club-600">Wir bitten um vorherigen Anmeldung.</p>
              </>
          ),
          image: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/fcf15448d0c1c5a52b2211cf289662acaa1f38e4/Kinderturnen_Banner.png", // Kids sports
          icon: <PicKinderTurnen className="w-full h-full" />,
          training: [
               { team: "Kinder 5-6 Jahre", time: "Mo 16:30 - 17:30", loc: "Turnhalle Grundschule" },
               { team: "Kinder 2-4 Jahre", time: "Mi 16:00 - 17:00", loc: "Turnhalle Grundschule" },
               { team: "Kinder 2-4 Jahre", time: "Fr 15:30 - 16:30", loc: "Turnhalle Grundschule" }
          ],
          contacts: [
              { name: "Saskia Kessler", role: "Leitung", phone: "0176 / 44271707" }
          ],
          downloads: [
              { title: "Hallenbelegungsplan 2025/26", url: HALLENPLAN_URL }
          ]
      },
      schwertkampf: {
          title: "Kumdo",
          subtitle: "Japanisch/Koreanische Schwertkampfkunst",
          description: (
              <>
                 <p className="mb-4">
                    Die japanisch/koreanische Schwertkampfkunst <strong>Kumdo</strong> bzw. <strong>Kenjutsu</strong> ist schnell, dynamisch und effektiv. 
                    Wir trainieren den Umgang mit dem Schwert, im Kampf gegen Partner und sich selbst. 
                    Das Ziel dabei ist in chaotischen, stressigen Situationen einen kühlen Kopf zu bewahren und Körper und Geist zu kontrollieren, alles in Anlehnung an eine möglichst realistische Situation.
                 </p>
                 <p className="mb-4">
                    Wie bei jeder Kampfkunst ist erstmal ein stabiles Fundament notwendig, mit Grundbewegungen, Formen und Partnerübungen. 
                    Mit Hilfe von verschiedenen Übungsschwertern wird der Weg von Partnerformen bis hin zum Freikampf gelehrt. 
                    Zur Erweiterung der Kampfkunst wird das Kriegsbogenschießen mit dem koreanischen Reiterbogen praktiziert.
                 </p>
                 <p className="mb-4">
                    Zur Meisterung dieser Kampfkunst ist natürlich Disziplin und konstantes Training erforderlich, jedoch steht vor allem der Spaß im Umgang mit dem Schwert und zusammen mit den Trainingspartnern im Vordergrund. 
                    Es wird aber genauso Wert auf Disziplin, Respekt, Achtung vor dem Gegner, dem Trainingspartner:in und den Waffen, die benutzt werden, gelegt.
                 </p>

                 <h3 className="font-bold text-slate-900 mt-8 mb-4">Das Training umfasst:</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                         <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                            <li>Grundformen (Beweglichkeit, Fitness, Etikette, Grundstellungen, Bewegung mit dem Schwert, Basis-Angriffe und Verteidigung, Schwertziehen und Einstecken)</li>
                            <li>Schwertformen zur Erlernung von Techniken und Kombinationen</li>
                            <li>Partnerformen als Einführung zum Freikampf</li>
                            <li>Gefechtsbogenschießen mit dem Reiterbogen</li>
                            <li>Freikampf (Sparring)</li>
                            <li>Schnittübungen und scharfes Schneiden an der Matte</li>
                            <li>Meditationsform</li>
                         </ul>
                     </div>
                     <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        <img 
                            src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/9ecaa52f2e3d28153d8994f5397d8df566cdee8a/Schwertkampf_Collage.png" 
                            alt="Kumdo Training Impressionen" 
                            className="w-full h-full object-cover"
                        />
                     </div>
                 </div>

                 <p className="mb-4">
                    Diese Sportart kann bis ins hohe Alter ausgeübt werden und auch der Einstieg ist in jedem Alter möglich. 
                    Ein Schnuppertraining ist jederzeit möglich, schwarzes T-Shirt und lange Hose genügen. 
                    Normalerweise wird unser Sport ohne Schuhwerk betrieben. Keine Vorkenntnisse oder Ausrüstung erforderlich.
                 </p>
              </>
          ),
          image: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/9ecaa52f2e3d28153d8994f5397d8df566cdee8a/Schwerkampf_Banner.png", 
          sidebarImage: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/9ecaa52f2e3d28153d8994f5397d8df566cdee8a/Schwerkampf_Portrait.png",
          icon: <PicSchwertkampf className="w-full h-full" />,
          training: [
              { team: "Erwachsene & Jgd ab 14", time: "Mi 19:15 - 20:45", loc: "Mehrzweckhalle Weihmichl" }
          ],
          contacts: [
               { name: "Dennis Saler", role: "Abteilungsleiter", phone: "0162 / 4139432", email: "dennis.saler@gmx.de" }
          ],
          downloads: [
              { title: "Hallenbelegungsplan 2025/26", url: HALLENPLAN_URL }
          ]
      },
      turndichfit: {
          title: "Turn dich fit",
          subtitle: "Gymnastik & Gesundheit",
          description: (
              <>
                <p className="mb-4 font-bold text-lg text-club-600">
                    Für die sportbegeisterten Frauen und Männer aller Altersgruppen!
                </p>
                <p className="mb-4">
                    Jeden Dienstag startet in Unterneuhausen das Fitnessprogramm "Turn dich Fit". 
                    Von 19 - 20 Uhr werden in der Turnhalle Unterneuhausen alle sportbegeisterten Frauen und Männer aller Altersgruppen auf ihre Kosten kommen.
                </p>
                <p className="mb-4">
                    Wie bei jeder Sporteinheit bildet ein abwechslungsreiches Aufwärmprogramm die Basis, mal mit Laufübungen oder Aerobic. 
                    Danach wird es Übungen für alle Muskelgruppen geben. Unter anderem Bauch-Beine-Po, vielfältige Koordinationsübungen, Stabilisierung für die Wirbelsäule, Pilates oder auch wohltuende Bodengymnastik. 
                </p>
                <p className="mb-4">
                    Der Einsatz verschiedener Kleingeräte wie Hanteln, Theraband, Stepper oder Langbank garantieren eine kurzweilige Trainingsstunde. 
                    Besonders Spaß machen die Übungen durch die Begleitung von rhythmischer Musik.
                </p>
              </>
          ),
          image: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/fd2048fb4743737177337646f46e457c26f63981/banner_turnen.png", // Fitness
          icon: <PicTurnen className="w-full h-full" />,
          training: [
               { team: "Fitness für Alle", time: "Di 19:00 - 20:00", loc: "Turnhalle Unterneuhausen" },
               { team: "Yoga", time: "Do 18:00 - 19:00", loc: "Turnhalle Unterneuhausen" }
          ],
          contacts: [
              { 
                  name: "Angelika Müller", 
                  role: "Abteilungsleiterin", 
                  phone: "08708 / 689", 
                  email: "angelikamueller-4@t-online.de",
                  imageUrl: "https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/eac820f0cb700da7bef184206f866113aefe8157/m%C3%BCller.png"
              }
          ],
          downloads: [
              { title: "Hallenbelegungsplan 2025/26", url: HALLENPLAN_URL }
          ]
      }
  };

  const currentSport = sportsData[sportId] || sportsData['fussball'];
  const sportGalleryImages = galleryImages.filter(img => img.departmentId === sportId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        {/* HERO BANNER - Reduced Height */}
        <div className="relative h-[210px] md:h-[280px] w-full rounded-[24px] overflow-hidden shadow-md mb-8">
            <img 
                src={currentSport.image} 
                alt={currentSport.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                 <div className="mb-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{currentSport.title}</h1>
                    <p className="text-slate-200 font-medium text-lg">{currentSport.subtitle}</p>
                 </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar with Info */}
            <div className="lg:col-span-1 space-y-6">

                {/* Tennis Booking Buttons */}
                {sportId === 'tennis' && (
                    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CalendarCheck className="text-club-600" size={20}/> Online Buchung
                        </h3>
                        <div className="space-y-3">
                            <a 
                                href="https://www.supersaas.de/schedule/login/svneuhausen1947/Platzbelegung" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-club-600 hover:bg-club-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
                            >
                                Platzreservierung <ExternalLink size={16} />
                            </a>
                            <a 
                                href="https://www.supersaas.de/schedule/login/svneuhausen1947/Veranstaltungen" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-white border border-club-200 text-club-700 hover:bg-club-50 hover:border-club-300 font-bold py-3 px-4 rounded-xl transition-all"
                            >
                                Anmeldung Veranstaltungen <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                )}
                
                {/* Schwertkampf Social Media */}
                {sportId === 'schwertkampf' && (
                    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Instagram className="text-club-600" size={20}/> Social Media
                        </h3>
                        <a 
                            href="https://www.instagram.com/kumdo.bayern/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
                        >
                            <Instagram size={20} />
                            Auf Instagram folgen
                        </a>
                    </div>
                )}

                {/* Training Times */}
                <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="text-club-600" size={20}/> Trainingszeiten
                    </h3>
                    <ul className="space-y-3">
                        {currentSport.training?.map((t: any, i: number) => (
                            <li key={i} className="flex flex-col pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-800 text-sm">{t.team}</span>
                                    <span className="text-xs bg-club-50 text-club-700 px-2 py-1 rounded font-medium">{t.time}</span>
                                </div>
                                {showLocation && t.loc && (
                                     <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
                                         <MapPin size={12} /> {t.loc}
                                     </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contacts */}
                <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
                     <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <User className="text-club-600" size={20}/> Ansprechpartner
                    </h3>
                    <div className="space-y-4">
                        {currentSport.contacts ? (
                            currentSport.contacts.map((c: any, i: number) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-900">{c.name}</div>
                                        <div className="text-xs text-club-600 font-medium mb-2">{c.role}</div>
                                        <div className="space-y-1">
                                            {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-xs text-slate-700 hover:text-club-600"><span className="w-4"><Info size={12}/></span> {c.phone}</a>}
                                            {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs text-slate-700 hover:text-club-600"><span className="w-4"><Mail size={12}/></span> {c.email}</a>}
                                        </div>
                                    </div>
                                    {c.imageUrl && (
                                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200">
                                            <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : currentSport.contact ? (
                             <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <div className="font-bold text-slate-900">{currentSport.contact.name}</div>
                                <div className="text-xs text-club-600 font-medium">{currentSport.contact.role}</div>
                                {currentSport.contact.phone && <div className="text-xs text-slate-500 mt-1">{currentSport.contact.phone}</div>}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Sidebar Image */}
                {currentSport.sidebarImage && (
                    <div className="rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
                        <img src={currentSport.sidebarImage} alt={currentSport.title + " Impression"} className="w-full h-auto object-cover" />
                    </div>
                )}

                {/* Downloads */}
                <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Download className="text-club-600" size={20}/> Downloads
                    </h3>
                    <ul className="space-y-2">
                        {sportId === 'tennis' && onNavigate && (
                             <li>
                                <button 
                                    onClick={() => onNavigate('tennis-rules')}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-club-50 text-club-700 hover:bg-club-100 transition-colors text-sm font-bold group border border-club-100"
                                >
                                    <span className="flex items-center gap-2">
                                        <BookOpen size={16} className="text-club-600" />
                                        Spiel- & Platzordnung
                                    </span>
                                    <ChevronRight size={14} />
                                </button>
                            </li>
                        )}
                        {currentSport.downloads && currentSport.downloads.map((d: any, i: number) => (
                            <li key={i}>
                                <button 
                                    onClick={() => d.url ? window.open(d.url, '_blank') : handleDownload(d.fileName, d.content)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-club-50 text-slate-700 hover:text-club-700 transition-colors text-sm font-medium group"
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText size={16} className="text-slate-400 group-hover:text-club-500" />
                                        {d.title}
                                    </span>
                                    <Download size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Karate Association Link - MOVED HERE */}
                {sportId === 'karate' && (
                    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Globe className="text-club-600" size={20}/> Verband
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 leading-snug">
                            Weiterführende Informationen sind auf der Seite der Shorin-Ryu Seibukan-Union Deutschland&nbsp;e.V. unter folgendem Link zu finden:
                        </p>
                        <a 
                            href="https://www.shorin-ryu-seibukan.de/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-club-50 hover:bg-club-100 text-club-700 font-bold py-3 px-4 rounded-xl transition-all border border-club-100"
                        >
                            <ExternalLink size={16} />
                            Zur Verbands-Website
                        </a>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Description - MOVED UP */}
                <div className="bg-white rounded-[24px] shadow-sm p-8 border border-slate-100 leading-relaxed text-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Über die Abteilung</h2>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1">
                            {currentSport.description}
                        </div>
                        {currentSport.descriptionImage && (
                            <div className="w-full md:w-2/5 shrink-0">
                                <img 
                                    src={currentSport.descriptionImage} 
                                    alt={currentSport.description + " Image"} 
                                    className="w-full h-auto rounded-xl shadow-sm border border-slate-100 object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- TEASER CARD FOR TENNIS TRAINING --- */}
                {sportId === 'tennis' && (
                    <div 
                        onClick={() => onNavigate && onNavigate('tennis-training')}
                        className="relative rounded-[24px] shadow-sm p-6 md:p-8 text-white overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-club-700 bg-club-900"
                    >
                        {/* Background Image */}
                        <img 
                            src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/86659c6b12b9f325463fdc26a8880b082cf10e39/tennisball.png" 
                            alt="Tennis Training" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-club-900/90 via-club-800/80 to-transparent"></div>
                        
                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                                Tennistraining für Kinder, Jugendliche, Damen und Herren
                            </h3>
                            <p className="text-club-50 mb-6 text-lg leading-relaxed font-medium">
                                Die Tennisabteilung des SV Neuhausen bietet auch heuer wieder ihr beliebtes Tennistraining an.<br/>
                                Werde Teil der Gemeinschaft und bring dich ins Spiel!
                            </p>
                            <button className="w-fit bg-white text-club-900 font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-club-50 transition-all flex items-center gap-2 group-hover:translate-x-1 duration-300">
                                Infos & Anmeldung <ChevronRight size={18} className="text-club-600" />
                            </button>
                        </div>
                    </div>
                )}
                
                {/* --- LEAGUE TABLE WIDGET (FUSSBALL ONLY) - MOVED DOWN --- */}
                {sportId === 'fussball' && (
                    <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full font-sans border border-slate-100">
                        <div className="mb-5">
                            <h3 className="m-0 text-[1.25rem] font-bold text-club-600 tracking-tight">Kreisklasse Landshut</h3>
                        </div>
                        
                        <div id="fupa-wrapper" className="w-full">
                            <div id="fp-widget_root-2w0ThbFAMWRFonsfPJaNFc3xZwU">
                                <a href="https://www.fupa.net/club/sc-weihmichl" target="_blank" rel="noopener noreferrer" className="hidden">
                                    SC Weihmichl auf FuPa
                                </a>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <a 
                                href="https://www.fupa.net/club/sc-weihmichl" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block text-[0.85rem] text-[#0066cc] no-underline hover:underline"
                            >
                                Gesamte Tabelle auf FuPa ansehen
                            </a>
                        </div>
                    </div>
                )}
                
                {/* Yearly Schedule (Tennis Special) */}
                 {currentSport.yearlySchedule && (
                     <div className="bg-white rounded-[24px] shadow-sm p-8 border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Calendar className="text-club-600" size={24}/> {currentSport.yearlyScheduleTitle || `Jahresprogramm ${new Date().getFullYear()}`}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentSport.yearlySchedule.map((item: any, i: number) => (
                                <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="font-bold text-club-600 min-w-[100px] text-sm">{item.date}</div>
                                    <div className="text-slate-700 text-sm font-medium">{item.event}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- GALLERY WIDGET (BELOW SCHEDULE) --- */}
                <GalleryWidget images={sportGalleryImages} />

            </div>
        </div>
    </div>
  );
};

export default SportDetailView;