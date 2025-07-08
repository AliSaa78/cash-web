import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Banking API',
      version: '1.0.0',
      description: 'API for user registration, login, balance, transactions, and transfers',
    },
    servers: [
      { url: 'http://localhost:4000' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  
  apis: ['./routes/**/*.js'],   
};

const swaggerSpec = swaggerJsdoc(options);
export { swaggerSpec, swaggerUi };
