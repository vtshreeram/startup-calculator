import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import startupsRouter from './routes/startups.js';
import evaluationsRouter from './routes/evaluations.js';
import aiRouter from './routes/ai.js';
import { errorHandler } from './middleware/errorHandler.js';

app.use('/api/startups', startupsRouter);
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/ai', aiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
