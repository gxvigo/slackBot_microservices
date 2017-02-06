'use strict'  // use ES6 strict mode

const service = require ('../server/service');

const server = service.listen(3010, function (){
    console.log("'time' application listening in port 3010");  // 'pro' logging modules are: node-bunyan or winston
})

// Another option to execute statements is creating an event listener
server.on('listening', function(){
    console.log(`[event] 'time' application listening on ${server.address().port} in ${service.get('env')} mode`);
    // by default 'service.get('env')' return 'development' to set to a different value run:
    // export NODE_ENV=production
    // this is use to make the application dynamic, based on where the code is deployed (if... then...)
})