const persistence = require('../Repository/Repository');

module.exports.getBookList =  function getBookList(req,resp,html){         
         persistence.retrieveAllBooks().then((results) =>{            
            if (html){
                BookAsHTML(resp,results);
            } else {
                BookAsTxt(resp,results);
            }    
            resp.end();
         }).catch((err)=>{
            console.log(err);
         });  
}

module.exports.getPageList =  function getBookList(req,resp,html,bookId){         
    persistence.retrieveAllPages(bookId).then((results) =>{       
       if (html){
           PageAsHTML(resp,results);
       } else {
           PageAsTxt(resp,results);
       }    
       resp.end();
    }).catch((err)=>{
       console.log(err);
    });  
}

module.exports.getBook = function getBook(req,resp,html,bookId){
    persistence.retrieveBook(bookId).then((result) => {   
        console.log(result)
        if (html){
           BookAsHTML(resp,result);
        } else {
            BookAsTxt(resp,result);
        }    
        resp.end();
    }).catch((err)=>{
        console.log(err);        
    });
}

module.exports.getPage = function getPage(req,resp,html,bookId,pageNbr){
    persistence.retrievePagefromBook(bookId,pageNbr).then((result)=>{
        validResult(result,resp);
        if (html){
            PageAsHTML(resp,result);
        } else {
            PageAsTxt(resp,result);
        }    
        resp.end();
    }).catch((err)=>{        
            
    });    
}

function internalServerError(resp){
    resp.status(500).send('Internal Server Error');
}

function validResult(result,resp){
    if(!result){
        internalServerError(resp);
        return;
    } 
}

function BookAsTxt(resp,book) {
     if(! Array.isArray(book)){ 
         let obj = book;
         book =[];
         book.push(obj);
     }

    let txt =  `Book Reader API     
        ${book.map((data) =>`
             Id:                ${data.id}
             Author:            ${data.author}            
             Pages:             ${data.pages}
             Published Year:    ${data.publishedyear} 
             ISBN:              ${data.isbn}
             
             `
             ).join('')}`
             
    resp.writeHead(200, {'Content-Type': 'text/plain','Content-Length':txt.length});
    resp.write(txt);
}

function PageAsTxt(resp,page) {
    if(!Array.isArray(page)){ 
        let obj = page;
        page =[];
        page.push(obj);
    }
    
   let txt =  `Book Reader API     
       ${page.map((data) =>`
            Id:             ${data.id}
            Froom Book:     ${data.bookid}
            Content:        ${data.content}            
            Page Number:    ${data.pagenumber} 
            

            `).join('')}`
            
   resp.writeHead(200, {'Content-Type': 'text/plain','Content-Length':txt.length});
   resp.write(txt);
}

function BookAsHTML(resp,data){  
    if(!Array.isArray(data)){ 
        let book = data;
        data =[];
        data.push(book);
    }
    let html =     
        `<html>
        <head> 
            <title> Book Reader API </title>
        </head> 
        <body>
        <div style="margin: auto;        width: 50%;        border: 3px solid green;        padding: 10px;"> 
        ${data.map((book) => `
        <div>
        Id:                 ${book.id}
        Author:             ${book.author}            
        Pages:              ${book.pages}
        Published Year:     ${book.publishedyear} 
        ISBN:               ${book.isbn}
        </div>        
      `).join('')}                    
        </div></body>
        </html>`   

    resp.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});    
    console.log(html);
    resp.write(html)
}

function PageAsHTML(resp,data){    
    if(!Array.isArray(data)){ 
        let page = data;
        data =[];
        data.push(page);
    }
    let html =     
        `<html>
        <head> 
            <title> Book Reader API </title>
        </head> 
        <body>
        <div style="margin: auto;        width: 50%;        border: 3px solid green;        padding: 10px;"> 
        ${data.map((page) => `<div>    
        Id:             ${page.id}                    
        Froom Book:     ${page.bookid}
        Content:        ${page.content}            
        Page Number:    ${page.pagenumber}     
        `).join('')}       
        </div></div></body>
        </html>`   
        
    resp.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});    
    console.log(html);
    resp.write(html)
}