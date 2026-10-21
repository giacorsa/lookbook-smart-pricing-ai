import { evaluateWithGroq } from "./groqClient.js";


export async function evaluateGarmentService(garmentData) {
  const result = await evaluateWithGroq(garmentData);

  return result.evaluation;
}

// export async function evaluateGarmentService(garmentData) {
//   const { category, brand, condition } = garmentData;

//   // Simulazione di un'elaborazione asincrona
//   await new Promise(resolve => setTimeout(resolve, 500));

//   return {
//     suggested_price: 22,

//     range: {
//       min: 18,
//       max: 27
//     },

//     motivation:
//       `Valutazione simulata per un capo della categoria ` +
//       `"${category}", brand "${brand}", ` +
//       `in condizione "${condition}". ` +
//       `Il prezzo è dimostrativo e non proviene da un modello AI.`,

//     selling_tips: [
//       "Utilizza fotografie luminose e ben definite.",
//       "Indica taglia, misure e condizioni del capo.",
//       "Descrivi eventuali difetti in modo trasparente."
//     ]
//   };
// }
