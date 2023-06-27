/* eslint-disable @babel/object-curly-spacing */
import { Read } from "../../../class/crud/Read.js"
import { Paginate } from "../../../class/pagination/Paginate.js"

export class Home extends Read
{
    /**
     * 
     * @param {import("fastify").FastifyInstance} fastify 
     */
    constructor(fastify)
    {   

        super(fastify)
        this.fastify=fastify

        this.index=this.index.bind(this)

        this.tableName="articles"
        

        /**
         * Router
         */
        this.fastify.get("/",this.index)
    }

    async index(req,res)
    {

        try {
            
            const totalArticles=await this.getTotaleElement(this.tableName)

            const limit=6

            const paginate=new Paginate({
                totaleElementsByPage:limit,
                totaleElements:totalArticles,
                request:req,
                baseUrl:"/"
            })

            const offset=paginate.getOffset()

            const links=paginate.getHtmlLinks()

            const [articles,idList]=await this.getElements(limit,offset,this.tableName)

            const categories=await this.getArticlesCategorie(idList)

            return res.view("views/home/home",{articles,links,categories,req});

        } catch (error) {
                
            console.log(error.message);
        }
        
    }
}