'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let companies = require('../companies.json')
    let jobs = require('../jobs.json')
    jobs.forEach(el => {
      el.mongoId = '652cb70c0e9df6fc7849206d'
    })
    let skills = require('../skills.json')


    await queryInterface.bulkInsert('Companies', companies)
    await queryInterface.bulkInsert('Jobs', jobs)
    await queryInterface.bulkInsert('Skills', skills)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('Skills', null, {});
    await queryInterface.bulkDelete('Jobs', null, {});
    await queryInterface.bulkDelete('Companies', null, {});
  }
};
