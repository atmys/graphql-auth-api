const http = require('http');
const mongoose = require('mongoose');
const app = require('./app/app');
const { DBUrl, port } = require('./config');

mongoose.connect(DBUrl, { useNewUrlParser: true });

http.createServer(app).listen(port);