function isValidPrice(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

export function validateEvaluation(evaluation) {
  if (
    !evaluation ||
    typeof evaluation !== "object" ||
    Array.isArray(evaluation)
  ) {
    throw new Error("La valutazione deve essere un oggetto.");
  }

  const {
    suggested_price,
    range,
    motivation,
    selling_tips
  } = evaluation;

  if (!isValidPrice(suggested_price)) {
    throw new Error("Prezzo suggerito non valido.");
  }

  if (
    !range ||
    typeof range !== "object" ||
    Array.isArray(range) ||
    !isValidPrice(range.min) ||
    !isValidPrice(range.max)
  ) {
    throw new Error("Intervallo di prezzo non valido.");
  }

  if (
    range.max <= range.min ||
    suggested_price < range.min ||
    suggested_price > range.max
  ) {
    throw new Error("Intervallo di prezzo incoerente.");
  }

  if (
    typeof motivation !== "string" ||
    motivation.trim().length === 0
  ) {
    throw new Error("Motivazione mancante o non valida.");
  }

  if (
    !Array.isArray(selling_tips) ||
    selling_tips.length === 0 ||
    !selling_tips.every(
      tip => typeof tip === "string" && tip.trim().length > 0
    )
  ) {
    throw new Error("Consigli di vendita non validi.");
  }

  return {
    suggested_price,
    range: {
      min: range.min,
      max: range.max
    },
    motivation: motivation.trim(),
    selling_tips: selling_tips.map(tip => tip.trim())
  };
}
