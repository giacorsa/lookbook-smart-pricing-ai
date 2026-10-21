export function buildEvaluationUserPrompt(garmentData) {
  const { category, brand, condition } = garmentData;

  return `
Valuta il capo di abbigliamento mostrato nella fotografia allegata.

DATI DICHIARATI DALL'UTENTE
Categoria: ${category}
Brand: ${brand}
Condizioni: ${condition}

ISTRUZIONI
- Analizza la fotografia.
- Considera i dati dichiarati.
- Segnala eventuali discrepanze tra fotografia e dati.
- Non inventare caratteristiche non verificabili.
- Restituisci esclusivamente il JSON previsto dal System Prompt.
`;
}
