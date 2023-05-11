/* eslint-disable @babel/object-curly-spacing */
import { GlobaleAction } from "./GlobaleAction.js";

export class Delete extends GlobaleAction
{
    constructor(fastify)
    {
        super(fastify)
        this.fastify=fastify

        this.tableName="articles"
        this.delete=this.delete.bind(this)
    }

    /**
     * Supprime un article
     * @param {string} slug 
     * @param {number} elementId 
     * @returns {boolean}
     */
    async delete(slug,elementId)
    {
        const {id,articles_slug}=await this.getElement(elementId,this.tableName)

       if(id===undefined)
       {
            return false;
       }

       if(articles_slug!==slug)
       {
            return false
       }
        
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query("DELETE FROM articles WHERE id=? ",[id])
        connection.release()

        return rows.affectedRows===1

    }
}