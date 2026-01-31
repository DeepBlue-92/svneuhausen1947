import React from 'react';

const ImpressumView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[24px] shadow-sm p-8 md:p-12 border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Impressum</h1>

        <div className="space-y-8 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Angaben gemäß § 5 TMG</h2>
            <p className="leading-relaxed">
              <strong>SV Neuhausen e.V.</strong><br />
              84107 Unterneuhausen<br />
              Bräu-Taferl-Weg 3
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Vertreten durch</h2>
            <p className="leading-relaxed">
              Blendl Michael
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Kontakt</h2>
            <p className="leading-relaxed">
              Tel: Sportheim 08708-603
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Haftung für Inhalte</h2>
            <p className="leading-relaxed text-justify">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeine Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Haftung für Links</h2>
            <p className="leading-relaxed text-justify">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Urheberrecht</h2>
            <p className="leading-relaxed text-justify">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ImpressumView;