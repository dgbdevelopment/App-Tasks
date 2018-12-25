const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB || 'mongodb://localhost/app-tasks', {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false
})
.then(db => console.log('DB is connected'))
.catch(error => console.log(error));
