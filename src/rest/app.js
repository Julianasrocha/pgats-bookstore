const express = require('express');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const setupSwagger = require('./swagger');

const app = express();

app.use(express.json());

setupSwagger(app);

app.use('/users', userRoutes);
app.use('/books', bookRoutes);

module.exports = app;
