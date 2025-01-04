const express = require("express")
const app = new express();
const users = require('./MOCK_DATA.json')
const port = 8000;
app.get("/api/users",(req,res)=>{return res.json(users)})
app.get("/api/users/:id",(req,res)=>{
    const id =Number(req.params.id)
    const user = users.find((user)=>user.id === id)
    return(res.json(user))
})
// app.get("/users",(req,res)=>{
//     const html = `
//     <ul>
//     ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
//     </ul>`
//     res.send(html)
// })
app.listen(port,()=>console.log("server is started"))