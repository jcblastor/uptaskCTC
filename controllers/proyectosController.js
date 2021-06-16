const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
  //agregue el try/catch
  try {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    console.log(proyectos);
    res.render('index', {
      nombrePagina: 'Proyectos',
      proyectos
    });
  } catch (err) {
    console.log(err);
  }
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  res.render('nuevoProyecto', {nombrePagina: 'Nuevo Proyecto', proyectos});
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  //validar que el input no este vacio
  const {nombre} = req.body;
  let errors = [];
  //agregamos el error
  if (!nombre) {
    errors.push({texto: 'Agrega un Nombre al proyecto'});
  }
  //si hay errores
  if (errors.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errors,
      proyectos
    });
  } else {
    //insertar datos
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({nombre, usuarioId});
    res.redirect('/');
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    }
  });
  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

  //buscamos las tareas del proyecto
  const tareas = await Tareas.findAll({
    where: {proyectoId: proyecto.id}
    //de esta manera incluimos la tabla referida
    // include: [{ model: Proyectos }]
  });

  if (!proyecto) next();
  //pasamos la vista
  res.render('tareas', {
    nombrePagina: 'Tareas del Proyecto',
    proyectos,
    proyecto,
    tareas
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    }
  });

  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
  res.render('nuevoProyecto', {
    nombrePagina: 'Editar Proyecto',
    proyectos,
    proyecto
  });
};

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  //validar que el input no este vacio
  const {nombre} = req.body;
  let errors = [];
  //agregamos el error
  if (!nombre) {
    errors.push({texto: 'Agrega un Nombre al proyecto'});
  }
  //si hay errores
  if (errors.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errors,
      proyectos
    });
  } else {
    //insertar datos
    await Proyectos.update({nombre}, {where: {id: req.params.id}});
    res.redirect('/');
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  //req.params p req.query obtienes los datos que envias del front
  const {urlProyecto} = req.query;
  const result = await Proyectos.destroy({where: {url: urlProyecto}});
  if (!result) next();
  res.status(200).send('Proyecto Eliminado correctamente');
};
