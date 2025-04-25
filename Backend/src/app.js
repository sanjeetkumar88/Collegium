import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes import

import userRouter from './routes/user.routes.js'

import notesRouter from './routes/notes.routes.js'

import clubrouter from './routes/club.routes.js'

import eventrouter from './routes/event.routes.js'

import projectrouter from './routes/project.route.js'


// routes declaration

app.use('/users',userRouter) 
app.use('/notes',notesRouter) 
app.use('/club',clubrouter)
app.use('/event',eventrouter)
app.use('/devproject',projectrouter)






export { app }  