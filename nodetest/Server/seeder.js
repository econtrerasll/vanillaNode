const sqlite3 = require("sqlite3").verbose();
const randomYear = require('random-year');
const names = ['Pedro','Miguel','Patricio','Ramon','Fidel','Juan'];
let insertBooksSQL = `INSERT INTO BOOKS (author,pages,publishedyear,isbn) VALUES (?,?,?,?)`;
let insertPagesSQL = "INSERT INTO PAGES (bookId,content,pagenumber) VALUES (?,?,?)";

let db = {};

module.exports.checkDB = function checkDB(DbFile){
    let db = new sqlite3.Database(DbFile);    
    let sql = `SELECT * FROM books`;
    db.all(sql,[],(err,rows) => {
        if (err || rows && rows.lenth <1) {        
            console.log("DB not populated properly");
            console.error(err.message);
            this.seedInitialData(DbFile);
          }          
    })    
}

module.exports.seedInitialData = function seedInitialData(DbFile){  
    createDB(DbFile);
    createBooksTable();
    createPagesTable();
    randomData(10)
}

function createDB(DbFile){
    console.log("Trying to create DB: " + DbFile);    
   db = new sqlite3.Database(DbFile, (err) => {
        if (err) {
            console.log("createDB Error")
            console.error(err.message);
        } else {
            console.log('DB file created successfully in Path:' + DbFile);
        }
    });    
}

function runSqlStatement(sql){
    db.run(sql, (err) => {
        if(err){
            console.log(err);
        }        
    });
}

function createBooksTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS BOOKS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT,
      pages INTEGER,
      publishedyear INTEGER,
      isbn TEXT       )`;
      runSqlStatement(sql);     
  }

function createPagesTable() {    
    const sql = `
      CREATE TABLE IF NOT EXISTS PAGES (
        id INTEGER PRIMARY KEY AUTOINCREMENT,        
        bookid INTEGER,
        pagenumber INTEGER,
        content TEXT,  
        CONSTRAINT pages_fk_books FOREIGN KEY (bookId)
          REFERENCES books(id) ON UPDATE CASCADE ON DELETE CASCADE)`;
         runSqlStatement(sql);                    
  }

function randomData(nbr){        
    db.serialize(() => {
        for(var i =0; i< nbr ; i++){
            insertBooks(
                 {  author: names[Math.floor(Math.random()*names.length)],
                    pages:Math.floor(Math.random() * 101),
                    publishedyear: randomYear({ min: 1800, max: 2020 }),
                    isbn: randomISBN(),                
                }
            )
        }
    
    retrieveAllBooks().then((books) =>{
        books.forEach((b) => {
            createPages(b);
        });        
    }).catch((err)=>{
        console.log(err);
     });
    });    
}

function retrieveAllBooks(){       
    return new Promise((resolve,reject)=>{   
    const allBooksSQL = `SELECT * FROM books ORDER BY ID`;     
        db.all(allBooksSQL,[],(err,rows) =>{
            if (err) {                               
                reject(err);
            }                         
            resolve(rows);
        });
    });    
}

function insertBooks(book){
    console.log("inserting Book: "+ JSON.stringify(book) )
   try{              
        db.run(insertBooksSQL ,[book.author,book.pages,book.publishedyear,book.isbn], (err) => {                    
                        if(err){                                                        
                            console.log(err);
                        }
                    });
   } catch(ex){
       console.log(ex);
    }
}

function createPages(book) {    
    for (var i = 1; i <= book.pages; i++) {
     insertPage({
        bookid:book.id,
        page: i,
        content: "Ipsum " + i
    })
    };
} 

function insertPage(pageObj){
    console.log("inserting page: "+JSON.stringify(pageObj));    
    db.run(insertPagesSQL,[pageObj.bookid,pageObj.content,pageObj.page],(err)  => {    
        if(err){                                                
            console.log(err);
        }
});
}

function randomISBN(){
 let str =  Math.random().toString().slice(2,12);
 return str.slice(0, 3) +"-"+ str.slice(3,4) +"-"+ str.slice(4,6) +"-"+ str.slice(6,12) +"-"+str.slice(12);
}

