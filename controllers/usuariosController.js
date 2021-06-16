const Usuarios = require('../models/Usuarios');

const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear cuenta en Uptask'
  });
};

exports.formIniciarSesion = async (req, res) => {
  //capturamos el error
  const {error} = await res.locals.messages;
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar Sesión en Uptask',
    error
  });
};

exports.crearCuenta = async (req, res) => {
  //leer datos
  const {email, password} = req.body;
  try {
    //crear el usuario
    await Usuarios.create({
      email,
      password
    });

    //crear url para confirmar el registro
    const confirmUrl = `http://${req.headers.host}/confirmar/${email}`;
    //crear el objeto
    const usuario = {
      email
    };
    //enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirma tu cuenta UpTask',
      confirmUrl,
      archivo: 'confirmar-cuenta'
    });
    //redirigir al usuario
    req.flash('correcto', 'Enviamos un correo, Confirma tu cuenta');
    res.redirect('/iniciar-sesion');
  } catch (err) {
    req.flash(
      'error',
      err.errors.map((error) => error.message)
    );

    res.render('crearCuenta', {
      messages: req.flash(),
      nombrePagina: 'Crear Cuenta en Uptask',
      email,
      password
    });
  }
};
//cambia el estado de la cuenta a activo
exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  });
  if (!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/crear-cuenta');
  }
  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada correctamente');
  res.redirect('/iniciar-sesion');
};

exports.formRestablecerPassword = (req, res) => {
  res.render('reestablecer', {
    nombrePagina: 'Reestablecer tu contraseña'
  });
};
