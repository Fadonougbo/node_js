

export class GlobaleAction
{
    constructor(fastify)
    {
        this.fastify=fastify
        this.getElement=this.getElement.bind(this)
        this.getAllCategorieInfo=this.getAllCategorieInfo.bind(this)
        this.getArticlesCategorie=this.getArticlesCategorie.bind(this)
    }   

    /**
     * Recupère un element de la base de donnée
     * @param {number} id 
     * @param {string} tableName 
     * @returns {object}
     */
    async getElement(id,tableName)
    {
        const articleId=parseInt(id)
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query(`SELECT * FROM ${tableName} WHERE id=?`,[articleId])
        connection.release()

        return rows[0]
    }


    /**
     * Donne la list des id et noms des categories de la table categories
     * 
     * @param {fastify} fastify
     * @returns {object}
     */
    async  getAllCategorieInfo()
    {
        /**
         * Database connection
         */

        const query=`SELECT id,categories_name FROM categories `
        
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query(query)
        connection.release()

        return rows

    }


    
    /**
     * Donne les categories lié au articles
     * 
     * @param {number[]} articleIds article id/id list
     * @param {fastify} fastify
     * @returns {object}
     */
    async getArticlesCategorie(articleIds)
    {

        const ids=Array.isArray(articleIds)?articleIds.join(","):articleIds

        /**
         * Database connection
         */

        const query=`SELECT articles.id,articles.articles_name,categories.categories_name,categories.id AS cateID
                    FROM categories_articles 
                    LEFT JOIN articles ON articles.id=categories_articles.articles_id 
                    LEFT JOIN categories ON categories.id=categories_articles.categories_id 
                    WHERE articles.id IN(${ids})`
        
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query(query)
        connection.release()

        const lists={}

        rows.forEach((element) => 
        {
            const {id,articles_name,categories_name,cateID}=element

            const keyExist=`${articles_name}` in lists

            if (!keyExist)
            {
                lists[articles_name]=[]
            }
            
            lists[articles_name].push({name:categories_name,id:cateID}) 

        });

            return lists

    }
}