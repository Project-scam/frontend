import "./Privacy.css";

export const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="privacy-overlay">
      <div className="privacy-container">
        {onClose && (
          <button
            type="button"
            className="privacy-close-btn"
            onClick={onClose}
          >
            ← Torna indietro
          </button>
        )}
      <h1>Informativa sulla Privacy</h1>
      <p className="subtitle">
        ai sensi dell’art. 13 del Regolamento UE 2016/679 (GDPR)
      </p>

      <h2>Titolari del trattamento</h2>
      <p>
        Il Titolare del trattamento dei dati è il <strong>team di sviluppo della web app</strong>,
        composto da:
      </p>
      <ul>
        <li>
          <strong>Andrea Villari</strong> –{" "}
          <a href="mailto:andrea.villari@allievi.itsdigitalacademy.com">
            andrea.villari@allievi.itsdigitalacademy.com
          </a>
        </li>
        <li>
          <strong>Catalin Groppo</strong> –{" "}
          <a href="mailto:catalin.groppo@allievi.itsdigitalacademy.com">
            catalin.groppo@allievi.itsdigitalacademy.com
          </a>
        </li>
        <li>
          <strong>Sandu Batrincea</strong> –{" "}
          <a href="mailto:sandu.batrincea@allievi.itsdigitalacademy.com">
            sandu.batrincea@allievi.itsdigitalacademy.com
          </a>
        </li>
      </ul>

      <p>
        Studenti del corso <strong>Web Developer Full Stack</strong> presso l’
        <strong> ITS Digital Academy “Mario Volpato”</strong>.
      </p>

      <h2>1. Tipologia di dati trattati</h2>
      <ul>
        <li>indirizzo email dell’utente;</li>
        <li>
          dati tecnici necessari al funzionamento dell’applicazione (es. log di
          accesso, indirizzo IP in forma limitata o anonimizzata);
        </li>
        <li>
          informazioni strettamente necessarie alla gestione dell’account
          utente.
        </li>
      </ul>
      <p>
        Non vengono raccolti dati sensibili né dati eccedenti rispetto alle
        finalità indicate.
      </p>

      <h2>2. Finalità del trattamento</h2>
      <p>I dati personali forniti dagli utenti sono trattati per:</p>
      <ul>
        <li>consentire la creazione e la gestione dell’account utente;</li>
        <li>permettere l’accesso alle funzionalità della web app;</li>
        <li>inviare email di recupero o reset della password;</li>
        <li>
          garantire la sicurezza dell’applicazione e prevenire accessi non
          autorizzati;
        </li>
        <li>adempiere a eventuali obblighi normativi applicabili.</li>
      </ul>
      <p>
        La raccolta dell’indirizzo email <strong>non ha finalità commerciali
        o promozionali</strong> e non viene utilizzata per attività di marketing.
      </p>

      <h2>3. Base giuridica del trattamento</h2>
      <ul>
        <li>
          esecuzione di misure precontrattuali e contrattuali richieste
          dall’utente (art. 6, par. 1, lett. b GDPR);
        </li>
        <li>
          legittimo interesse del titolare a garantire la sicurezza e il corretto
          funzionamento del servizio.
        </li>
      </ul>

      <h2>4. Modalità del trattamento</h2>
      <p>
        Il trattamento avviene nel rispetto dei principi di liceità, correttezza,
        trasparenza e minimizzazione dei dati, mediante strumenti informatici e
        telematici idonei a garantire la sicurezza e la riservatezza dei dati.
      </p>
      <p>
        Non sono effettuati processi decisionali automatizzati né attività di
        profilazione.
      </p>

      <h2>5. Conservazione dei dati</h2>
      <ul>
        <li>per il tempo necessario al funzionamento dell’account utente;</li>
        <li>fino alla richiesta di cancellazione dell’account;</li>
        <li>per il periodo richiesto da eventuali obblighi di legge.</li>
      </ul>
      <p>
        Al termine del periodo di conservazione, i dati saranno cancellati o
        anonimizzati.
      </p>

      <h2>6. Destinatari dei dati</h2>
      <p>
        I dati personali non sono ceduti né venduti a terzi. Possono essere
        trattati esclusivamente da soggetti coinvolti nello sviluppo e
        mantenimento dell’applicazione e da fornitori di servizi tecnici,
        nominati ove necessario Responsabili del trattamento ai sensi dell’art.
        28 GDPR.
      </p>

      <h2>7. Diritti dell’interessato</h2>
      <ul>
        <li>accesso ai dati personali;</li>
        <li>rettifica o aggiornamento;</li>
        <li>cancellazione dei dati;</li>
        <li>limitazione o opposizione al trattamento;</li>
        <li>portabilità dei dati, ove applicabile;</li>
        <li>
          reclamo al Garante per la protezione dei dati personali.
        </li>
      </ul>

      <h2>8. Cookie e strumenti di tracciamento</h2>
      <p>
        La web app utilizza esclusivamente cookie tecnici necessari al corretto
        funzionamento del servizio. Per maggiori informazioni è possibile
        consultare la Cookie Policy.
      </p>

      <h2>9. Servizi di terze parti</h2>
      <ul>
        <li>
          <strong>Vercel</strong> – hosting del frontend React (
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          )
        </li>
        <li>
          <strong>Render</strong> – hosting del backend API (
          <a
            href="https://render.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          )
        </li>
        <li>
          <strong>Neon</strong> – database PostgreSQL (
          <a
            href="https://neon.tech/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          )
        </li>
        <li>
          <strong>Brevo</strong> – invio email di recupero password (
          <a
            href="https://www.brevo.com/it/legal/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          )
        </li>
      </ul>

      <h2>10. Natura del progetto</h2>
      <p>
        La web app è realizzata come <strong>progetto didattico</strong> nell’ambito
        del percorso formativo presso l’ITS Digital Academy “Mario Volpato” e non
        ha scopi di lucro.
      </p>
      </div>
    </div>
  );
};
