"use strict";

const BaseService = require("./BaseService");
const { Unit } = require("../models");

class UnitService extends BaseService {
  constructor() {
    super(Unit);
  }

  async list() {
    return Unit.findAll({ order: [["name", "ASC"]] });
  }

  async createUnit(data) {
    return this.create(data);
  }

  async updateUnit(id, data) {
    return this.update(id, data);
  }

  async deleteUnit(id) {
    return this.destroy(id);
  }
}

module.exports = new UnitService();
