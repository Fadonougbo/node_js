import { createReadStream } from "node:fs"
import { convertFileUrlToPath } from "../../functions/convertFileUrlToPath.js"

export class Auth
{
    constructor(fastify)
    {
        this.fastify=fastify
    }

   async userExist(userInfo,tableName)
    {
        const {user_name,user_email}=userInfo

        const query=`SELECT * FROM ${tableName} WHERE user_email=? AND user_name=?`
        const connection=await this.fastify.mysql.getConnection()
        const [rows,fields]=await connection.query(query,[user_email,user_name])
        connection.release()

        return rows

    }

    /**
     * 
     * @param {string} link 
     * @returns {string} html
     */
    getViewStream(link)
    {
        /* const path=convertFileUrlToPath(import.meta.url,3,"/views/email_message.html")
 
        const readStream=createReadStream(path)

        return readStream; */

        const html=`

                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                        a 
                        {
                            text-decoration:none;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        <h2>Message de verification</h2>
                        <p>
                            Veillez cliqué sur ce lien pour vous connecter
                            <button>
                                <a href='${link}'>
                                    click me
                                </a>
                            </button> 
                        </p>
                    </div>
                </body>
                </html>
        `

        return html
    }

    /**
     * 
     * @param {string} userMail 
     */
    async sendVerificationMail(userMail)
    {
        const { mailer } = this.fastify

        let emailSend=false

        const params={
            from:"test@gmail.com",
            to: userMail,
            subject: 'Confirmation de compte',
            html: this.getViewStream("#"),
            priority:"hight"
          }

        mailer.sendMail(params, (errors, info) => {

            if (errors) {
              this.fastify.log.error(errors)
        
             console.log(errors);
            }else 
            {
                emailSend=true
            }

        })

        return emailSend

                
    }
}