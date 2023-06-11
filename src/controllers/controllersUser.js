const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');

//Requiero a la función que trae los errores desde la ruta, si llegara a existir
const { validationResult } = require('express-validator');


const controllersUser = {
    login: function(req,res){
        res.render(path.resolve(__dirname, '../views/usuarios/login'));
    },
    registro: function(req,res){
        res.render(path.resolve(__dirname, '../views/usuarios/registro'));
    },
    create: (req, res) => {
      let errors = validationResult(req);
      if (errors.isEmpty()) {
        let user = {
          nombre: req.body.first_name,
          apellido: req.body.last_name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          avatar:  req.file ? req.file.filename : '',
          role: 1
        }
        let archivoUsers = fs.readFileSync(path.resolve(__dirname, '../database/usuarios.json'), {
          encoding: 'utf-8'
        });
        let users;
        if (archivoUsers == "") {
          users = [];
        } else {
          users = JSON.parse(archivoUsers);
        };
  
        users.push(user);
        usersJSON = JSON.stringify(users, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../database/usuarios.json'), usersJSON);
        res.redirect('/login');
      } else {
        

        return res.render(path.resolve(__dirname, '../views/usuarios/registro'), {
          errors: errors.errors,  old: req.body
        });
      }
    },
    ingresar: (req,res) =>{
      const errors = validationResult(req);
      
      if(errors.isEmpty()){
        let archivoUsuarios =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/usuarios.json')));
        let usuarioLogueado = archivoUsuarios.find(usuario => usuario.email == req.body.email)
        
        delete usuarioLogueado.password;
        req.session.usuario = usuarioLogueado;  
        //Voy a guardar las cookies del usuario que se loguea
        if(req.body.recordarme){
          res.cookie('email',usuarioLogueado.email,{maxAge: 1000 * 60 * 60 * 24})
        }
        return res.redirect('/');   //Mandar al usuario para donde quiero (Perfil- home - a donde deseo)

      }else{
        //Devolver a la vista los errores
        res.render(path.resolve(__dirname, '../views/usuarios/login'),{errors:errors.mapped(),old:req.body});        
      }
    },
    logout: (req,res) =>{
      req.session.destroy();
      res.cookie('email',null,{maxAge: -1});
      res.redirect('/')
    }

}
module.exports = controllersUser;
