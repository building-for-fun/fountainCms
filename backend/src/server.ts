import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import contentRouter from './routes/content';
import userRouter from './routes/user';
import rolesRouter from './routes/roles';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
  })
);
app.use(express.json());

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FountainCMS API',
    version: '1.0.0',
    description: 'API documentation for FountainCMS',
  },
  servers: [{ url: 'http://localhost:4000', description: 'Local server' }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [__filename, __dirname + '/routes/content.ts', __dirname + '/routes/user.ts', __dirname + '/routes/roles.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/content', contentRouter);
app.use('/api/user', userRouter);
app.use('/api/roles', rolesRouter);

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`FountainCMS backend running on port ${PORT}`);
  });
}

export default app;
