import { GlobaleAction } from "./GlobaleAction.js";

export class Create extends GlobaleAction
{
    constructor(fastify)
    {
        super(fastify)
        this.fastify=fastify
    }

    async createArticle(tableName,body)
    {
        const {name,slug,content}=body

        const connection=await this.fastify.mysql.getConnection()
        const query=`INSERT INTO ${tableName} (articles_name,articles_content,articles_slug) VALUES(?,?,?) `
        const [rows,fields]=await connection.query(query,[name,content,slug])
        connection.release() 
        const {insertId}=rows
        return insertId
    }
}