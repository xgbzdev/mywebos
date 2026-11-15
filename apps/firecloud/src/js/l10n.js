/* FireCloud translations. English is the default; the user can pick another
 * language on the sign-in screen or in the menu (remembered on the device). */
var LANGS = [
  ["en", "English"], ["it", "Italiano"], ["el", "Ελληνικά"], ["es", "Español"],
  ["fr", "Français"], ["de", "Deutsch"], ["pt", "Português"], ["pl", "Polski"]
];
var L10N = {
  en: {
    setupTitle: "FireCloud setup", setupText: "Enter your FireCloud server (Supabase project) details once.",
    serverUrl: "Server address", publicKey: "Publishable key", keyHint: "Never use the secret / service_role key here.",
    save: "Save", tagline: "Your personal space for photos, videos, apps and devices.", email: "Email",
    password: "Password", createAccount: "Create account", signIn: "Sign in", photos: "Photos", apps: "Apps",
    find: "Find device", noPhotos: "No photos or videos yet.",
    appsHint: "Back up Firefox OS app packages (.zip) and reinstall them on any B2L device.",
    noApps: "No apps backed up yet.", thisDevice: "This device",
    allowLocate: "Allow my FireCloud account to locate this device",
    locateNotice: "While this is on, FireCloud shares this device's location only with your own account.",
    upload: "Upload", refresh: "Refresh", openMap: "Open map", ring: "Play sound", delete: "Delete",
    download: "Download", cancel: "Cancel", renameDevice: "Rename this device", serverSettings: "Server settings",
    signOut: "Sign out", close: "Close", language: "Language",
    checkEmail: "Account created. Check your email to confirm it, then sign in.", wrongLogin: "Wrong email or password.",
    needFields: "Enter your email and a password of at least 8 characters.", uploading: "Uploading %1…", uploaded: "Uploaded",
    deleteQ: "Delete “%1” from FireCloud?", signOutQ: "Sign out of FireCloud on this device?",
    netError: "Can't reach FireCloud. %1", helperDown: "The B2L helper isn't running on this phone. Start it, then try again.",
    used: "%1 of %2 used", neverSeen: "Location not reported yet", seen: "Last seen %1", justNow: "just now",
    locOff: "Locating is turned off on this device", accuracy: "Accurate to about %1 m",
    ringSent: "The device will play a sound when FireCloud is open on it.",
    ringing: "FireCloud: your account asked this device to play a sound.", newName: "Device name",
    quotaFull: "Your FireCloud space is full.", tooBig: "“%1” is larger than 10 MB.", install: "Install",
    noLocation: "This device can't report its location.", removeDeviceQ: "Remove “%1” from your devices?",
    remove: "Remove", thisOne: "(this device)", phoneName: "Firefox OS phone", pcName: "B2L computer"
  },
  it: {
    setupTitle: "Configura FireCloud", setupText: "Inserisci una volta i dati del server FireCloud (progetto Supabase).",
    serverUrl: "Indirizzo del server", publicKey: "Chiave pubblicabile", keyHint: "Non usare mai qui la chiave segreta / service_role.",
    save: "Salva", tagline: "Il tuo spazio per foto, video, app e dispositivi.", email: "Email",
    password: "Password", createAccount: "Crea account", signIn: "Accedi", photos: "Foto", apps: "App",
    find: "Trova dispositivo", noPhotos: "Ancora nessuna foto o video.",
    appsHint: "Salva i pacchetti delle app Firefox OS (.zip) e reinstallali su qualsiasi dispositivo B2L.",
    noApps: "Nessuna app salvata.", thisDevice: "Questo dispositivo",
    allowLocate: "Consenti al mio account FireCloud di localizzare questo dispositivo",
    locateNotice: "Finché è attivo, FireCloud condivide la posizione di questo dispositivo solo con il tuo account.",
    upload: "Carica", refresh: "Aggiorna", openMap: "Apri mappa", ring: "Fai suonare", delete: "Elimina",
    download: "Scarica", cancel: "Annulla", renameDevice: "Rinomina questo dispositivo", serverSettings: "Impostazioni server",
    signOut: "Esci", close: "Chiudi", language: "Lingua",
    checkEmail: "Account creato. Controlla l'email per confermarlo, poi accedi.", wrongLogin: "Email o password errati.",
    needFields: "Inserisci l'email e una password di almeno 8 caratteri.", uploading: "Caricamento di %1…", uploaded: "Caricato",
    deleteQ: "Eliminare “%1” da FireCloud?", signOutQ: "Uscire da FireCloud su questo dispositivo?",
    netError: "FireCloud non raggiungibile. %1", helperDown: "Il B2L helper non è attivo su questo telefono. Avvialo e riprova.",
    used: "%1 di %2 usati", neverSeen: "Posizione non ancora inviata", seen: "Visto %1", justNow: "adesso",
    locOff: "La localizzazione è disattivata su questo dispositivo", accuracy: "Precisione circa %1 m",
    ringSent: "Il dispositivo suonerà quando FireCloud sarà aperto.",
    ringing: "FireCloud: il tuo account ha chiesto a questo dispositivo di suonare.", newName: "Nome del dispositivo",
    quotaFull: "Il tuo spazio FireCloud è pieno.", tooBig: "“%1” supera i 10 MB.", install: "Installa",
    noLocation: "Questo dispositivo non può inviare la posizione.", removeDeviceQ: "Rimuovere “%1” dai tuoi dispositivi?",
    remove: "Rimuovi", thisOne: "(questo dispositivo)", phoneName: "Telefono Firefox OS", pcName: "Computer B2L"
  },
  el: {
    setupTitle: "Ρύθμιση FireCloud", setupText: "Εισαγάγετε μία φορά τα στοιχεία του διακομιστή FireCloud (έργο Supabase).",
    serverUrl: "Διεύθυνση διακομιστή", publicKey: "Δημοσιεύσιμο κλειδί", keyHint: "Μη χρησιμοποιείτε ποτέ εδώ το μυστικό κλειδί / service_role.",
    save: "Αποθήκευση", tagline: "Ο προσωπικός σας χώρος για φωτογραφίες, βίντεο, εφαρμογές και συσκευές.", email: "Email",
    password: "Κωδικός", createAccount: "Δημιουργία λογαριασμού", signIn: "Σύνδεση", photos: "Φωτογραφίες", apps: "Εφαρμογές",
    find: "Εύρεση συσκευής", noPhotos: "Δεν υπάρχουν ακόμη φωτογραφίες ή βίντεο.",
    appsHint: "Δημιουργήστε αντίγραφα των πακέτων εφαρμογών Firefox OS (.zip) και εγκαταστήστε τα ξανά σε οποιαδήποτε συσκευή B2L.",
    noApps: "Δεν υπάρχουν αποθηκευμένες εφαρμογές.", thisDevice: "Αυτή η συσκευή",
    allowLocate: "Να επιτρέπεται στον λογαριασμό μου FireCloud να εντοπίζει αυτή τη συσκευή",
    locateNotice: "Όσο είναι ενεργό, το FireCloud μοιράζεται τη θέση αυτής της συσκευής μόνο με τον δικό σας λογαριασμό.",
    upload: "Μεταφόρτωση", refresh: "Ανανέωση", openMap: "Άνοιγμα χάρτη", ring: "Αναπαραγωγή ήχου", delete: "Διαγραφή",
    download: "Λήψη", cancel: "Ακύρωση", renameDevice: "Μετονομασία συσκευής", serverSettings: "Ρυθμίσεις διακομιστή",
    signOut: "Αποσύνδεση", close: "Κλείσιμο", language: "Γλώσσα",
    checkEmail: "Ο λογαριασμός δημιουργήθηκε. Ελέγξτε το email σας για επιβεβαίωση και μετά συνδεθείτε.",
    wrongLogin: "Λάθος email ή κωδικός.", needFields: "Εισαγάγετε email και κωδικό τουλάχιστον 8 χαρακτήρων.",
    uploading: "Μεταφόρτωση %1…", uploaded: "Μεταφορτώθηκε", deleteQ: "Διαγραφή του «%1» από το FireCloud;",
    signOutQ: "Αποσύνδεση από το FireCloud σε αυτή τη συσκευή;", netError: "Δεν είναι δυνατή η σύνδεση με το FireCloud. %1",
    helperDown: "Ο B2L helper δεν εκτελείται σε αυτό το τηλέφωνο. Ξεκινήστε τον και δοκιμάστε ξανά.",
    used: "%1 από %2 σε χρήση", neverSeen: "Δεν έχει σταλεί ακόμη θέση", seen: "Τελευταία φορά %1", justNow: "μόλις τώρα",
    locOff: "Ο εντοπισμός είναι απενεργοποιημένος σε αυτή τη συσκευή", accuracy: "Ακρίβεια περίπου %1 m",
    ringSent: "Η συσκευή θα παίξει ήχο όταν ανοίξει το FireCloud.",
    ringing: "FireCloud: ο λογαριασμός σας ζήτησε από αυτή τη συσκευή να παίξει ήχο.", newName: "Όνομα συσκευής",
    quotaFull: "Ο χώρος σας στο FireCloud είναι πλήρης.", tooBig: "Το «%1» είναι μεγαλύτερο από 10 MB.", install: "Εγκατάσταση",
    noLocation: "Αυτή η συσκευή δεν μπορεί να στείλει τη θέση της.", removeDeviceQ: "Αφαίρεση του «%1» από τις συσκευές σας;",
    remove: "Αφαίρεση", thisOne: "(αυτή η συσκευή)", phoneName: "Τηλέφωνο Firefox OS", pcName: "Υπολογιστής B2L"
  },
  es: {
    setupTitle: "Configurar FireCloud", setupText: "Introduce una vez los datos del servidor FireCloud (proyecto Supabase).",
    serverUrl: "Dirección del servidor", publicKey: "Clave publicable", keyHint: "Nunca uses aquí la clave secreta / service_role.",
    save: "Guardar", tagline: "Tu espacio personal para fotos, vídeos, apps y dispositivos.", email: "Correo",
    password: "Contraseña", createAccount: "Crear cuenta", signIn: "Iniciar sesión", photos: "Fotos", apps: "Apps",
    find: "Buscar dispositivo", noPhotos: "Todavía no hay fotos ni vídeos.",
    appsHint: "Guarda copias de los paquetes de apps de Firefox OS (.zip) y reinstálalos en cualquier dispositivo B2L.",
    noApps: "No hay apps guardadas.", thisDevice: "Este dispositivo",
    allowLocate: "Permitir que mi cuenta de FireCloud localice este dispositivo",
    locateNotice: "Mientras esté activado, FireCloud comparte la ubicación de este dispositivo solo con tu cuenta.",
    upload: "Subir", refresh: "Actualizar", openMap: "Abrir mapa", ring: "Reproducir sonido", delete: "Eliminar",
    download: "Descargar", cancel: "Cancelar", renameDevice: "Cambiar nombre del dispositivo", serverSettings: "Ajustes del servidor",
    signOut: "Cerrar sesión", close: "Cerrar", language: "Idioma",
    checkEmail: "Cuenta creada. Revisa tu correo para confirmarla y después inicia sesión.",
    wrongLogin: "Correo o contraseña incorrectos.", needFields: "Introduce tu correo y una contraseña de al menos 8 caracteres.",
    uploading: "Subiendo %1…", uploaded: "Subido", deleteQ: "¿Eliminar “%1” de FireCloud?",
    signOutQ: "¿Cerrar sesión de FireCloud en este dispositivo?", netError: "No se puede conectar con FireCloud. %1",
    helperDown: "El B2L helper no está activo en este teléfono. Inícialo e inténtalo de nuevo.",
    used: "%1 de %2 usados", neverSeen: "Ubicación aún no enviada", seen: "Visto %1", justNow: "ahora mismo",
    locOff: "La localización está desactivada en este dispositivo", accuracy: "Precisión de unos %1 m",
    ringSent: "El dispositivo sonará cuando FireCloud esté abierto en él.",
    ringing: "FireCloud: tu cuenta ha pedido a este dispositivo que suene.", newName: "Nombre del dispositivo",
    quotaFull: "Tu espacio de FireCloud está lleno.", tooBig: "“%1” supera los 10 MB.", install: "Instalar",
    noLocation: "Este dispositivo no puede enviar su ubicación.", removeDeviceQ: "¿Quitar “%1” de tus dispositivos?",
    remove: "Quitar", thisOne: "(este dispositivo)", phoneName: "Teléfono Firefox OS", pcName: "Ordenador B2L"
  },
  fr: {
    setupTitle: "Configurer FireCloud", setupText: "Saisissez une fois les informations du serveur FireCloud (projet Supabase).",
    serverUrl: "Adresse du serveur", publicKey: "Clé publiable", keyHint: "N'utilisez jamais ici la clé secrète / service_role.",
    save: "Enregistrer", tagline: "Votre espace personnel pour photos, vidéos, applis et appareils.", email: "E-mail",
    password: "Mot de passe", createAccount: "Créer un compte", signIn: "Se connecter", photos: "Photos", apps: "Applis",
    find: "Localiser l'appareil", noPhotos: "Aucune photo ni vidéo pour l'instant.",
    appsHint: "Sauvegardez les paquets d'applis Firefox OS (.zip) et réinstallez-les sur n'importe quel appareil B2L.",
    noApps: "Aucune appli sauvegardée.", thisDevice: "Cet appareil",
    allowLocate: "Autoriser mon compte FireCloud à localiser cet appareil",
    locateNotice: "Tant que c'est activé, FireCloud partage la position de cet appareil uniquement avec votre compte.",
    upload: "Envoyer", refresh: "Actualiser", openMap: "Ouvrir la carte", ring: "Faire sonner", delete: "Supprimer",
    download: "Télécharger", cancel: "Annuler", renameDevice: "Renommer cet appareil", serverSettings: "Paramètres du serveur",
    signOut: "Se déconnecter", close: "Fermer", language: "Langue",
    checkEmail: "Compte créé. Vérifiez vos e-mails pour le confirmer, puis connectez-vous.",
    wrongLogin: "E-mail ou mot de passe incorrect.", needFields: "Saisissez votre e-mail et un mot de passe d'au moins 8 caractères.",
    uploading: "Envoi de %1…", uploaded: "Envoyé", deleteQ: "Supprimer « %1 » de FireCloud ?",
    signOutQ: "Se déconnecter de FireCloud sur cet appareil ?", netError: "Impossible de joindre FireCloud. %1",
    helperDown: "Le B2L helper n'est pas lancé sur ce téléphone. Démarrez-le puis réessayez.",
    used: "%1 sur %2 utilisés", neverSeen: "Position pas encore envoyée", seen: "Vu %1", justNow: "à l'instant",
    locOff: "La localisation est désactivée sur cet appareil", accuracy: "Précision d'environ %1 m",
    ringSent: "L'appareil sonnera quand FireCloud y sera ouvert.",
    ringing: "FireCloud : votre compte a demandé à cet appareil de sonner.", newName: "Nom de l'appareil",
    quotaFull: "Votre espace FireCloud est plein.", tooBig: "« %1 » dépasse 10 Mo.", install: "Installer",
    noLocation: "Cet appareil ne peut pas envoyer sa position.", removeDeviceQ: "Retirer « %1 » de vos appareils ?",
    remove: "Retirer", thisOne: "(cet appareil)", phoneName: "Téléphone Firefox OS", pcName: "Ordinateur B2L"
  },
  de: {
    setupTitle: "FireCloud einrichten", setupText: "Gib einmalig die Daten des FireCloud-Servers (Supabase-Projekt) ein.",
    serverUrl: "Serveradresse", publicKey: "Öffentlicher Schlüssel", keyHint: "Verwende hier niemals den geheimen / service_role-Schlüssel.",
    save: "Speichern", tagline: "Dein persönlicher Bereich für Fotos, Videos, Apps und Geräte.", email: "E-Mail",
    password: "Passwort", createAccount: "Konto erstellen", signIn: "Anmelden", photos: "Fotos", apps: "Apps",
    find: "Gerät finden", noPhotos: "Noch keine Fotos oder Videos.",
    appsHint: "Sichere Firefox-OS-App-Pakete (.zip) und installiere sie auf jedem B2L-Gerät erneut.",
    noApps: "Noch keine Apps gesichert.", thisDevice: "Dieses Gerät",
    allowLocate: "Meinem FireCloud-Konto erlauben, dieses Gerät zu orten",
    locateNotice: "Solange dies aktiv ist, teilt FireCloud den Standort dieses Geräts nur mit deinem eigenen Konto.",
    upload: "Hochladen", refresh: "Aktualisieren", openMap: "Karte öffnen", ring: "Ton abspielen", delete: "Löschen",
    download: "Herunterladen", cancel: "Abbrechen", renameDevice: "Gerät umbenennen", serverSettings: "Servereinstellungen",
    signOut: "Abmelden", close: "Schließen", language: "Sprache",
    checkEmail: "Konto erstellt. Bestätige es über die E-Mail und melde dich dann an.",
    wrongLogin: "E-Mail oder Passwort falsch.", needFields: "Gib deine E-Mail und ein Passwort mit mindestens 8 Zeichen ein.",
    uploading: "%1 wird hochgeladen…", uploaded: "Hochgeladen", deleteQ: "„%1“ aus FireCloud löschen?",
    signOutQ: "Auf diesem Gerät von FireCloud abmelden?", netError: "FireCloud ist nicht erreichbar. %1",
    helperDown: "Der B2L-Helper läuft auf diesem Telefon nicht. Starte ihn und versuche es erneut.",
    used: "%1 von %2 belegt", neverSeen: "Noch kein Standort gemeldet", seen: "Zuletzt gesehen %1", justNow: "gerade eben",
    locOff: "Die Ortung ist auf diesem Gerät ausgeschaltet", accuracy: "Genauigkeit etwa %1 m",
    ringSent: "Das Gerät spielt einen Ton ab, sobald FireCloud darauf geöffnet ist.",
    ringing: "FireCloud: Dein Konto hat dieses Gerät gebeten, einen Ton abzuspielen.", newName: "Gerätename",
    quotaFull: "Dein FireCloud-Speicher ist voll.", tooBig: "„%1“ ist größer als 10 MB.", install: "Installieren",
    noLocation: "Dieses Gerät kann seinen Standort nicht melden.", removeDeviceQ: "„%1“ aus deinen Geräten entfernen?",
    remove: "Entfernen", thisOne: "(dieses Gerät)", phoneName: "Firefox-OS-Telefon", pcName: "B2L-Computer"
  },
  pt: {
    setupTitle: "Configurar o FireCloud", setupText: "Introduza uma vez os dados do servidor FireCloud (projeto Supabase).",
    serverUrl: "Endereço do servidor", publicKey: "Chave publicável", keyHint: "Nunca use aqui a chave secreta / service_role.",
    save: "Guardar", tagline: "O seu espaço pessoal para fotos, vídeos, apps e dispositivos.", email: "Email",
    password: "Palavra-passe", createAccount: "Criar conta", signIn: "Iniciar sessão", photos: "Fotos", apps: "Apps",
    find: "Encontrar dispositivo", noPhotos: "Ainda não há fotos nem vídeos.",
    appsHint: "Guarde cópias dos pacotes de apps Firefox OS (.zip) e reinstale-os em qualquer dispositivo B2L.",
    noApps: "Ainda não há apps guardadas.", thisDevice: "Este dispositivo",
    allowLocate: "Permitir que a minha conta FireCloud localize este dispositivo",
    locateNotice: "Enquanto estiver ativo, o FireCloud partilha a localização deste dispositivo apenas com a sua conta.",
    upload: "Carregar", refresh: "Atualizar", openMap: "Abrir mapa", ring: "Tocar som", delete: "Eliminar",
    download: "Transferir", cancel: "Cancelar", renameDevice: "Mudar nome do dispositivo", serverSettings: "Definições do servidor",
    signOut: "Terminar sessão", close: "Fechar", language: "Idioma",
    checkEmail: "Conta criada. Verifique o seu email para a confirmar e depois inicie sessão.",
    wrongLogin: "Email ou palavra-passe errados.", needFields: "Introduza o seu email e uma palavra-passe com pelo menos 8 caracteres.",
    uploading: "A carregar %1…", uploaded: "Carregado", deleteQ: "Eliminar “%1” do FireCloud?",
    signOutQ: "Terminar sessão no FireCloud neste dispositivo?", netError: "Não é possível ligar ao FireCloud. %1",
    helperDown: "O B2L helper não está ativo neste telemóvel. Inicie-o e tente de novo.",
    used: "%1 de %2 usados", neverSeen: "Localização ainda não enviada", seen: "Visto %1", justNow: "agora mesmo",
    locOff: "A localização está desligada neste dispositivo", accuracy: "Precisão de cerca de %1 m",
    ringSent: "O dispositivo vai tocar quando o FireCloud estiver aberto nele.",
    ringing: "FireCloud: a sua conta pediu a este dispositivo para tocar.", newName: "Nome do dispositivo",
    quotaFull: "O seu espaço FireCloud está cheio.", tooBig: "“%1” tem mais de 10 MB.", install: "Instalar",
    noLocation: "Este dispositivo não consegue enviar a localização.", removeDeviceQ: "Remover “%1” dos seus dispositivos?",
    remove: "Remover", thisOne: "(este dispositivo)", phoneName: "Telemóvel Firefox OS", pcName: "Computador B2L"
  },
  pl: {
    setupTitle: "Konfiguracja FireCloud", setupText: "Wpisz jednorazowo dane serwera FireCloud (projekt Supabase).",
    serverUrl: "Adres serwera", publicKey: "Klucz publiczny", keyHint: "Nigdy nie używaj tu klucza tajnego / service_role.",
    save: "Zapisz", tagline: "Twoje miejsce na zdjęcia, filmy, aplikacje i urządzenia.", email: "E-mail",
    password: "Hasło", createAccount: "Utwórz konto", signIn: "Zaloguj się", photos: "Zdjęcia", apps: "Aplikacje",
    find: "Znajdź urządzenie", noPhotos: "Brak zdjęć i filmów.",
    appsHint: "Twórz kopie pakietów aplikacji Firefox OS (.zip) i instaluj je ponownie na dowolnym urządzeniu B2L.",
    noApps: "Brak zapisanych aplikacji.", thisDevice: "To urządzenie",
    allowLocate: "Zezwól mojemu kontu FireCloud na lokalizowanie tego urządzenia",
    locateNotice: "Gdy to jest włączone, FireCloud udostępnia położenie tego urządzenia tylko Twojemu kontu.",
    upload: "Prześlij", refresh: "Odśwież", openMap: "Otwórz mapę", ring: "Odtwórz dźwięk", delete: "Usuń",
    download: "Pobierz", cancel: "Anuluj", renameDevice: "Zmień nazwę urządzenia", serverSettings: "Ustawienia serwera",
    signOut: "Wyloguj się", close: "Zamknij", language: "Język",
    checkEmail: "Konto utworzone. Potwierdź je w wiadomości e-mail, a potem się zaloguj.",
    wrongLogin: "Nieprawidłowy e-mail lub hasło.", needFields: "Wpisz e-mail i hasło o długości co najmniej 8 znaków.",
    uploading: "Przesyłanie %1…", uploaded: "Przesłano", deleteQ: "Usunąć „%1” z FireCloud?",
    signOutQ: "Wylogować się z FireCloud na tym urządzeniu?", netError: "Brak połączenia z FireCloud. %1",
    helperDown: "B2L helper nie działa na tym telefonie. Uruchom go i spróbuj ponownie.",
    used: "Użyto %1 z %2", neverSeen: "Położenie nie zostało jeszcze wysłane", seen: "Ostatnio widziane %1", justNow: "przed chwilą",
    locOff: "Lokalizowanie jest wyłączone na tym urządzeniu", accuracy: "Dokładność około %1 m",
    ringSent: "Urządzenie odtworzy dźwięk, gdy FireCloud zostanie na nim otwarty.",
    ringing: "FireCloud: Twoje konto poprosiło to urządzenie o odtworzenie dźwięku.", newName: "Nazwa urządzenia",
    quotaFull: "Twoje miejsce w FireCloud jest pełne.", tooBig: "„%1” ma ponad 10 MB.", install: "Zainstaluj",
    noLocation: "To urządzenie nie może wysłać swojego położenia.", removeDeviceQ: "Usunąć „%1” z Twoich urządzeń?",
    remove: "Usuń", thisOne: "(to urządzenie)", phoneName: "Telefon Firefox OS", pcName: "Komputer B2L"
  }
};

/* English by default; a choice made in the app is remembered. */
var LANG = (function () {
  var saved = null;
  try { saved = window.localStorage.getItem("fc_lang"); } catch (e) {}
  return (saved && L10N[saved]) ? saved : "en";
})();

function _(key) {
  var s = (L10N[LANG] && L10N[LANG][key]) || L10N.en[key] || key;
  for (var i = 1; i < arguments.length; i++) { s = s.replace("%" + i, arguments[i]); }
  return s;
}
function setLang(code) {
  if (!L10N[code]) { return; }
  LANG = code;
  try { window.localStorage.setItem("fc_lang", code); } catch (e) {}
  document.documentElement.lang = code;
  translatePage();
}
function translatePage() {
  var els = document.querySelectorAll("[data-l10n]");
  for (var i = 0; i < els.length; i++) { els[i].textContent = _(els[i].getAttribute("data-l10n")); }
  els = document.querySelectorAll("[data-l10n-ph]");
  for (i = 0; i < els.length; i++) { els[i].placeholder = _(els[i].getAttribute("data-l10n-ph")); }
}
/* Fill a <select> with the language list. */
function fillLangSelect(sel) {
  sel.innerHTML = "";
  for (var i = 0; i < LANGS.length; i++) {
    var o = document.createElement("option");
    o.value = LANGS[i][0]; o.textContent = LANGS[i][1];
    if (LANGS[i][0] === LANG) { o.selected = true; }
    sel.appendChild(o);
  }
}
