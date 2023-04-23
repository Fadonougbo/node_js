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
        }
    ])



 /* fastify.get("/test",async (req,res)=>
{
  console.log(req.query)
  return  res.send("ok")
}) */


try
{
    fastify.listen({port:process.env.PORT})
}catch(error)
{
    process.exit(1)
}

