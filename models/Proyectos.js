const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');

const db = require('../config/db');

const Proyectos = db.define(
  'proyectos',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(100)
    },
    url: {
      type: Sequelize.STRING(100)
    }
  },
  {
    hooks: {
      beforeCreate(proyecto) {
        const url = slug(proyecto.nombre).toLowerCase();
        proyecto.url = `${url}-${shortid.generate()}`;
      }
      //Si queremos actualizar la ruta usamos este hook, normalmente no se actualiza
      /* beforeUpdate(proyecto) {
        const url = slug(proyecto.nombre).toLowerCase();
        proyecto.url = `${url}-${shortid.generate()}`;
      } */
    }
  }
);

module.exports = Proyectos;
