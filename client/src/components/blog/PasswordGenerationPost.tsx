import React from "react";
import { Link } from "wouter";
import { ArrowLeft, Lock, Zap, BarChart3, Shield, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";

type CardCopy = { title: string; body: string; icon: React.ComponentType<{ className?: string }> };
type SectionCopy = { title: string; icon: React.ComponentType<{ className?: string }>; paragraphs: string[]; notes?: { title: string; body: string }[]; bullets?: { title: string; body: string }[] };
type PasswordPostCopy = { intro: string; lead: string; cards: CardCopy[]; sections: SectionCopy[]; bestPracticesTitle: string; bestPractices: { title: string; body: string }[] };

const copy: Partial<Record<SupportedLanguage, PasswordPostCopy>> & { en: PasswordPostCopy } = {
  en: {
    intro: "Creating a strong password is more than combining random characters. At PrivateNote.ai, our generator is built around three principles:",
    lead: "Here is how each component works to keep your accounts secure.",
    cards: [
      { icon: Lock, title: "Cryptographic Security", body: "Using the same class of secure randomness used for keys and tokens." },
      { icon: Zap, title: "Unbiased Randomness", body: "Every character has an equal chance of being selected." },
      { icon: BarChart3, title: "Intelligent Strength Analysis", body: "Advanced analysis beyond simple length checks." },
    ],
    sections: [
      {
        icon: Lock,
        title: "Crypto Web API",
        paragraphs: [
          "The generator uses the Web Crypto API to acquire cryptographically secure random values suitable for security-critical work.",
          "The randomness is seeded by the operating system and designed so future values cannot be predicted in practice without access to internal state.",
          "All generation happens in your browser. Your password never leaves your device, so it cannot be logged, intercepted, or leaked from our servers.",
        ],
        notes: [
          {
            title: "Why this matters",
            body: "Server-side password generation creates extra exposure through network transit and logs. Local generation avoids those risks entirely.",
          },
        ],
      },
      {
        icon: Zap,
        title: "Unbiased Randomness",
        paragraphs: [
          "We use rejection sampling so every character has the same chance of appearing. That removes subtle bias that can make some characters more likely than others.",
          "Simple modulo selection can be biased when the random number range does not divide evenly by the character set size. Rejection sampling discards unfair values and draws again.",
          "This makes passwords harder to predict because attackers cannot exploit character-selection patterns.",
        ],
      },
      {
        icon: BarChart3,
        title: "Smart Strength Analysis",
        paragraphs: [
          "A strong meter should look beyond length and symbol rules. Predictable strings can look complex while still being weak.",
          "We use zxcvbn-style analysis to check common patterns, dictionary words, sequences, repeated characters, entropy, and realistic crack-time estimates.",
          "That gives you a more realistic view of password strength than a simple checklist.",
        ],
        bullets: [
          { title: "Common patterns", body: "keyboard paths, sequences, and repeated characters" },
          { title: "Dictionary attacks", body: "common words, names, and breached-password variations" },
          { title: "Entropy", body: "how much of the password is actually unpredictable" },
          { title: "Crack time", body: "how long an attacker would realistically need" },
        ],
      },
    ],
    bestPracticesTitle: "Password Best Practices",
    bestPractices: [
      { title: "Use unique passwords", body: "Never reuse passwords across accounts." },
      { title: "Longer is better", body: "Aim for at least 16 characters; more is better for high-value accounts." },
      { title: "Use a password manager", body: "Store generated passwords securely so you do not have to remember them." },
      { title: "Enable two-factor authentication", body: "Even strong passwords benefit from an extra layer." },
      { title: "Do not share passwords", body: "Never share passwords with anyone claiming to be support." },
    ],
  },
  de: {
    intro: "Ein starkes Passwort besteht aus mehr als zufälligen Zeichen. Bei PrivateNote.ai basiert unser Generator auf drei Prinzipien:",
    lead: "So trägt jede Komponente dazu bei, Ihre Konten zu schützen.",
    cards: [
      { icon: Lock, title: "Kryptografische Sicherheit", body: "Dieselbe Klasse sicherer Zufälligkeit, die auch für Schlüssel und Tokens genutzt wird." },
      { icon: Zap, title: "Unverzerrte Zufälligkeit", body: "Jedes Zeichen hat die gleiche Chance, ausgewählt zu werden." },
      { icon: BarChart3, title: "Intelligente Stärkaanalyse", body: "Fortgeschrittene Analyse jenseits einfacher Längenprüfungen." },
    ],
    sections: [
      {
        icon: Lock,
        title: "Crypto Web API",
        paragraphs: [
          "Der Generator nutzt die Web Crypto API, um kryptografisch sichere Zufallswerte für sicherheitskritische Aufgaben zu erhalten.",
          "Die Zufälligkeit wird vom Betriebssystem gespeist und ist so ausgelegt, dass künftige Werte ohne internen Zustand praktisch nicht vorhersagbar sind.",
          "Die gesamte Erzeugung läuft in Ihrem Browser. Ihr Passwort verlässt Ihr Gerät nie und kann daher nicht von unseren Servern protokolliert, abgefangen oder geleakt werden.",
        ],
        notes: [
          {
            title: "Warum das wichtig ist",
            body: "Serverseitige Passworterzeugung schafft zusätzliche Angriffsfläche durch Übertragung und Logs. Lokale Erzeugung vermeidet diese Risiken vollständig.",
          },
        ],
      },
      {
        icon: Zap,
        title: "Unverzerrte Zufälligkeit",
        paragraphs: [
          "Wir nutzen Rejection Sampling, damit jedes Zeichen die gleiche Wahrscheinlichkeit hat. So entfernen wir subtile Verzerrungen, durch die manche Zeichen häufiger erscheinen könnten.",
          "Einfache Modulo-Auswahl kann verzerrt sein, wenn der Zufallszahlenbereich nicht gleichmäßig durch die Zeichensatzgröße teilbar ist. Rejection Sampling verwirft unfaire Werte und zieht erneut.",
          "Dadurch sind Passwörter schwerer vorherzusagen, weil Angreifer keine Muster in der Zeichenauswahl ausnutzen können.",
        ],
      },
      {
        icon: BarChart3,
        title: "Intelligente Stärkaanalyse",
        paragraphs: [
          "Eine gute Stärkemessung muss über Länge und Symbolregeln hinausgehen. Vorhersagbare Zeichenfolgen können komplex wirken und trotzdem schwach sein.",
          "Wir verwenden eine zxcvbn-ähnliche Analyse für häufige Muster, Wörterbuchwörter, Sequenzen, Wiederholungen, Entropie und realistische Schätzungen der Knackzeit.",
          "So erhalten Sie ein realistischeres Bild der Passwortstärke als mit einer einfachen Checkliste.",
        ],
        bullets: [
          { title: "Häufige Muster", body: "Tastaturpfade, Sequenzen und Wiederholungen" },
          { title: "Wörterbuchangriffe", body: "häufige Wörter, Namen und Varianten aus Datenlecks" },
          { title: "Entropie", body: "wie viel am Passwort tatsächlich unvorhersagbar ist" },
          { title: "Knackzeit", body: "wie lange ein Angreifer realistisch benötigen würde" },
        ],
      },
    ],
    bestPracticesTitle: "Best Practices für Passwörter",
    bestPractices: [
      { title: "Einzigartige Passwörter nutzen", body: "Verwenden Sie Passwörter nie für mehrere Konten." },
      { title: "Länger ist besser", body: "Zielen Sie auf mindestens 16 Zeichen; bei wichtigen Konten gern mehr." },
      { title: "Passwortmanager verwenden", body: "Speichern Sie erzeugte Passwörter sicher, damit Sie sie nicht merken müssen." },
      { title: "Zwei-Faktor-Authentifizierung aktivieren", body: "Auch starke Passwörter profitieren von einer zusätzlichen Schutzschicht." },
      { title: "Passwörter nicht teilen", body: "Teilen Sie Passwörter nie mit Personen, die behaupten, vom Support zu sein." },
    ],
  },
  fr: {
    intro: "Créer un mot de passe fort ne consiste pas seulement à combiner des caractères aléatoires. Chez PrivateNote.ai, notre générateur repose sur trois principes :",
    lead: "Voici comment chaque composant contribue à sécuriser vos comptes.",
    cards: [
      { icon: Lock, title: "Sécurité cryptographique", body: "La même classe d'aléatoire sécurisé que pour les clés et jetons." },
      { icon: Zap, title: "Aléatoire sans biais", body: "Chaque caractère a la même probabilité d'être sélectionné." },
      { icon: BarChart3, title: "Analyse intelligente de robustesse", body: "Une analyse avancée au-delà de la simple longueur." },
    ],
    sections: [
      {
        icon: Lock,
        title: "Crypto Web API",
        paragraphs: [
          "Le générateur utilise la Web Crypto API pour obtenir des valeurs aléatoires cryptographiquement sûres adaptées aux usages critiques.",
          "L'aléatoire est alimenté par le système d'exploitation et conçu pour que les valeurs futures soient imprévisibles en pratique sans accès à l'état interne.",
          "Toute la génération se fait dans votre navigateur. Votre mot de passe ne quitte jamais votre appareil ; il ne peut donc pas être journalisé, intercepté ou divulgué depuis nos serveurs.",
        ],
        notes: [
          {
            title: "Pourquoi c'est important",
            body: "La génération côté serveur expose davantage via le transport réseau et les journaux. La génération locale évite entièrement ces risques.",
          },
        ],
      },
      {
        icon: Zap,
        title: "Aléatoire sans biais",
        paragraphs: [
          "Nous utilisons l'échantillonnage par rejet afin que chaque caractère ait la même chance d'apparaître. Cela supprime les biais subtils.",
          "Une sélection modulo simple peut être biaisée lorsque la plage aléatoire n'est pas divisible uniformément par la taille du jeu de caractères. L'échantillonnage par rejet écarte les valeurs injustes et recommence.",
          "Les mots de passe deviennent plus difficiles à prédire car les attaquants ne peuvent pas exploiter de motifs de sélection.",
        ],
      },
      {
        icon: BarChart3,
        title: "Analyse intelligente de robustesse",
        paragraphs: [
          "Un bon indicateur doit aller au-delà de la longueur et des règles de symboles. Des chaînes prévisibles peuvent paraître complexes tout en restant faibles.",
          "Nous utilisons une analyse de type zxcvbn pour détecter motifs courants, mots du dictionnaire, séquences, répétitions, entropie et estimations réalistes du temps de cassage.",
          "Vous obtenez ainsi une vision plus réaliste qu'avec une simple liste de critères.",
        ],
        bullets: [
          { title: "Motifs courants", body: "chemins clavier, séquences et répétitions" },
          { title: "Attaques par dictionnaire", body: "mots, noms et variantes issues de fuites" },
          { title: "Entropie", body: "ce qui est réellement imprévisible dans le mot de passe" },
          { title: "Temps de cassage", body: "le temps réaliste nécessaire à un attaquant" },
        ],
      },
    ],
    bestPracticesTitle: "Bonnes pratiques de mots de passe",
    bestPractices: [
      { title: "Utilisez des mots de passe uniques", body: "Ne réutilisez jamais un mot de passe entre plusieurs comptes." },
      { title: "Plus long, c'est mieux", body: "Visez au moins 16 caractères ; davantage pour les comptes importants." },
      { title: "Utilisez un gestionnaire", body: "Stockez les mots de passe générés en sécurité pour ne pas les mémoriser." },
      { title: "Activez la double authentification", body: "Même les mots de passe forts profitent d'une couche supplémentaire." },
      { title: "Ne partagez pas vos mots de passe", body: "Ne les donnez jamais à quelqu'un prétendant être le support." },
    ],
  },
  es: {
    intro: "Crear una contraseña fuerte es más que combinar caracteres aleatorios. En PrivateNote.ai, nuestro generador se basa en tres principios:",
    lead: "Así funciona cada componente para proteger tus cuentas.",
    cards: [
      { icon: Lock, title: "Seguridad criptográfica", body: "La misma clase de aleatoriedad segura usada para claves y tokens." },
      { icon: Zap, title: "Aleatoriedad sin sesgo", body: "Cada carácter tiene la misma probabilidad de ser elegido." },
      { icon: BarChart3, title: "Análisis inteligente de fortaleza", body: "Análisis avanzado más allá de comprobar longitud." },
    ],
    sections: [
      {
        icon: Lock,
        title: "Crypto Web API",
        paragraphs: [
          "El generador usa la Web Crypto API para obtener valores aleatorios criptográficamente seguros adecuados para tareas críticas.",
          "La aleatoriedad se alimenta desde el sistema operativo y está diseñada para que los valores futuros no puedan predecirse en la práctica sin acceso al estado interno.",
          "Toda la generación ocurre en tu navegador. Tu contraseña nunca sale de tu dispositivo, así que no puede registrarse, interceptarse ni filtrarse desde nuestros servidores.",
        ],
        notes: [
          {
            title: "Por qué importa",
            body: "La generación en servidor añade exposición por tránsito de red y registros. La generación local evita esos riesgos por completo.",
          },
        ],
      },
      {
        icon: Zap,
        title: "Aleatoriedad sin sesgo",
        paragraphs: [
          "Usamos muestreo por rechazo para que cada carácter tenga la misma probabilidad de aparecer. Esto elimina sesgos sutiles.",
          "La selección por módulo puede estar sesgada si el rango aleatorio no se divide de forma uniforme por el tamaño del conjunto de caracteres. El muestreo por rechazo descarta valores injustos y vuelve a generar.",
          "Esto hace que las contraseñas sean más difíciles de predecir porque los atacantes no pueden explotar patrones de selección.",
        ],
      },
      {
        icon: BarChart3,
        title: "Análisis inteligente de fortaleza",
        paragraphs: [
          "Un buen medidor debe mirar más allá de longitud y reglas de símbolos. Cadenas predecibles pueden parecer complejas y seguir siendo débiles.",
          "Usamos un análisis tipo zxcvbn para detectar patrones comunes, palabras de diccionario, secuencias, repeticiones, entropía y estimaciones realistas de tiempo de ataque.",
          "Así obtienes una visión más realista que con una simple lista de requisitos.",
        ],
        bullets: [
          { title: "Patrones comunes", body: "rutas de teclado, secuencias y caracteres repetidos" },
          { title: "Ataques de diccionario", body: "palabras, nombres y variaciones de contraseñas filtradas" },
          { title: "Entropía", body: "cuánto de la contraseña es realmente impredecible" },
          { title: "Tiempo de ataque", body: "cuánto tardaría un atacante de forma realista" },
        ],
      },
    ],
    bestPracticesTitle: "Buenas prácticas de contraseñas",
    bestPractices: [
      { title: "Usa contraseñas únicas", body: "Nunca reutilices contraseñas entre cuentas." },
      { title: "Más larga es mejor", body: "Apunta al menos a 16 caracteres; más para cuentas importantes." },
      { title: "Usa un gestor de contraseñas", body: "Guarda las contraseñas generadas de forma segura para no memorizarlas." },
      { title: "Activa dos factores", body: "Incluso las contraseñas fuertes se benefician de una capa adicional." },
      { title: "No compartas contraseñas", body: "Nunca las compartas con alguien que diga ser soporte." },
    ],
  },
};

export const PasswordGenerationPost: React.FC = () => {
  const { language, t } = useLanguage();
  const article = copy[language] ?? copy.en;
  const passwordPath = localizedPath("/password-generator", language);
  const blogPath = localizedPath("/blog", language);

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />
      <article>
        <BlogPostHeader slug="how-we-generate-passwords" title={t.blogPasswordTitle} headerClassName="mb-16">
          <div className="mt-6 space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mb-8">
            <p className="text-lg">{article.intro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {article.cards.map(({ icon: Icon, title, body }) => (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4" key={title}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{body}</p>
              </div>
            ))}
          </div>

          <div className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            <p>{article.lead}</p>
          </div>
        </BlogPostHeader>

        {article.sections.map(({ icon: Icon, title, paragraphs, notes, bullets }) => (
          <React.Fragment key={title}>
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {notes?.map((note) => (
                  <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700" key={note.title}>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">{note.title}:</strong> {note.body}
                    </p>
                  </div>
                ))}
                {bullets && (
                  <ul className="space-y-3 ml-4 text-gray-600 dark:text-gray-400">
                    {bullets.map((item) => (
                      <li key={item.title}>
                        <strong className="text-gray-900 dark:text-white">{item.title}:</strong> {item.body}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
            <div className="my-16 border-t border-gray-200 dark:border-gray-700" />
          </React.Fragment>
        ))}

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-primary" />
            {article.bestPracticesTitle}
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            {article.bestPractices.map((item) => (
              <li className="flex items-start gap-3" key={item.title}>
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </span>
                <span>
                  <strong className="text-gray-900 dark:text-white">{item.title}:</strong> {item.body}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <Link
            href={passwordPath}
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            ← {t.blogBackToPasswordGenerator}
          </Link>
          <Link
            href={blogPath}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t.blogViewAllArticles} →
          </Link>
        </div>
      </article>
    </div>
  );
};
