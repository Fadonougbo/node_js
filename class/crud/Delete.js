/* eslint-disable @babel/object-curly-spacing */
import { Read } from "./Read.js";

export class Delete extends Read
{
    constructor(fastify)
    {
        super(fastify)
        this.fastify=fastify

        this.delete=this.delete.bind(this)
    }

   async delete(slug,id)
    {
        const article=await this.getCurrentArticle(id)


       if(article.length===0)
       {
            return false;
       }

       const current_articleId=article[0].id

       const current_articleSlug=article[0].articles_slug

       if(current_articleSlug!==slug)
       {
            return false
       }
        
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query("DELETE FROM articles WHERE id=? ",[current_articleId])
        connection.release()

        return rows.affectedRows===1

    }
}