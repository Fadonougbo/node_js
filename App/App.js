/* eslint-disable no-undef */
/* eslint-disable @babel/object-curly-spacing */
import fastifyMysql from "@fastify/mysql";
import fastifyView from "@fastify/view"
import fastifyFormbody from "@fastify/formbody";
import fastifySecureSession from "@fastify/secure-session";
import fastifyFlash from "@fastify/flash"
import fastifyJwt from "@fastify/jwt";
import fastifyMailer from "fastify-mailer"
import ejs from "ejs";
import {readFileSync} from "node:fs"
import { convertFileUrlToPath } from "../functions/convertFileUrlToPath.js";
import fastifyBcrypt from "fastify-bcrypt";

export class App 
{   
    /**
     * 
     * @param {Fastify} fastify 
     * @param {modules[]} moduleList 
     */
    constructor(fastify,moduleList)
    {
        this.fastify=fastify
        this.moduleList=moduleList

        /* init module */
        this.initModule()

        /* init plugins */

        this.initPlugin()
    }

    initPlugin()
    {

        this.fastify.register(fastifyView,{
            engine:{ejs}
        })

        this.fastify.register(fastifyMysql,{
            promise:true,
            database:process.env.DBNAME,
            password:process.env.PASSWORD,
            user:process.env.USER
        })

        this.fastify.register(fastifyFormbody)

        this.fastify.register(fastifySecureSession,{
            cookieName:"NODESession",
            key:readFileSync(convertFileUrlToPath(import.meta.url,2,"/secret-key")),
            cookie:{
                path:"/"
            }
        })

        this.fastify.register(fastifyFlash)

        this.fastify.register(fastifyMailer,{
            transport: {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
            }
        })

        this.fastify.register(fastifyJwt,{
            secret:"gautier",
            
        })

        this.fastify.register(fastifyBcrypt, {
            saltWorkFactor: 8
        })
    }

    initModule()
    {
        this.moduleList.forEach((element)=>
        {
            const {MainModule,visible,childrenModule}=element

            if (visible)
            {
                new MainModule(this.fastify)

                if(Array.isArray(childrenModule) && childrenModule.length>0)
                {
                    childrenModule.forEach((Child)=>
                    {
                        new Child(this.fastify)
                    })
                }
            }
            
        })

    }
}