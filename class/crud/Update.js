import { GlobaleAction } from "./GlobaleAction.js";


export class Update extends GlobaleAction
{

    constructor(fastify)
    {
        super(fastify)
        this.fastify=fastify
    }


   async updateArticle(id,body)
   {
    const {name,slug,content}=body
    const articleId=parseInt(id)
    const newDate=Date.now();

    const connection=await this.fastify.mysql.getConnection()
    const query="UPDATE articles SET articles_name=?,articles_content=?,articles_slug=?,article_created_at=? WHERE id=?"
    const [rows,fields]=await connection.query(query,[name,content,slug,newDate,articleId])
    connection.release() 

    return rows
   }

   
}