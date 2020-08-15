const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const https = require("https");
const fs = require("fs");
const secret = require("./secret");

// Initializations
const app = express();
require("./database");
require("./config/passport");

// Helpers

// moment.locale('es');
// console.log(moment().unix());
// console.log(moment().format('dddd, DD [de] MMMM [de] YYYY'))
// console.log(moment("1544467372","X").fromNow());

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    helpers: require("./helpers/helpers"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Middlewares
// Extended a false xq solo quiero datos, no voy a manejar imagenes
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: secret.pass, //Here your own password
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/tasks"));
app.use(require("./routes/users"));

// Satatic Files
app.use(express.static(path.join(__dirname, "public")));

// Server is listening
// Server with SSL
https
  .createServer(
    {
      key: fs.readFileSync(
        path.join(
          __dirname,
          "../..",
          "my_certs",
          "ssl.tareas.dgbdevelopment.com.key"
        )
      ),
      cert: fs.readFileSync(
        path.join(
          __dirname,
          "../..",
          "my_certs",
          "ssl.tareas.dgbdevelopment.com.crt"
        )
      ),
    },
    app
  )
  .listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
  });

// Normal Server
// app.listen(app.get("port"), () => {
//   console.log("Server on port", app.get("port"));
// });
