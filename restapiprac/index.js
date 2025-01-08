const express = require("express")
const fs = require("fs")
const app = new express();
const users = require('./MOCK_DATA.json')
const port = 8000;

app.use(express.urlencoded({extended:false}))
app.get("/api/users",(req,res)=>{return res.json(users)})

app.post("/api/users",(req,res)=>{
    const body = req.body
    users.push({...body,id:users.length+1})
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({status : "success",id:users.length+1})
    })
})

app.get("/api/users/:id",(req,res)=>{
    const id =Number(req.params.id)
    const user = users.find((user)=>user.id === id)
    return(res.json(user))
})
 app.get("/users",(req,res)=>{
     const html = `
     <ul>
     ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
     </ul>`
    res.send(html)
 })
app.listen(port,()=>console.log("server is started"))