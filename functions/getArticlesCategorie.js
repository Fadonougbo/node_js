
/**
 * Donne les categories lié au articles
 * 
 * @param {number[]} articleIds 
 * @param {fastify} fastify
 * @returns {object}
 */
export const getArticlesCategorie=async (articleIds,fastify)=>{

        const ids=Array.isArray(articleIds)?articleIds.join(","):articleIds

        /**
         * Database connection
         */

        const query=`SELECT articles.id,articles.articles_name,categories.categories_name,categories.id AS cateID
                    FROM categories_articles 
                    LEFT JOIN articles ON articles.id=categories_articles.articles_id 
                    LEFT JOIN categories ON categories.id=categories_articles.categories_id 
                    WHERE articles.id IN(${ids})`
        
        const connection=await fastify.mysql.getConnection()
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