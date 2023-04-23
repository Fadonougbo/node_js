export class Read 
{

    constructor(fastify)
    {
        this.fastify=fastify

        this.getArticles=this.getArticles.bind(this)
        this.getTotaleArticles=this.getTotaleArticles.bind(this)
        this.getCurrentArticle=this.getCurrentArticle.bind(this)
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
    async getTotaleArticles()
    {
        const connection=await this.fastify.mysql.getConnection()
        const [totalArticle,fields]=await connection.query("SELECT COUNT(*) as totale FROM articles ")
        connection.release()

        return totalArticle[0].totale
    }

    async getArticles(limit,offset)
    {
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query("SELECT * FROM articles ORDER BY article_created_at LIMIT ? OFFSET ? ",[limit,offset])
        connection.release()

        const idList=rows.map((el)=>
        {
            return el.id
        })

        return [rows,idList]
    }
}