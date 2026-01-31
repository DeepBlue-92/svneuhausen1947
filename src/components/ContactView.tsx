import React from 'react';
import { Mail, Phone, User, Users, Shield, BadgeCheck, Wallet, FileText, Trophy } from 'lucide-react';

interface ContactEntry {
  role: string;
  name: string;
  phone?: string;
  email?: string;
}

interface ContactGroup {
  title: string;
  icon: React.ReactNode;
  contacts: ContactEntry[];
}

const ContactView: React.FC = () => {
  const contactGroups: ContactGroup[] = [
    {
      title: "Vorstandschaft",
      icon: <Shield className="text-club-600" size={24} />,
      contacts: [
        { role: "1. Vorstand", name: "Michael Blendl", phone: "0179 / 7906863", email: "michael.blendl@gmx.de" },
        { role: "2. Vorstand", name: "Georg Kindsmüller", phone: "0160 / 8432058", email: "" },
        { role: "3. Vorstand", name: "Martin Inderst", phone: "0171 / 3362732", email: "" },
      ]
    },
    {
      title: "Finanzen & Verwaltung",
      icon: <FileText className="text-club-600" size={24} />,
      contacts: [
        { role: "Erster Kassier", name: "Claudia Trinkl", phone: "08708 / 760", email: "kassenwart@svneuhausen1947.de" },
        { role: "Zweiter Kassier", name: "Georg Stanglmayr", phone: "0176 / 61550853", email: "" },
        { role: "Erster Schriftführer", name: "Florian Gerauer", phone: "0163 / 7171106", email: "" },
        { role: "Zweiter Schriftführer", name: "Angelika Müller", phone: "08708 / 689", email: "angelikamueller-4@t-online.de" },
      ]
    },
    {
      title: "Fußball: Abteilungsleitung & Trainer",
      icon: <Trophy className="text-club-600" size={24} />,
      contacts: [
        { role: "Abteilungsleiter", name: "Christian Meier", phone: "0160 / 7732726", email: "christianmeier9@t-online.de" },
        { role: "Trainer Senioren", name: "Valjmir Aljilji", phone: "", email: "" },
        { role: "Trainer Senioren", name: "Jürgen Stadler", phone: "", email: "" },
        { role: "Trainer Senioren", name: "Christoph Holland", phone: "", email: "" },
      ]
    },
    {
      title: "Weitere Abteilungen",
      icon: <Users className="text-club-600" size={24} />,
      contacts: [
        { role: "Tennis", name: "Johann Wendl", phone: "0151 / 52095453", email: "johann.wendl@t-online.de" },
        { role: "Karate", name: "Manfred Rabl", phone: "08708 / 1344", email: "seibukan-karate.neuhausen@t-online.de" },
        { role: "Turn dich Fit", name: "Angelika Müller", phone: "08708 / 689", email: "angelikamueller-4@t-online.de" },
        { role: "Kinderturnen", name: "Saskia Kessler", phone: "0176 / 44271707", email: "" },
        { role: "Schwertkampf", name: "Dennis Saler", phone: "0162 / 4139432", email: "dennis.saler@gmx.de" },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="text-center py-8 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Ansprechpartner</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Hier finden Sie alle wichtigen Kontakte des SV Neuhausen auf einen Blick.</p>
      </div>

      <div className="space-y-12">
        {contactGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {group.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{group.title}</h2>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.contacts.map((contact, index) => (
                  <div key={index} className="flex flex-col p-5 rounded-2xl bg-white border border-slate-100 hover:border-club-200 hover:shadow-md transition-all duration-300 group">
                    <div className="mb-3">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-club-50 text-club-700 text-xs font-bold uppercase tracking-wide mb-2">
                        {contact.role}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-club-700 transition-colors">
                        {contact.name}
                      </h3>
                    </div>
                    
                    <div className="mt-auto space-y-2.5 pt-3 border-t border-slate-50">
                      {contact.phone ? (
                        <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-slate-600 hover:text-club-600 transition-colors text-sm group/link">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/link:bg-club-50 group-hover/link:text-club-600 transition-colors">
                            <Phone size={14} />
                          </div>
                          <span className="font-medium">{contact.phone}</span>
                        </a>
                      ) : (
                          <div className="flex items-center gap-2.5 text-slate-400 text-sm italic">
                             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                <Phone size={14} />
                             </div>
                             <span>Telefon folgt</span>
                          </div>
                      )}
                      
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-slate-600 hover:text-club-600 transition-colors text-sm group/link">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/link:bg-club-50 group-hover/link:text-club-600 transition-colors">
                            <Mail size={14} />
                          </div>
                          <span className="truncate font-medium">{contact.email}</span>
                        </a>
                      ) : (
                          <div className="flex items-center gap-2.5 text-slate-400 text-sm italic">
                             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                <Mail size={14} />
                             </div>
                             <span>E-Mail folgt</span>
                          </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactView;