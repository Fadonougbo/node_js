/* eslint-disable no-unused-vars */
/* eslint-disable @babel/object-curly-spacing */


export class Logout
{
    constructor(fastify)
    {
        this.fastify=fastify
        this.index=this.index.bind(this)

        this.fastify.get("/logout",this.index)
    }

    async index(req,res)
    {   

        req.session.set("admin",false)

        return res.redirect("/login/dashboad")
        
    }

}