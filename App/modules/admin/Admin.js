/* eslint-disable @babel/object-curly-spacing */
import { Read } from "../../../class/crud/Read.js"
import { Paginate } from "../../../class/pagination/Paginate.js"

export class Admin extends Read
{
    constructor(fastify)
    {   
        super(fastify)
        this.fastify=fastify

        this.index=this.index.bind(this)

        this.fastify.get("/admin",this.index)
    }

    async index(req,res)
    {


        const totalArticles=await this.getTotaleArticles()

        const limit=6

        const paginate=new Paginate({
            totaleElementsByPage:limit,
            totaleElements:totalArticles,
            request:req,
            baseUrl:"/admin"
        })

        const offset=paginate.getOffset()

        const links=paginate.getHtmlLinks()

        const [articles,idList]=await this.getArticles(limit,offset)

        const paginationParams=req.query.p||1

        return res.view("views/admin/adminHome.ejs",{articles,links,paginationParams,res})
    }

}