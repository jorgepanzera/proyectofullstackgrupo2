// App principal de la API, es consumida por el server.ts
// Separation of concerns
// server <= app
//      app <= routes <= controllers & middleware <= services

import express, { Request, Response, NextFunction } from "express"
import bodyParser from "body-parser"
import { logActivity } from "./middleware/utils"
import petRoutes from './routes/pet.routes.'
import userRoutes from './routes/users.routes'
import createError from 'http-errors'


const app = express()

// ** Middleware ** //

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para loguear actividad
app.use(logActivity)

// ** Routes ** //

// Ping route to test API availability
app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong");
});

// "Business" Routes
app.use('/users', userRoutes)
app.use('/pets', petRoutes)


// ** Error Handling ** //

app.use((req, res, next) => {
    next(createError(404, 'Route not found'))
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (!error.status) {
      error = createError(500, error);
    }
  
    if (error.status >= 500) {
      console.error(error);
    }
  
    const data: any = {};
    data.message = error.message;
  
    if (error.errors) {
      data.errors = Object.keys(error.errors).reduce((errors: any, key) => {
        errors[key] = error.errors[key].message;
        return errors;
      }, {});
    }
    
    res.status(error.status).json(data);
  });

export default app
