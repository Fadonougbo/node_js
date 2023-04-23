/* eslint-disable no-undef */
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
        this.tableName="articles"

        this.fastify.get("/admin",this.index)
    }

    async index(req,res)
    {
        const totalArticles=this.getTotaleElement(this.tableName)

        const limit=6

        const paginate=new Paginate({
            totaleElementsByPage:limit,
            totaleElements:totalArticles,
            request:req,
            baseUrl:"/admin"
        })

        const offset=paginate.getOffset()

        const links=paginate.getHtmlLinks()

        const [articles,idList]=await this.getElements(limit,offset,this.tableName)

        const paginationParams=req.query.p||1

        return res.view("views/admin/adminHome.ejs",{articles,links,paginationParams,res})
    }

}