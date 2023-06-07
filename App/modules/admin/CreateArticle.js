/* eslint-disable @babel/object-curly-spacing */
import { z } from "zod"
import { Create } from "../../../class/crud/Create.js"

export class CreateArticle extends Create
{
    constructor(fastify)
    {   
        super(fastify)
        this.fastify=fastify
        
        this.tableName="articles"

        this.index=this.index.bind(this)
        this.fastify.get("/admin/create",this.index)
        this.fastify.post("/admin/create",this.index)
    }

    async index(req,res)
    {

        if(!req.session.get("admin"))
        {
            return  res.redirect("/login/dashboad")
        }

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
                const {slug}=req.body
                articleShema.parse(req.body);

                const val=await this.slugExistVerification(slug,"create")
                if(val>=1)
                {
                    req.flash("error_message","Ce slug exist déja")
                }else 
                {
                    const data=await this.createArticle(this.tableName,req.body)
                    await this.updateCategorieArticleLiaison(data,req.body.categoriesLIst,allCategorieId)

                    req.flash("success_message","Article bien Ajouté ")
                    return  res.redirect(`/admin`)
                }
                

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

        return res.view("views/admin/create",{validationError,allCategorieInfo,body,res,req})
    }

}