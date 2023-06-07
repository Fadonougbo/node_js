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

        if(!req.session.get("admin"))
        {
            return  res.redirect("/login/dashboad")
        }

        const totalArticles=await this.getTotaleElement(this.tableName)

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

        const categories=await this.getArticlesCategorie(idList)
        const paginationParams=req.query.p||1
        return res.view("views/admin/adminHome",{articles,links,categories,paginationParams,res,req})
    }

}