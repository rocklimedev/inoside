"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("./json-outputs/persons_normalized.json");

    // Fetch all valid FK values from DB
    const [brandCompanies] = await queryInterface.sequelize.query(
      `SELECT id FROM brand_companies`
    );

    const [personTypes] = await queryInterface.sequelize.query(
      `SELECT id FROM person_types`
    );

    const validBrandIds = new Set(brandCompanies.map((b) => b.id));
    const validTypeIds = new Set(personTypes.map((t) => t.id));

    const cleaned = data.map((person) => ({
      ...person,
      brand_company_id: validBrandIds.has(person.brand_company_id)
        ? person.brand_company_id
        : null,
      type_id: validTypeIds.has(person.type_id) ? person.type_id : null,
    }));

    console.log("TOTAL:", cleaned.length);

    await queryInterface.bulkInsert("persons", cleaned);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("persons", null, {});
  },
};
