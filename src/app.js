import express from 'express'
import session from 'express-session';
import getIndex from './routes/login.routes.js'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(session({
    secret: "admin",
    resave: false, 
    saveUninitialized: false
  }));

app.use(express.static('public'))

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