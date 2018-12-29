const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');
const moment = require('moment');
const { isAuth } = require('../helpers/auth');

router.get('/tasks/new-task', isAuth, (req, res) => {
   res.render('tasks/new-task', {active: {tasks: true}});
});

router.post('/tasks/add-task', isAuth, async (req, res) => {
   const { title, description, priority, done } = req.body;
   const errors = []
   if(!title) {
      errors.push({error: 'El título de la tarea es necesario para añadirla'})
   }
   if (errors.length > 0) {
      res.render('tasks/new-task', {
         errors,
         title,
         description,
         priority,
         done
      });
   } else {
      const priority_code = await getPriorityCode(priority);
      const newTask = new Task({
         title,
         description,
         priority,
         priority_code,
         done,
         created_at: moment().unix()
      });
      newTask.user = req.user.id;
      await newTask.save();
      req.flash('success_msg', 'Tarea añadida correctamente');
      res.redirect('/tasks');
   }
});

router.get('/tasks', isAuth, async (req, res) => {
   const tasks = await Task.find({user: req.user.id}).sort({done: 1, priority_code: -1, created_at: -1});
   moment.locale('es');
   await tasks.map((task)=>{
      task.created_at = moment(task.created_at,"X").fromNow();
   })
   res.render('tasks/all-tasks', {active: {tasks: true}, tasks});
});

router.post('/tasks/search', isAuth, async (req, res) => {
   const { search } = req.body;
   const regex = new RegExp (search, 'i');
   const tasks = await Task.find({user: req.user.id, $or: [{title: regex}, {description: regex}]}).sort({done: 1, priority_code: -1, created_at: -1});
   if(tasks.length <= 0){
      req.flash('error_msg', 'No se ha encontrado ninguna tarea que contenga: "'+search+'"');
      return res.redirect('/tasks');
   }
   moment.locale('es');
   await tasks.map((task)=>{
      task.created_at = moment(task.created_at,"X").fromNow();
   })
   res.render('tasks/all-tasks', {active: {tasks: true}, tasks, 'success_msg': 'Tareas encontradas que contienen: "'+search+'"'});   
});

router.get('/tasks/edit/:id', isAuth, async(req,res) => {
   const task = await Task.findById(req.params.id);
   res.render('tasks/edit-task', {task});
});

router.put('/tasks/edit-task/:id', isAuth, async (req, res) =>{
   const {title, description, priority} = req.body;
   const priority_code = await getPriorityCode(priority);
   await Task.findByIdAndUpdate(req.params.id, {title, description, priority, priority_code});
   req.flash('success_msg', 'Tarea editada correctamente');
   res.redirect('/tasks');
});

router.delete('/tasks/delete/:id', isAuth, async (req, res) => {
   await Task.findByIdAndDelete(req.params.id);
   req.flash('success_msg', 'Tarea eliminada correctamente');
   res.redirect('/tasks');
});

router.put('/tasks/done/:id', isAuth, async (req, res) => {
   const task = await Task.findById(req.params.id);
   const done = !task.done;
   await Task.findByIdAndUpdate(req.params.id, {done});
   res.redirect('/tasks');
});

async function getPriorityCode(name){
   if (name==="Baja") return 1;
   else if (name==="Normal") return 2;
   else if (name==="Alta") return 3;
   else return 4;
}


module.exports = router;