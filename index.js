const http = require("http")
const myserver =http.createServer((req,res)=>{
    console.log(req)
    res.end("Hello from Server Again")
})
myserver.listen(8000,()=> console.log("server started"))