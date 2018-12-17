const express = require('express')
const http= require('http')
const mongoose=require('mongoose')
const appConfig = require('./config/appConfig')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const globalErrorMiddleware = require('./middlewares/appErrorHandlers')
const routeLoggerMiddleware = require('./middlewares/routeLogger')
var helmet = require('helmet')
const logger = require('./libs/loggerLib')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(globalErrorMiddleware.globalErrorHandler)

app.use(routeLoggerMiddleware.logIp)


let modelsPath = './models';
fs.readdirSync(modelsPath).forEach( function(file) {
   if(-file.indexOf('.js')){
     require (modelsPath+ '/' + file); 
   }
})


let routesPath= './routes';
fs.readdirSync(routesPath).forEach( function(file) {
if(-file.indexOf('.js')){  
 console.log(routesPath+'/'+file);
let route = require(routesPath+'/'+file);
  route.setRouter(app);
   }
})

app.use(globalErrorMiddleware.globalNotFoundHandler)

const server =http.createServer(app)
console.log(appConfig)
server.listen(appConfig.port)
server.on('error', onError)
server.on('listening', onListening)

function onError( error ){
  if(error.syscall!== listen){
    logger.error(error.code + 'not equal listen' ,'serverOnErrorHandler',10)
    throw error
  }
  switch(error.code){
    case 'EACCES':
    logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10)
    process.exit(1)
    break
case 'EADDRINUSE':
    logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10)
    process.exit(1)
    break
default:
    logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10)
    throw error
  }
}

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'? 'pipe ' + addr : 'port ' + addr.port;
  ('Listening on ' + bind)
  logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10)
  let db = mongoose.connect(appConfig.db.uri, { useMongoClient: true })
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

mongoose.connection.on('error', function(err){
console.log('databse connection error');
console.log(err);
});

mongoose.connection.on('open' , function(err){
   if(err){
      console.log('database connection error 1');
      consoe.log(err);
    } else {
      console.log("database connection open success");  
         }
});
