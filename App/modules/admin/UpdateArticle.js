/* eslint-disable @babel/object-curly-spacing */
import { z } from "zod"
import { Update } from "../../../class/crud/Update.js"

export class UpdateArticle extends Update
{
    constructor(fastify)
    {   
        super(fastify)
        this.fastify=fastify
        
        this.tableName="articles"

        this.index=this.index.bind(this)
        this.fastify.get("/admin/update/:slug/:id",this.index)
        this.fastify.post("/admin/update/:slug/:id",this.index)
    }

    async index(req,res)
    {

        const {id}=req.params
        const currentArticle=await this.getElement(id,this.tableName)
        const categories=await this.getArticlesCategorie(id)
        const allCategorieInfo=await this.getAllCategorieInfo()

        const allCategorieId=allCategorieInfo.map((el)=>el.id+'')

        let validationError={}

        if (req.method==="POST")
        {
            try 
            {
                const articleShema=z.object({
                    name:z.string().min(5,{message:"minimun 5 caratères"}),
                    slug:z.string().min(5,{message:"minimun 5 caratères"}).regex(/(^.+[_-]?)+([^\W|_]+$)/i,{message:"Slug invalide"}),
                    content:z.string().min(5,{message:"minimun 5 caratères"}),
                    categoriesLIst:z.array(z.string()).or(z.string()).or(z.optional())
                    
                })

                articleShema.parse(req.body);

                await this.updateArticle(id,req.body)
                await this.updateCategorieArticleLiaison(id,req.body.categoriesLIst,allCategorieId)

                req.flash("success_message","Article bien modifié ")
                return  res.redirect(`/admin?p=${req.query.pos}`)

            }catch(err)
            {
                const {errors}=err 

                if(errors)
                {
                    errors.forEach((el)=>
                    {
                        const path=el.path[0]
                        validationError[path]=el.message
                    })
                }
                
                
            }

        }

        const {body}=req

        return res.view("views/admin/update.ejs",{currentArticle,validationError,allCategorieInfo,categories,body})
    }

}