
/**
 * Donne la list des id de la table categories
 * 
 * @param {fastify} fastify
 * @returns {object}
 */
export const getAllCategorieInfo=async (fastify)=>{

    /**
     * Database connection
     */

    const query=`SELECT id,categories_name FROM categories `
    
    const connection=await fastify.mysql.getConnection()
    const [rows,fields]=await connection.query(query)
    connection.release()

    /* const allCategorieName=rows.map((el)=>el.categories_name)

    const allCategorieId=rows.map((el)=>el.id+'') */

    return rows

}