const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

require('dotenv').config({path: 'variables.env'});

const routes = require('./routes/index');
const helpers = require('./helpers');
const passport = require('./config/passport');

//Crear la conexión a la base de datos
const db = require('./config/db');
//importar el modelo para que sequelize lo cree
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
  .then(() => {
    console.log('Se conecto a la BD exitosamente...');
  })
  .catch((err) => {
    console.log(`Error: ${err.message}`);
  });

//crear app de express
const app = express();

//habilitar express-parser
app.use(express.urlencoded({extended: true}));

//cargar archivos staticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//habilitar carpeta de las vistas y donde encontrar el directorio
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

//agregar cookie parser
app.use(cookieParser());

//agregar express-session
app.use(
  session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
  })
);

//agregamos passport al proyecto
app.use(passport.initialize());
app.use(passport.session());

//pasar nuestro vardump a la app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.messages = req.flash();
  res.locals.usuario = {...req.user} || null;
  next();
});

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log(`Servidor corriendo en el puerto: ${port}`);
});
