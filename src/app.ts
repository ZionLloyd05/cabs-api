import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import HttpStatus from 'http-status';
import morgan from 'morgan';
import { ResponseStatus } from './enumerations/response.enum';
import { Env } from './enumerations/env.enum';
import { ResponseDto } from './models/dtos/response.dto';
import { Messages } from './constants/messages';
import errorHandler from './utils/middlewares/error.handler';
import { config } from './config/config';
import mongoose from 'mongoose';
import IndexRouter from './routes/index';
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from 'swagger-jsdoc';
import HttpException from './utils/exceptions/http.exception';

// create an express server
const app: express.Express = express();

// mongoose database
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('connected');
    StartServer();
  })
  .catch((error) => {
    console.log(error);
  });

const StartServer = () => {
  /**
   * Health Check Routes
   */
  app.get('/status', (req: Request, res: Response) => {
    res.status(HttpStatus.OK).send(ResponseStatus.SUCCESS);
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Dev logger
  app.use(morgan(Env.DEV));

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Cabs API",
        description: "Cabs API",
        contact: {
          name: "Dami"
        },
        servers: ["http://localhost:3000"]
      }
    },
    // 
    apis: ['./routes/*.route.ts']
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // All routes
  app.use('/api', IndexRouter);

  /// catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: any) => {
    const error = new HttpException(
      Messages.ROUTE_NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
    next(error);
  });

  app.use(errorHandler);
};

export default app;
