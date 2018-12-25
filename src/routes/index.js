const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('index', {active: {home: true}});
});

router.get('/about', (req, res) => {
   res.render('about', {active: {about: true}});
});


module.exports = router;
