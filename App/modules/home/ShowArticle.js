/* eslint-disable @babel/object-curly-spacing */
import { Read } from "../../../class/crud/Read.js"

export class ShowArticle extends Read
{

    constructor(fastify)
    {
        super(fastify)
        this.fastify=fastify

        this.index=this.index.bind(this)

        this.tableName="articles"

        this.fastify.get("/show/:slug/:id",this.index)
    }


    async index(req,res)
    {
        const {id}=req.params

        const article=await this.getElement(id,this.tableName)

        const categories=await this.getArticlesCategorie(id)
        
        return res.view("views/home/showArticle",{article,categories,req});
    }
}