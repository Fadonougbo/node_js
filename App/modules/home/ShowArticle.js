/* eslint-disable @babel/object-curly-spacing */
import { getArticlesCategorie } from "../../../functions/getArticlesCategorie.js"

export class ShowArticle
{

    constructor(fastify)
    {

        this.fastify=fastify

        this.getArticle=this.getArticle.bind(this)

        this.index=this.index.bind(this)

        this.fastify.get("/show/:slug/:id",this.index)
    }

    async getArticle(id)
    {
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query("SELECT * FROM articles WHERE id=?",[id])
        connection.release()

        return rows[0]
    }

    async index(req,res)
    {
        const {slug,id}=req.params
        const article=await this.getArticle(id)

        const categories=await getArticlesCategorie(id,this.fastify)
        
        return res.view("views/home/showArticle.ejs",{article,categories});
    }
}