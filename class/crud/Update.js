

export class Update 
{

    constructor(fastify)
    {
        this.fastify=fastify
    }

    /**
     * 
     * @param {number} id 
     * @returns {[]} article
     */
   async  getCurrentArticle(id)
   {
       const articleId=parseInt(id)

       const connection=await this.fastify.mysql.getConnection()
       const [rows,fields]=await connection.query("SELECT * FROM articles WHERE id=?",[articleId])
       connection.release()

       return rows
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

   async deleteOldCategorieLiaison(id)
   {
        const connection=await this.fastify.mysql.getConnection()
        const query="DELETE FROM categories_articles  WHERE articles_id=?"
        const [rows,fields]=await connection.query(query,[id])
        connection.release()
        return rows
   }

   async updateCategorieArticleLiaison(id,categorieId,allCategorieId)
   {

        await this.deleteOldCategorieLiaison(id)

        if (categorieId)
        {   

            let value=false 
            
            if(Array.isArray(categorieId))
            {
                const valideId=allCategorieId.filter((el)=>categorieId.includes(el))

                value=(valideId.map((el)=>`(${id},${el})`)).join(",")
            }else 
            {
                value=allCategorieId.includes(categorieId)?`(${id},${categorieId})`:false
            }

            if(value)
            {
                const connection=await this.fastify.mysql.getConnection()
                const query=`INSERT INTO  categories_articles  VALUES${value}`
                const [rows,fields]=await connection.query(query)
                connection.release()

                return rows
            }

        }


   }
}