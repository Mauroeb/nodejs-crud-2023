const express = require('express');
const cors = require('cors')

const app = express();
const path = require('path');
const methodOverride = require('method-override');


//Trabajar lo referido a session y cookies
const session = require('express-session');
const cookieParser = require('cookie-parser');


// El middleware que controla si el sitio está o no culminado
const mantenimiento = require('./middlewares/mantenimiento');

// El middleware que controla si el usuario está o no Logueado
const acceso = require('./middlewares/acceso');

// Indicarle a express la carpeta donde se encuentran los archivos estáticos
app.use(express.static(path.resolve(__dirname, '..', 'public')));


// El motor de plantillas que estamos usando EJS
app.set('view engine','ejs');
// URL encode  - Para que me llegue la información desde el formulario al req.body
app.use(express.urlencoded({ extended: false }));
// Middleware de aplicación el cual se encarga de controlar la posibilidad de usar otros métodos diferentes
app.use(methodOverride('_method'));


// Middlewares de session y cookies


app.use(session({
    secret : 'topSecret',
    resave: true,
    saveUninitialized: true,
}))

// Middleware para activar lo referido a las cookies
app.use(cookieParser());

// Middleware de aplicación que se encarga de controlar si el usuario está logueado o no.
app.use(acceso);


// Las rutas
const webRoutes = require('./routes/web');
const userRoutes = require('./routes/user');
const productoRoutes = require('./routes/producto');
const adminRoutes = require('./routes/admin');
const {connect}= require('../src/database/db')
//Para usar las rutas
app.use(cors())
app.use(webRoutes);
app.use(productoRoutes);
app.use(userRoutes);
app.use(adminRoutes);
connect()
//Levantar servidor
app.listen(3001, 'localhost', ()=> console.log('Servidor corriendo en el puerto 3001'));
