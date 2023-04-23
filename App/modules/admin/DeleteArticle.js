/* eslint-disable @babel/object-curly-spacing */
import { Delete } from "../../../class/crud/Delete.js"


export class DeleteArticle extends Delete
{
    constructor(fastify)
    {
        super(fastify)
        this.fastify=fastify

        this.index=this.index.bind(this)

        this.fastify.post("/admin/delete/:slug/:id",this.index)
    }

    async index(req,res)
    {
        const {slug,id}=req.params

        const url=new URL(req.url,`http://${req.headers.host}`)

        const pos=( url.searchParams.get("pos") )||1
       
        const status=await this.delete(slug,id)

        if(status)
        {
            req.flash("success_message","Article bien supprimé ")
            return res.redirect(`/admin?p=${pos}`)
        }
        req.flash("error_message","L'article n'a pas été supprimé")
        return res.redirect(`/admin?p=${pos}`)
    }
}