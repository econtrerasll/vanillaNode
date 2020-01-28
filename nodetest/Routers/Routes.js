const http = require('http');
const url = require('url');
const contr = require('../Controllers/Controller');

// /book/10/page/5/ /book/10/page/5 /book/10/page/5/html/ /book/10/page/5/html
const pageIdPatt = new RegExp("^\/book\/(?<bookId>[0-9]+)\/page\/(?<pageId>[0-9]+)\/?(?<html>/html)?\/?$");
// /book/10/page/html /book/10/page/html/ /book/10/page  /book/10/page/
const allPagesPatt = new RegExp(`^\/book\/(?<bookId>[0-9]+)\/page\/?(?<html>/html)?\/?$`);
// /book/10/html /book/10/html/ /book/10  /book/10/
const bookIdPatt =   new RegExp('^\/book\/(?<bookId>[0-9]+)\/?(?<html>/html)?\/?$');
// /book/html/ /book/html /book/ /book
const allBooks =   new RegExp("^\/book\/?(html)?\/?$");
// /html/ /html
const htmlPatt = new RegExp(`\/(html)\/?$`);

function handleRoutes(req, resp)  {            
    let cleanURL = removeTrailandLowerCase(req.url);
    switch(req.method){                
        case "GET":
        if(pageIdPatt.test(cleanURL)){            
            result = extractDatafromUrl(cleanURL,pageIdPatt);                 
            let bookId = result.bookId;
            let pageId = result.pageId;
            let htmlOutput = result.html || false;
            contr.getPage(req,resp,htmlOutput,bookId,pageId);
        } else if(allPagesPatt.test(cleanURL)){            
            result = extractDatafromUrl(cleanURL,allPagesPatt);                 
            let bookId = result.bookId;            
            let htmlOutput = result.html || false;
            contr.getPageList(req,resp,htmlOutput,bookId);
        } else if(bookIdPatt.test(cleanURL)){            
            result = extractDatafromUrl(cleanURL,bookIdPatt);                 
            let bookId = result.bookId;            
            let htmlOutput = result.html || false;            
            contr.getBook(req,resp,htmlOutput,bookId);
        } else if(allBooks.test(cleanURL)  ){                      
           let htmlOutput = htmlPatt.test(cleanURL);
           contr.getBookList(req,resp,htmlOutput);
        } else if(cleanURL ==="/"){
            sendUsage(req,resp);
        } else {            
            sendErrorResponse("Bad Request",400,resp);
        }
        break;
            
        default:                        
            sendErrorResponse("Unsuported Method",406,resp);
        break;
    }

};
function removeTrailandLowerCase(str){
    return (str.length >1 && str.charAt(str.length-1) === "/" )? str.slice(0, -1).toLowerCase() : str.toLowerCase();

}

function extractDatafromUrl(url,regex){
    result = regex.exec(url);
    return result.groups;
}

function sendUsage(req,resp){
    txt =  `
        This service currently just supports the GET method on the following Endpoints:           
            /book ,    
            /book/{bookId} ,    
            /book/{bookId}/page/ ,
            /book/{bookId}/page/{pageId}`;

    resp.writeHead(200, {'Content-Type': 'text/plain','Content-Length':txt.length});     
    resp.write( txt);    
}

function sendErrorResponse(txt,errCode,resp){    
    resp.writeHead(errCode, {'Content-Type': 'text/plain','Content-Length':txt.length});
    resp.write(txt);    
}

module.exports ={
    handleRoutes:handleRoutes
}