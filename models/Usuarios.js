const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const db = require('../config/db');
const Proyectos = require('../models/Proyectos');

const Usuarios = db.define(
  'usuarios',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Agrega un Correo valido'
        },
        notEmpty: {
          msg: 'Necesitas un email para registrarte'
        }
      },
      unique: {
        args: true,
        msg: 'El e-mail ingresado ya esta en uso'
      }
    },
    password: {
      type: Sequelize.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El password no puede ir vacio'
        }
      }
    },
    activo: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    token: {
      type: Sequelize.STRING
    },
    expiracion: {
      type: Sequelize.STRING
    }
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
      }
    }
  }
);
//metodos personalizados
Usuarios.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
