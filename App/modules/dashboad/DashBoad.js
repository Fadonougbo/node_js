/* eslint-disable no-undef */
/* eslint-disable @babel/object-curly-spacing */

import { z } from "zod"
import { Auth } from "../../../class/login/Auth.js"

export class DashBoad extends Auth
{
    constructor(fastify)
    {   
        super(fastify)
        this.fastify=fastify

        this.index=this.index.bind(this)
        
        this.tableName="administration"

        this.fastify.get("/login/dashboad",this.index)
        this.fastify.post("/login/dashboad",this.index)
    }

    async index(req,res)
    {

        const {body}=req
        let validationError={}

        if(req.method==="POST")
        {
            try 
            {
                const articleShema=z.object({
                    user_name:z.string(),
                    user_email:z.string().email({message:"Le format de l'email est invalide"})
                    
                })

                const userInfo=articleShema.parse(body)

                const user=await this.userExist(userInfo,this.tableName)

               if(user.length>0)
               {
                 //const status=await this.sendVerificationMail(userInfo.user_email)

                 /* if(status)
                 {

                 } */
               }else 
               {
                 req.flash("error","Cet administrateur n'exist pas ")

                 res.redirect("/login/dashboad")
               }

            }catch(err)
            {
                console.log(err.message);

                const {errors}=err 

                if(errors)
                {
                    errors.forEach((el)=>
                    {
                        const path=el.path[0]
                        validationError[path]=el.message
                    })
                }
                
                
            }

        }


        return res.view("views/dashboad/dashboad",{body,validationError,res})
    }

}