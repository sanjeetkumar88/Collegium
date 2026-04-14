import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

const app = express()
dotenv.config({
    path: './.env'
})

const allowedOrigins = [
  "https://collegium-kappa.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://collegium-git-main-sanjeet-kumars-projects-8d859d11.vercel.app",
  "https://collegium-kgsagdofm-sanjeet-kumars-projects-8d859d11.vercel.app",
  "https://collegium-app.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes import

import userRouter from './modules/user/user.routes.js'
import notesRouter from './modules/notes/notes.routes.js'
import clubrouter from './modules/club/club.routes.js'
import eventrouter from './modules/event/event.routes.js'
import projectrouter from './modules/project/project.routes.js'
import paymentrouter from './modules/payment/payment.routes.js'


// routes declaration

app.use('/users',userRouter) 
app.use('/notes',notesRouter) 
app.use('/club',clubrouter)
app.use('/devevent',eventrouter)
app.use('/devproject',projectrouter)
app.use('/payment', paymentrouter);






export { app }  