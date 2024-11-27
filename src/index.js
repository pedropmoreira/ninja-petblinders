/*imports */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log(process.env.DB_LINK)
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes/userRoutes');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express();
const port = 3000;

app.use(express.json());
app.use('/users', userRoutes);



(async () => {
    try {
        await mongoose.connect(`${process.env.DB_LINK}`);
        console.log('MongoDB connected!');
        app.listen(port, () => {
            console.log(`App running on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
})();
