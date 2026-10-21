import test from "node:test";
import assert from "node:assert/strict";

import {  buildGroqMessages } from "../src/services/groqMessageBuilder.js";

function createGarmentData() {
  return {
    category: "jeans",
    brand: "Levi's",
    condition: "buono",
    image: {
      mimetype: "image/jpeg",
      buffer: Buffer.from([
        0xff, 0xd8, 0xff, 0xd9
      ])
    }
  };
}

test("G1 - Produce due messaggi", () => {
  const messages = buildGroqMessages(
    createGarmentData()
  );

  assert.equal(messages.length, 2);
  assert.equal(messages[0].role, "system");
  assert.equal(messages[1].role, "user");
});

test("G2 - Include i dati del capo", () => {
  const messages = buildGroqMessages(
    createGarmentData()
  );

  const text = messages[1].content[0].text;

  assert.match(text, /jeans/);
  assert.match(text, /Levi's/);
  assert.match(text, /buono/);
});

test("G3 - Include l'immagine Base64", () => {
  const messages = buildGroqMessages(
    createGarmentData()
  );

  const image = messages[1].content[1];

  assert.equal(image.type, "image_url");

  assert.match(
    image.image_url.url,
    /^data:image\/jpeg;base64,/
  );
});

test("G4 - Rifiuta un'immagine mancante", () => {
  const garment = createGarmentData();
  garment.image = null;

  assert.throws(
    () => buildGroqMessages(garment),
    /Immagine non disponibile/
  );
});

test("G5 - Rifiuta un buffer vuoto", () => {
  const garment = createGarmentData();
  garment.image.buffer = Buffer.alloc(0);

  assert.throws(
    () => buildGroqMessages(garment),
    /Immagine non disponibile/
  );
});
