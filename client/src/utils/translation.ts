interface Translations {
  [key: string]: string;
}

interface LanguageMap {
  [locale: string]: Translations;
}

// Default English translations
const defaultTranslations: Translations = {
  createNote: 'Create Encrypted Note',
  typeHere: 'Type your confidential message here...',
  destroyAfterReading: 'Destroy after reading',
  expiresIn: 'Expires in 24 hours',
  createButton: 'Create Secure Note',
  shareLink: 'Share this secure link',
  linkContainsKey: 'The link contains the decryption key. Anyone with this link can read your note.',
  qrCode: 'QR Code',
  scanToAccess: 'Scan this code to access your note',
  securityLevel: 'Security Level',
  strongSecurity: 'Very Strong',
  encryptionDetails: 'AES-256-GCM encryption with 256-bit key',
  createAnother: 'Create Another Note',
  copied: 'Copied!',
  copy: 'Copy',
  passwordGenerator: 'Password Generator',
  passwordDesc: 'Create strong, unique passwords to keep your online accounts secure.',
  length: 'Length',
  uppercase: 'Uppercase Letters',
  lowercase: 'Lowercase Letters',
  numbers: 'Numbers',
  symbols: 'Symbols',
  excludeSimilar: 'Exclude Similar Characters (I, l, 1, O, 0)',
  generateButton: 'Generate New Password',
  generating: 'Generating...',
  yourPassword: 'Your Password',
  strength: 'Strength',
  weakPassword: 'Weak',
  mediumPassword: 'Medium',
  strongPassword: 'Strong',
  copyButton: 'Copy to Clipboard',
  noteUnavailable: 'Note Unavailable',
  noteNotFound: 'The note could not be found or has already been read.',
  createNewNote: 'Create New Note',
  missingKey: 'Missing Decryption Key',
  missingKeyDesc: 'The URL is incomplete. The decryption key is missing from the URL fragment.',
};

// German translations
const deTranslations: Translations = {
  createNote: 'Verschlüsselte Notiz erstellen',
  typeHere: 'Geben Sie hier Ihre vertrauliche Nachricht ein...',
  destroyAfterReading: 'Nach dem Lesen zerstören',
  expiresIn: 'Läuft in 24 Stunden ab',
  createButton: 'Sichere Notiz erstellen',
  shareLink: 'Teilen Sie diesen sicheren Link',
  linkContainsKey: 'Der Link enthält den Entschlüsselungsschlüssel. Jeder mit diesem Link kann Ihre Notiz lesen.',
  qrCode: 'QR-Code',
  scanToAccess: 'Scannen Sie diesen Code, um auf Ihre Notiz zuzugreifen',
  securityLevel: 'Sicherheitsstufe',
  strongSecurity: 'Sehr stark',
  encryptionDetails: 'AES-256-GCM-Verschlüsselung mit 256-Bit-Schlüssel',
  createAnother: 'Weitere Notiz erstellen',
  copied: 'Kopiert!',
  copy: 'Kopieren',
  passwordGenerator: 'Passwortgenerator',
  passwordDesc: 'Erstellen Sie starke, einzigartige Passwörter, um Ihre Online-Konten zu schützen.',
  length: 'Länge',
  uppercase: 'Großbuchstaben',
  lowercase: 'Kleinbuchstaben',
  numbers: 'Zahlen',
  symbols: 'Symbole',
  excludeSimilar: 'Ähnliche Zeichen ausschließen (I, l, 1, O, 0)',
  generateButton: 'Neues Passwort generieren',
  generating: 'Generiere...',
  yourPassword: 'Ihr Passwort',
  strength: 'Stärke',
  weakPassword: 'Schwach',
  mediumPassword: 'Mittel',
  strongPassword: 'Stark',
  copyButton: 'In die Zwischenablage kopieren',
  noteUnavailable: 'Notiz nicht verfügbar',
  noteNotFound: 'Die Notiz konnte nicht gefunden werden oder wurde bereits gelesen.',
  createNewNote: 'Neue Notiz erstellen',
  missingKey: 'Fehlender Entschlüsselungsschlüssel',
  missingKeyDesc: 'Die URL ist unvollständig. Der Entschlüsselungsschlüssel fehlt im URL-Fragment.',
};

// Spanish translations
const esTranslations: Translations = {
  createNote: 'Crear nota cifrada',
  typeHere: 'Escriba su mensaje confidencial aquí...',
  destroyAfterReading: 'Destruir después de leer',
  expiresIn: 'Expira en 24 horas',
  createButton: 'Crear nota segura',
  shareLink: 'Comparta este enlace seguro',
  linkContainsKey: 'El enlace contiene la clave de descifrado. Cualquier persona con este enlace puede leer su nota.',
  qrCode: 'Código QR',
  scanToAccess: 'Escanee este código para acceder a su nota',
  securityLevel: 'Nivel de seguridad',
  strongSecurity: 'Muy fuerte',
  encryptionDetails: 'Cifrado AES-256-GCM con clave de 256 bits',
  createAnother: 'Crear otra nota',
  copied: '¡Copiado!',
  copy: 'Copiar',
  passwordGenerator: 'Generador de contraseñas',
  passwordDesc: 'Cree contraseñas fuertes y únicas para mantener sus cuentas en línea seguras.',
  length: 'Longitud',
  uppercase: 'Letras mayúsculas',
  lowercase: 'Letras minúsculas',
  numbers: 'Números',
  symbols: 'Símbolos',
  excludeSimilar: 'Excluir caracteres similares (I, l, 1, O, 0)',
  generateButton: 'Generar nueva contraseña',
  generating: 'Generando...',
  yourPassword: 'Su contraseña',
  strength: 'Fortaleza',
  weakPassword: 'Débil',
  mediumPassword: 'Media',
  strongPassword: 'Fuerte',
  copyButton: 'Copiar al portapapeles',
  noteUnavailable: 'Nota no disponible',
  noteNotFound: 'La nota no se pudo encontrar o ya ha sido leída.',
  createNewNote: 'Crear nueva nota',
  missingKey: 'Falta la clave de descifrado',
  missingKeyDesc: 'La URL está incompleta. Falta la clave de descifrado en el fragmento de URL.',
};

// French translations
const frTranslations: Translations = {
  createNote: 'Créer une note chiffrée',
  typeHere: 'Tapez votre message confidentiel ici...',
  destroyAfterReading: 'Détruire après lecture',
  expiresIn: 'Expire dans 24 heures',
  createButton: 'Créer une note sécurisée',
  shareLink: 'Partagez ce lien sécurisé',
  linkContainsKey: 'Le lien contient la clé de déchiffrement. Toute personne disposant de ce lien peut lire votre note.',
  qrCode: 'Code QR',
  scanToAccess: 'Scannez ce code pour accéder à votre note',
  securityLevel: 'Niveau de sécurité',
  strongSecurity: 'Très fort',
  encryptionDetails: 'Chiffrement AES-256-GCM avec clé de 256 bits',
  createAnother: 'Créer une autre note',
  copied: 'Copié !',
  copy: 'Copier',
  passwordGenerator: 'Générateur de mots de passe',
  passwordDesc: 'Créez des mots de passe forts et uniques pour sécuriser vos comptes en ligne.',
  length: 'Longueur',
  uppercase: 'Lettres majuscules',
  lowercase: 'Lettres minuscules',
  numbers: 'Chiffres',
  symbols: 'Symboles',
  excludeSimilar: 'Exclure les caractères similaires (I, l, 1, O, 0)',
  generateButton: 'Générer un nouveau mot de passe',
  generating: 'Génération...',
  yourPassword: 'Votre mot de passe',
  strength: 'Force',
  weakPassword: 'Faible',
  mediumPassword: 'Moyen',
  strongPassword: 'Fort',
  copyButton: 'Copier dans le presse-papiers',
  noteUnavailable: 'Note non disponible',
  noteNotFound: 'La note est introuvable ou a déjà été lue.',
  createNewNote: 'Créer une nouvelle note',
  missingKey: 'Clé de déchiffrement manquante',
  missingKeyDesc: 'L\'URL est incomplète. La clé de déchiffrement est manquante dans le fragment d\'URL.',
};

// Language map
const translations: LanguageMap = {
  en: defaultTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
};

// Get user's preferred language
export function getUserLanguage(): string {
  return navigator.language.split('-')[0] || 'en';
}

// Get translations based on language code
export function getTranslations(lang: string = 'en'): Translations {
  return translations[lang] || defaultTranslations;
}
