const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
  //obtener el proyecto
  const proyecto = await Proyectos.findOne({where: {url: req.params.url}});
  //leer el valor del input
  const {tarea} = req.body;
  //estado incompleto y id del proyecto
  const estado = 0;
  const proyectoId = proyecto.id;
  //insertar en la base de datos
  const result = await Tareas.create({tarea, estado, proyectoId});
  //si hay algun error que pase a otra tarea
  if (!result) next();
  //redirecionamos a la pagina
  res.redirect(`/proyectos/${req.params.url}`);
};

exports.cambiarEstadoTarea = async (req, res, next) => {
  const {id} = req.params;
  const tarea = await Tareas.findOne({where: {id}});
  //cambiar el estado
  let estado = 0;
  if (tarea.estado === estado) {
    estado = 1;
  }
  tarea.estado = estado;
  const result = await tarea.save();
  if (!result) next();
  res.send('Actualizado');
};

exports.eliminarTarea = async (req, res) => {
  const {id} = req.params;
  const result = await Tareas.destroy({where: {id}});
  if (!result) return next();
  res.status(200).send('Tarea eliminada correctamente');
};
