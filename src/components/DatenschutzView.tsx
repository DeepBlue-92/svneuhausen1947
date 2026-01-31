import React from 'react';

const DatenschutzView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[24px] shadow-sm p-8 md:p-12 border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Datenschutzerklärung</h1>

        <div className="space-y-8 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Datenschutz auf einen Blick</h2>
            <h3 className="font-bold text-slate-800 mt-4 mb-2">Allgemeine Hinweise</h3>
            <p className="leading-relaxed mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="font-bold text-slate-800 mt-4 mb-2">Datenschutz</h3>
            <p className="leading-relaxed mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <h3 className="font-bold text-slate-800 mt-4 mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p className="leading-relaxed mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              SV Neuhausen e.V.<br />
              Sportplatzstraße 1<br />
              12345 Neuhausen<br />
              E-Mail: info@sv-neuhausen.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Datenerfassung auf unserer Website</h2>
            <h3 className="font-bold text-slate-800 mt-4 mb-2">Kontaktformular</h3>
            <p className="leading-relaxed mb-4">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
          </section>
          
          <section>
            <p className="text-sm text-slate-400 italic mt-8">
              Hinweis: Dies ist ein Mustertext. Für den produktiven Einsatz muss eine rechtlich geprüfte Datenschutzerklärung verwendet werden.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DatenschutzView;