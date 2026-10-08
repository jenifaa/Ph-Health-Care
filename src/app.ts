import express,{ Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { IndexRoutes } from "./app/routes";

const app: Application= express()

app.use(express.urlencoded({extended:true}))

app.use(express.json())

app.use("/api/v1/", IndexRoutes);


app.get("/",async(req : Request,res: Response)=>{
    const specialty= await prisma.specialty.create({
        data:{
            title:"Cardiology"
        }
    })
  res.status(200).json(specialty)
})

export default app;