const express = require('express');
require('dotenv').config();
const app = express();

const PORT =  process.env.port;
const URL = process.env.url;

app.use(express.json());
app.use(express.urlencoded({extended: false}));


require('./controllers/userController')(app);

app.listen(PORT, () => console.log(`Server is running on ${URL}${PORT}`));