const express = require('express');
const router = express.Router();
const path = require('path');

//Requiero el paquete para comparar las contraseñas  que tengo hash 
const bcrypt = require('bcryptjs');
//Requiero fs ya que debo leer el archivo json de usuarios y verificar si el usuario que se está reistrando existe o no
const fs = require('fs');
//Requiero Multer, ya que voy a permitir que el usuario que se registre suba su avatar
const multer = require('multer');

//Requiero el paquete expres-validator
const { body } = require('express-validator');

//Requerir el modulo de los controladores
const controllersUser = require(path.resolve(__dirname, '../controllers/controllersUser'));

//Aperturo mi archivo de usuarios, ya que al registrarse un usuario es conveniente buscar que no exista una ya registrado con el mismo email o id o el campo que utlicen para identificar al usuario.

let archivoUsuarios =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/usuarios.json')))



// Dispongo la información del storage para tratamiento de guardado imagenes
//https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../public/images/usuarios'));    
    },
    filename: function (req, file, cb) {
      cb(null, 'foto' + '-' + Date.now()+ path.extname(file.originalname));      
    }
  })
   
const upload= multer({ storage })

//Ejecuto mis validaciones
const validacionesLogin = [
    body('email').isEmail().withMessage('Agregar un email válido'),
    body('password').isLength({min: 6 }).withMessage('La contraseña debe tener un mínimo de 6 caractéres'),
    body('email').custom( (value  ) =>{
      for (let i = 0; i < archivoUsuarios.length; i++) {
          if (archivoUsuarios[i].email == value) {
              return true    
          }
      }
      return false
    }).withMessage('Usuario no se encuentra registrado...'),
  
    // Valido si la contraseña colocada es la misma a la que tenemos hasheada
    body('password').custom( (value, {req}) =>{
        for (let i = 0; i < archivoUsuarios.length; i++) {
            if (archivoUsuarios[i].email == req.body.email) {
                if(bcrypt.compareSync(value, archivoUsuarios[i].password)){
                  return true;
                }else{
                  return false;
                }
            }
        }
        
    }).withMessage('Usurio o contraseña no coinciden'),
]

// Las validaciones del Registro
const validacionesRegistro = [
    // Incoporé otras validaciones, para otros proyectos  
    body('first_name').isLength({
          min: 1
        }).withMessage('El campo nombre no puede estar vacío'),
      body('last_name').isLength({min: 1
        }).withMessage('El campo apellido no puede estar vacío'),
      body('email').isEmail().withMessage('Agregar un email válido'),
  
      // Valido el Password   
      body('password').isLength({min: 6 }).withMessage('La contraseña debe tener un mínimo de 6 caractéres'),
      
      // Valido la confimación del password dispuesto por el usuario
      body('confirm_password').isLength({min: 6 }).withMessage('La confirmación de la contraseña debe tener un mínimo de 6 caractéres'),
  
      // Valido si las contraseñas son iguales o no
  
      body('confirm_password').custom((value, {req}) =>{
          if(req.body.password == value ){
              return true    // Si yo retorno un true  no se muestra el error     
          }else{
              return false   // Si retorno un false si se muestra el error
          }    
      }).withMessage('Las contraseñas deben ser iguales'),
  
      // Obligo a que el usuario seleccione su avatar
      body('avatar').custom((value, {req}) =>{
          if(req.file != undefined){
              return true
          }
          return false;
      }).withMessage('Debe elegir su avatar y debe ser un archivo con formato: .JPG ó JPEG ó PNG')
    ]



// Métodos en los controladores: index - show - edit - delete 
router.get('/login', controllersUser.login);
router.post('/login', validacionesLogin,controllersUser.ingresar);

router.get('/registro', controllersUser.registro);

//En esta ruta envio al controlador el avatar del usuario así como las respectivas validaciones

router.post('/registro', upload.single('avatar'),validacionesRegistro, controllersUser.create);

  //Esta es la ruta que se activa al momento que el usuario desea salir de la página
  router.get('/logout', controllersUser.logout);
module.exports = router;