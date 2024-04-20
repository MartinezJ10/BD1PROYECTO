import express from 'express'
import session from 'express-session'
import getIndex from './routes/login.routes.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.static('public'))

// CONFIG PARA SESSIONS
app.use(session({
    secret: "admin",
    resave: false, 
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000  } // 7 dias
  }));


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.set("view engine", "ejs")
app.use(express.json()) // los json obtenidos seran aceptados por req.body
app.use(express.urlencoded({extended:false}))
app.use("/", getIndex) 

app.use((err,req,res,next) => {
    console.log(err.stack);
    res.status(500).send('its brokeeeeen, send help')
})

app.listen(process.env.PORT);
console.log("workiiing yay", process.env.PORT);
export default app
