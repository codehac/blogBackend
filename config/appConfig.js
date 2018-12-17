let appConfig = {}
 appConfig.port = 3000;
 appConfig.allowedCorsorgin = "*";
 appConfig.env = "dev";
 appConfig.db = {
 uri: 'mongodb://127.0.0.1:27017/bolgAppDB'
 }

 appConfig.apiVersion = '/api/v1';
 
 module.exports = {
  port: appConfig.port,
  allowedCorsorgin: appConfig.allowedCorsorgin,
  environment: appConfig.env,
  db: appConfig.db,
  apiVersion: appConfig.apiVersion
 }
