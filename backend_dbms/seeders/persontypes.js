const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// === FILE CONFIG ===
const inputFilePath = path.join(__dirname, ".json"); // input file
const outputFolder = path.join(__dirname, "json-outputs");
const outputFile = path.join(outputFolder, "person_types.json");

// === VALIDATE INPUT ===
if (!fs.existsSync(inputFilePath)) {
  console.error("❌ Input vendors JSON not found at:", inputFilePath);
  process.exit(1);
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// === READ VENDORS JSON ===
const vendorsData = JSON.parse(fs.readFileSync(inputFilePath, "utf-8"));

// === EXTRACT UNIQUE KEYS (PARENT NODES) ===
const parentKeys = Object.keys(vendorsData);

// === CONVERT TO person_types FORMAT ===
const personTypes = parentKeys.map((name) => ({
  id: uuidv4(),
  name: name.trim(),
}));

// === WRITE OUTPUT ===
fs.writeFileSync(outputFile, JSON.stringify(personTypes, null, 2), "utf-8");

console.log("✅ Extracted", personTypes.length, "person types");
console.log("➡️ Saved to:", outputFile);
