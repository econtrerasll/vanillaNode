const http = require('http');
const routes = require('./Routers/Routes');
const server = require('./Server/Server');


// server.checkEnv();

http.createServer((req, resp) => {     
    routes.handleRoutes(req,resp);    
}).listen(server.PORT,()=>{    
    console.log("---------------------------------------------------------------------------------------")
    console.log("Running with the following parameters:");
    console.log("PORT:" + server.PORT)
    console.log("DB:" + server.DB)
    console.log("---------------------------------------------------------------------------------------")
});;
