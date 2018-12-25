const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');


router.get('/users/signin', (req, res) => {
   res.render('users/signin', {active: {signin:true}});
});

router.post('/users/signin', passport.authenticate('local', {
   successRedirect: '/tasks',
   failureRedirect: '/users/signin',
   failureFlash: true
}));

router.get('/users/signup', (req, res) => {
   res.render('users/signup', {active: {signup:true}});
});

router.post('/users/signup', async (req, res) => {
   const {name, email, password, confirm_password} = req.body;
   const errors = [];
   if (name.length <= 0) {
      errors.push({error: 'El nombre de usuario es obligatorio'});
   }
   if (email.length <= 0) {
      errors.push({error: 'El email es obligatorio'});
   }
   if (password.length < 4 || confirm_password.length < 4) {
      errors.push({error: 'La contraseña debe tener al menos 4 caracteres'});
   }
   if (password != confirm_password){
      errors.push({error: 'Las contraseñas no coinciden'});
   }
   const repeatedEmail = await User.findOne({email});
   if (repeatedEmail){
   errors.push({error: 'El email ya está en uso'});
   }
   const repeatedName = await User.findOne({name});
   if (repeatedName){
   errors.push({error: 'El nombre de usuario ya existe'});
   }
   if (errors.length > 0) {
      res.render('users/signup', {errors, name, email, password, confirm_password});
   } else {
      const newUser = new User(req.body);
      newUser.password = await newUser.encryptPassword(newUser.password);
      newUser.save((error, savedUser)=>{
         if (error) throw error;
         req.flash('success_msg', savedUser.name+', tu registro se completó con éxito.')
         res.redirect('/users/signin');
      })
   }
});

router.get('/users/logout', (req, res) => {
   req.logout();
   res.redirect('/');
})


module.exports = router;