const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

//Referecia al modelo que vamos a autenticar
const Usuarios = require('../models/Usuarios');

// local strategy - login con credenciales propias(usuario y password)
passport.use(
  new LocalStrategy(
    {
      //por defaul espera un usuario y password
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            activo: 1
          }
        });
        //el usuario existe pero el password es incorrecto
        if (!usuario.verificarPassword(password)) {
          //el usuario existe, contraseña incorrecta
          return done(null, false, {
            message: 'La contraseña es incorrecta'
          });
        }
        //si el email y el password existe
        return done(null, usuario);
      } catch (err) {
        //el usuario no existe
        return done(null, false, {
          message: 'La Usuario no existe'
        });
      }
    }
  )
);

//serializar el usuario
passport.serializeUser((usuario, cb) => {
  cb(null, usuario);
});
//deserializar el usuario
passport.deserializeUser((usuario, cb) => {
  cb(null, usuario);
});

module.exports = passport;
