
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const schoolRoutes = require('./routes/schoolRoutes');
require('dotenv').config();

const app = express();


app.use(helmet());
app.use(express.json({ limit: '10kb' }));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);


app.use('/api', schoolRoutes);




app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});