const appConfig = require('./../config/appConfig');

let requestIpLogger = (req, res, next)  => {
      let remoteIp = req.connection.remoteAddress + ';//' + req.connection.remotePort;
      let realIp = req.header['X-REAL-IP'];
       console.log(req.method +'Request Made from '+ remoteIp+ ' for route ' + req.originalUrl);
       if(req.method=== 'OPTION'){
           console.log('!OPTION');

           var headers = {};
           headers['Access-control-Allow-Origin']= "*";
           headers['Access-Control-Allow-Methods'] = 'POST,GET,PUT,DELETE, OPTION';
           headers['Access-Control-Allow-Credentials']= false;
           headers['Access-Control-Max-Age']= '86400';
           headers['Access-Control-Allow-Heades']= 'X-Requested-With,X-HTTP-Method-Override,Content-Type,Accept';
           res.writeHead(200, headers);
           res.end();
       }
       else{
         res.header('Access-Control-Allow-Origin', appConfig.allowedCorsorgin);
         res.header('Access-Control-Allow-Method','GET,PUT,POST,DELETE,OPTIONS');
         res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept')
         next();
       }
}
module.exports = {
    logIp: requestIpLogger
}