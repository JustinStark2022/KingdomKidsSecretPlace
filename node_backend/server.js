import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js'; // Central router file

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS fix
app.use(cors({
  origin: 'http://localhost:5173', // frontend Vite dev server
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// ✅ Use all routes from /routes/index.js
app.use('/api', routes);

// ✅ Global error handler
app.use(errorHandler);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});