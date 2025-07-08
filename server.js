import {} from 'dotenv/config';
import express from "express";
import userRouters from './routes/userRoutes.js';
import transactionsRouters from './routes/transactionsRoutes.js';
import connectDB from './config/dbConnect.js';
import { swaggerSpec, swaggerUi } from './swagger.js';


connectDB();
const app = express();
app.use(express.json());//for parsing 

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT || 3000; 
app.use('/user',userRouters);
app.use('/transactions',transactionsRouters)
app.listen(PORT,()=>{
    console.log(`server is listening to ${PORT}`);
});