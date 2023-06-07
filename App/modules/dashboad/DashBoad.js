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

        if(req.session.get("admin"))
        {
            return res.redirect("/admin");
        }

        const {body}=req
        let validationError={}

        if(req.method==="POST")
        {
            try 
            {
                const articleShema=z.object({
                    user_name:z.string().min(1,{message:"Ce champ ne peut pas etre vide"}),
                    user_email:z.string().min(1,{message:"Ce champ ne peut pas etre vide"}).email({message:"Le format de l'email est invalide"})
                    
                })

                const userInfo=articleShema.parse(body)

                const user=await this.userExist(userInfo,this.tableName)

               if(Array.isArray(user) && user.length>0)
               {
                    const {id,user_email,token}=user[0]

                    const newtoken=await this.insertToken(id)

                    if(token)
                    {
                        this.sendVerificationMail(user_email,id,newtoken)
                        .then((status)=>
                        {
                            if(status)
                            {
                                req.flash("success","Veillez verifié votre boite mail pour la confirmation ")
                                return  res.redirect("/login/dashboad")
                            }else 
                            {
                                req.flash("error","Email non envoyé")
                                return  res.redirect("/login/dashboad")
                            }
                            
                        })
                        
                    }

               }else 
               {
                 req.flash("error","Cet administrateur n'exist pas ")
                 return res.redirect("/login/dashboad")
               }

            }catch(err)
            {
                //console.log(err.message);

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