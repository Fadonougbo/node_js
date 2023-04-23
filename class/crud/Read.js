import { GlobaleAction } from "./GlobaleAction.js"

export class Read  extends GlobaleAction
{

    constructor(fastify)
    {
        super(fastify)
        this.fastify=fastify
        this.getElements=this.getElements.bind(this)
        this.getTotaleArticles=this.getTotaleElement.bind(this)
    }

    /**
     * Compte le nombre total d'element dans une base de donnée
     * @param {string} tableName
     * @returns {number} totalElement
     */
    async getTotaleElement(tableName)
    {
        const connection=await this.fastify.mysql.getConnection()
        const [totalArticle,fields]=await connection.query(`SELECT COUNT(*) as totale FROM ${tableName}`)
        connection.release()

        return totalArticle[0].totale
    }

    /**
     * Recupère tous les elements de la DB
     * @param {number} limit 
     * @param {number} offset 
     * @param {string} tableName 
     * @returns {Array}
     */
    async getElements(limit,offset,tableName)
    {
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query(`SELECT * FROM ${tableName} ORDER BY article_created_at DESC LIMIT ? OFFSET ? `,[limit,offset])
        connection.release()

        const idList=rows.map((el)=>
        {
            return el.id
        })

        return [rows,idList]
    }

}