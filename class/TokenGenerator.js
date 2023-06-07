import {fastify} from "../public/index.js";


export class TokenGenerator
{
    static async  getToken(key)
    {
       const token=await fastify.bcrypt.hash(`${key}`)

       return token.substring(0,22).replace(/[\\|/]/ig,"")

    }
}