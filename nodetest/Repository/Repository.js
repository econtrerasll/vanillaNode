const appConfig = require('../Server/Server');
const sqlite3 = require('sqlite3').verbose();

const allBooksSQL = `SELECT * FROM books ORDER BY ID`;
const allPagesSQL = `SELECT * FROM pages WHERE BOOKID = ? ORDER BY pagenumber`;
const bookSQL=`SELECT * FROM BOOKS WHERE ID = ?`;
const pagesSQL = `SELECT * FROM PAGES WHERE BOOKID = ? AND pagenumber = ?`;
const db = new sqlite3.Database(appConfig.DB);

module.exports.retrieveAllBooks = function retrieveAllBooks(){       
    return new Promise((resolve,reject)=>{                
        db.all(allBooksSQL,[],(err,rows) =>{
            if (err) {                               
                reject(err);
            }                         
            resolve(rows);
        });
    });    
}

module.exports.retrieveAllPages = function retrieveAllPages(bookId){       
    console.log("getPages: "+bookId) 
    return new Promise((resolve,reject)=>{ 
        // db = new sqlite3.Database(appConfig.DB);       
        db.all(allPagesSQL,[bookId],(err,rows) =>{
            if (err) {                               
                reject(err);
            }                         
            resolve(rows);
        });
    });    
}

module.exports.retrieveBook = function getBook(bookId){     
    return new Promise((resolve,reject)=>{      
        // db = new sqlite3.Database(appConfig.DB);  
        db.get(bookSQL,bookId,(err,row)=>{            
            if(err){ 
                reject(err);
            }             
            resolve(row);
        });   
    });    
}

module.exports.retrievePagefromBook = function getPagefromBook(bookId,pageNbr){                   
        return new Promise((resolve,reject)=>{     
            // db = new sqlite3.Database(appConfig.DB);   
            db.get(pagesSQL,[bookId,pageNbr],(err,row)=>{
                if(err){ 
                    reject(err);
                }               
                resolve(row);
            });   
        });    
}

