/* eslint-disable no-undef */
/* eslint-disable @babel/object-curly-spacing */
/* eslint-disable @babel/new-cap */
import Fastify from "fastify"
import { App } from "../App/App.js"
import { Home } from "../App/modules/home/Home.js"
import { ShowArticle } from "../App/modules/home/ShowArticle.js"
import { Admin } from "../App/modules/admin/Admin.js"
import { DeleteArticle } from "../App/modules/admin/DeleteArticle.js"
import { UpdateArticle } from "../App/modules/admin/UpdateArticle.js"
import { CreateArticle } from "../App/modules/admin/CreateArticle.js"
import { DashBoad } from "../App/modules/dashboad/DashBoad.js"
//import fastifyJwt from "@fastify/jwt"

/**
 * @var {fastify} fastify
 */
const fastify=Fastify()

new App(fastify,
    [
        {
            MainModule:Home,
            visible:true,
            childrenModule:[ShowArticle]
        },
        {
            MainModule:Admin,
            visible:true,
            childrenModule:[DeleteArticle,UpdateArticle,CreateArticle]
        },
        {
            MainModule:DashBoad,
            visible:true,
            childrenModule:[]
        }
    ])


    /* fastify.register(fastifyJwt,{
        sign:{algorithm:"HS256",}
    })

 fastify.get("/test",async (req,res)=>
{
  console.log(fastify.jwt.sign({},{}))
  return  res.send("ok")
}) */

try
{
    fastify.listen({port:process.env.PORT})
}catch(error)
{
    process.exit(1)
}

