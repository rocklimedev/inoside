"use strict";

/**
 * BaseService
 * -----------
 * Provides generic find / create / update / delete helpers.
 * Domain services extend this and add business logic on top.
 */
class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findById(id, options = {}) {
    const record = await this.model.findByPk(id, options);
    if (!record) {
      const err = new Error(`${this.model.name} not found`);
      err.status = 404;
      throw err;
    }
    return record;
  }

  async findOne(where, options = {}) {
    return this.model.findOne({ where, ...options });
  }

  async create(data, options = {}) {
    return this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const record = await this.findById(id);
    return record.update(data, options);
  }

  async destroy(id) {
    const record = await this.findById(id);
    await record.destroy();
    return { deleted: true, id };
  }

  async count(where = {}) {
    return this.model.count({ where });
  }
}

module.exports = BaseService;
