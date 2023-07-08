var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose  = require('./config/mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOptions = require('./config/swagger.config.json');
const multer = require('multer');

const apiRouter = require('./routes/index.router');

const specs = swaggerJSDoc(swaggerOptions);

var app = express();

mongoose.connect();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//Basic settings for multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'storage/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

//Use and image check before uploading pictures
app.use(multer({storage}).array('image', 5));

app.use('/api', apiRouter);

module.exports = app;
