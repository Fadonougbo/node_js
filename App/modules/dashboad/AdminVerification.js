/* eslint-disable no-unused-vars */
/* eslint-disable @babel/object-curly-spacing */

import { Read } from "../../../class/crud/Read.js"


export class AdminVerification extends Read
{
    constructor(fastify)
    {
        super(fastify)
        this.fastify=fastify

        this.index=this.index.bind(this)

        this.fastify.get("/auth/:id/:token",this.index)
    }

    async index(req,res)
    {   

        const {id,token}=req.params
        const user=await this.getElement(id,"administration")

        if(user && token===user.token)
        {
            const userTokenIsValide=user.token_created_at>Date.now()

            if(userTokenIsValide)
            {
                req.session.set("admin",{info:user})
                await this.#resetTokenValue(user.id)
                return res.redirect("/admin")
            }else 
            {
                req.flash("error","Le token n'est plus valide ")
                return res.redirect("/login/dashboad")
            }

        }else 
        {
            req.flash("error","Cet administrateur n'exist pas ")
            return res.redirect("/login/dashboad")
        }
    }

   async #resetTokenValue(id)
    {
        try
        {
            const query=`UPDATE administration SET token=null,token_created_at=1 WHERE id=?`
            const connection=await this.fastify.mysql.getConnection()
            const [rows,fields]=await connection.query(query,[id])
            connection.release()
        }catch(e)
        {
            console.log(e);
        }
    }
}