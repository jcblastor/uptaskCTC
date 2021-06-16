const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Usuarios = require('../models/Usuarios');
const passport = require('../config/passport');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios'
});

//revisar que el usuario este logeado
exports.usuarioAutenticado = (req, res, next) => {
  //si esta autenticado continue
  if (req.isAuthenticated()) return next();
  //si no redirigir al formulario de iniciar session
  return res.redirect('/iniciar-sesion');
};

//cerrar sesion
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion');
  });
};

//generar token si el usuario esta registrado
exports.enviarToken = async (req, res) => {
  //verificar que el usuario exista
  const {email} = req.body;
  const usuario = await Usuarios.findOne({where: {email}});
  if (!usuario) {
    req.flash('error', 'El e-mail ingresado no tiene una cuenta asociada');
    res.redirect('/reestablecer');
  }
  //si usuario existe generar token
  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 3600000;
  //guardamos el token y la expiracion en la DB
  await usuario.save();
  //url de reset
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
  //envia el correo con el token
  await enviarEmail.enviar({
    usuario,
    subject: 'Password Reset',
    resetUrl,
    archivo: 'reestablecer-password'
  });
  // terminar
  req.flash('correcto', 'Se envió un mensaje a tu correo');
  res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({where: {token: req.params.token}});
  if (!usuario) {
    req.flash('error', 'Correo no válido');
    res.redirect('/reestablecer');
  }
  //formulario para generar el password
  res.render('resetPassword', {
    nombrePagina: 'Reestablecer contraseña'
  });
};

exports.actualizarPassword = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now()
      }
    }
  });
  //verificamos si el usuario existe
  if (!usuario) {
    req.flash('error', 'Token no válido');
    res.redirect('/reestablecer');
  }
  //encriptar password y eliminar token y expiracion
  const {password} = req.body;
  usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;
  //guardar el usuario
  await usuario.save();
  req.flash('correcto', 'Tu password se modifico correctamente');
  res.redirect('/iniciar-sesion');
};
