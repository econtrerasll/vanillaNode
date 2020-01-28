const minimist = require('minimist');
const config = require('../config');
const seeder = require('./seeder');
const fs = require('fs');

let DB,PORT;

console.log("Starting Book Server");
console.log("in order to configure a diferent "); 
console.log("PORT use the -PORT command line option or ");
console.log("to use a diferent DB file use the -DB command line option");
console.log("or change the default values in the config.json file");
console.log("In case the DB file was not present in the Application path a new one will be generated Automatically")

var args = minimist(process.argv.slice(2), {
    string: [ 'DB' ,'PORT'],       
    default: { DB: config.DBFile , PORT: config.PORT },          
  }); 

  fs.access(args.DB, fs.F_OK, (err) => {
    if (err) {    
      seeder.seedInitialData(args.DB);    
    }  else {
      seeder.checkDB(args.DB);
    }  
    
  });   

module.exports.DB = args.DB;
module.exports.PORT = args.PORT;
