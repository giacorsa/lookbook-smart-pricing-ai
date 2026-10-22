
export function getUserFriendlyError(error) {
  switch (error?.code) {
    case "RATE_LIMIT_EXCEEDED":
      return "Il servizio AI ha raggiunto il limite di richieste. Attendi qualche minuto e riprova.";

    case "AI_TIMEOUT":
      return "La valutazione sta richiedendo troppo tempo. Riprova più tardi.";

    case "AI_SERVICE_UNAVAILABLE":
      return "Il servizio di valutazione AI non è temporaneamente disponibile.";

    case "AI_PROVIDER_ERROR":
      return "Non è stato possibile completare la valutazione AI. Riprova.";

    case "VALIDATION_ERROR":
      return "Alcuni dati del capo non sono validi. Controlla il modulo.";

    case "FILE_TOO_LARGE":
      return "La fotografia supera il limite massimo di 5 MiB.";

    case "UNSUPPORTED_MEDIA_TYPE":
      return "Formato immagine non supportato. Utilizza JPEG, PNG o WebP.";

    case "NETWORK_ERROR":
      return "Impossibile raggiungere il server. Verifica la connessione.";

    case "INVALID_RESPONSE":
      return "Il server ha restituito una risposta non valida.";

    default:
      return "Si è verificato un errore imprevisto durante la valutazione.";
  }
}
