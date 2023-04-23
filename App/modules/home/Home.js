/* eslint-disable @babel/object-curly-spacing */
import { Read } from "../../../class/crud/Read.js"
import { Paginate } from "../../../class/pagination/Paginate.js"
import { getArticlesCategorie } from "../../../functions/getArticlesCategorie.js"

export class Home extends Read
{

    constructor(fastify)
    {   

        super(fastify)

        this.fastify=fastify

        this.index=this.index.bind(this)

        /**
         * Router
         */
        this.fastify.get("/",this.index)
    }

    async index(req,res)
    {

        const totalArticles=await this.getTotaleArticles()

        const limit=6

        const paginate=new Paginate({
            totaleElementsByPage:limit,
            totaleElements:totalArticles,
            request:req,
            baseUrl:"/"
        })

        const offset=paginate.getOffset()

        const links=paginate.getHtmlLinks()

        const [articles,idList]=await this.getArticles(limit,offset)

        const categories=await getArticlesCategorie(idList,this.fastify)
        
        return res.view("views/home/home.ejs",{articles,links,categories});
    }
}