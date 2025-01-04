//Express creates a more efficeient ans cleaner code rather than using Http create server 
/*const http = require("http")
const url = require("url")
const fs= require("fs")
function myHandler(req,res){
        if(req.url==="/favicon.ico") return res.end()
        const log = `${Date.now()}:${req.url}New Req Recieved\n`
        const myUrl = url.parse(req.url,true)
        console.log(myUrl)
        fs.appendFile("log.txt",log,(err,data)=>{
            switch(myUrl.pathname){
                case "/":
                res.end("This is Home Page")
                break
                case "/about":
                const username = myUrl.query.myname
                res.end(`Hi ${username} Iam Sresha How Are you?`)
                break
                case "/think":
                res.end("Go Hustle")
                break
                default:
                res.end("404 Not found")
                break
            }
        })
    }
const myserver =http.createServer(app)
myserver.listen(8000,()=> console.log("server started"))*/


const express = require("express")
const app = express();
app.get("/",(req,res)=>{
    res.send("Hi from Home Page")
})
app.get("/about",(req,res)=>{
    res.send("Hi from About Page"+req.query.name)
})
app.listen(8000,()=>console.log("server started"))