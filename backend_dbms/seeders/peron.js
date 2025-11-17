const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// === INPUT FILES ===
const personTypesFile = path.join(
  __dirname,
  "./json-outputs/person_types.json"
);
const vendorsFile = path.join(__dirname, ".json");

// === OUTPUT FILES ===
const personsOutputFile = path.join(__dirname, "persons_normalized.json");
const brandCompaniesOutputFile = path.join(__dirname, "brand_companies.json");

// === VALIDATION ===
if (!fs.existsSync(vendorsFile)) {
  console.error("❌ vendors.json missing");
  process.exit(1);
}

if (!fs.existsSync(personTypesFile)) {
  console.error("❌ person_types.json missing");
  process.exit(1);
}

// === LOAD DATA ===
const vendorsData = JSON.parse(fs.readFileSync(vendorsFile, "utf-8"));
const personTypes = JSON.parse(fs.readFileSync(personTypesFile, "utf-8"));

// === PERSON TYPE MAP ===
const typeMap = {};
personTypes.forEach((t) => {
  typeMap[t.name.trim()] = t.id;
});

// === DEFAULT BRAND COMPANY ID ===
const DEFAULT_BRAND_COMPANY_ID = "00000000-0000-0000-0000-000000000000";

// === BRAND COMPANY MAP (name -> id) ===
const brandCompanyMap = {};
const brandCompanies = [];

// Register a brand if exists, else default company
function getBrandCompanyId(companyName) {
  if (!companyName || !companyName.trim()) {
    return DEFAULT_BRAND_COMPANY_ID;
  }

  const name = companyName.trim();

  if (!brandCompanyMap[name]) {
    const newId = uuidv4();
    brandCompanyMap[name] = newId;
    brandCompanies.push({
      id: newId,
      name,
    });
  }

  return brandCompanyMap[name];
}

// === BUILD PERSONS ===
const persons = [];

Object.keys(vendorsData).forEach((category) => {
  const typeId = typeMap[category.trim()];

  if (!typeId) {
    console.warn(`⚠️ No person_type found for: ${category}`);
    return;
  }

  vendorsData[category].forEach((entry) => {
    const companyId = getBrandCompanyId(entry.company_name);

    persons.push({
      id: uuidv4(),

      name: entry.name ? String(entry.name).trim() : "",
      mobile_number: entry.mobile_number
        ? String(entry.mobile_number).trim()
        : "",

      brand_company_id: companyId,
      type_id: typeId,

      company_name: entry.company_name || null,
      position: entry.position || null,
      type_of_business: entry.type_of_business || null,

      optional_mobile: entry.optional_mobile || null,
      notes: entry.notes || null,
      area_covered: entry.area_covered || null,

      is_architect: entry.is_architect ?? 0,
      is_interior: entry.is_interior ?? 0,
      is_furniture: entry.is_furniture ?? 0,

      age: entry.age || null,
      dob: entry.dob || null,

      reference_name: entry.reference || null,
      reference_mobile: entry.reference_mobile || null,

      address: (() => {
        if (!entry.address || !entry.address.trim()) return null;

        const raw = entry.address.trim();
        const parts = raw.split(",").map((p) => p.trim());

        let addressObj = {
          full_address: raw,
          name: null,
          landmark: null,
          city: null,
          state: null,
          pincode: null,
        };

        if (parts.length > 1 && /^\d{6}$/.test(parts[parts.length - 1])) {
          addressObj.pincode = parts.pop();
        }

        if (parts.length === 1) {
          addressObj.city = parts[0];
        } else if (parts.length === 2) {
          addressObj.city = parts[0];
          addressObj.state = parts[1];
        } else if (parts.length >= 3) {
          addressObj.name = parts[0];
          addressObj.city = parts[1];
          addressObj.state = parts[2];
        }

        return JSON.stringify(addressObj);
      })(),

      is_active: 1,
      created_by: null,
      updated_by: null,
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    });
  });
});

// === WRITE OUTPUT ===
fs.writeFileSync(personsOutputFile, JSON.stringify(persons, null, 2));
fs.writeFileSync(
  brandCompaniesOutputFile,
  JSON.stringify(brandCompanies, null, 2)
);

console.log("====================================");
console.log("✅ Normalization Complete");
console.log("Persons saved to:", personsOutputFile);
console.log("Brand Companies saved to:", brandCompaniesOutputFile);
console.log("Total persons:", persons.length);
console.log("Total brand companies:", brandCompanies.length);
console.log("====================================");
