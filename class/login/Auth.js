import { TokenGenerator } from "../TokenGenerator.js"

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
     * @param {string} token 
     * @param {number} id 
     * 
     */
    async insertToken(id)
    {
        try
        {

        
            const timestamp=Date.now()+(1000*60*60*24)
            const token=await TokenGenerator.getToken(id);

            const query=`UPDATE administration SET token=?,token_created_at=? WHERE id=?`
            const connection=await this.fastify.mysql.getConnection()
            const [rows,fields]=await connection.query(query,[token,timestamp,id])
            connection.release()

            return rows.affectedRows===1?token:false
        }catch(e)
        {
            //console.log(e);
        }
    }

    /**
     * 
     * @param {string} link 
     * @returns {string} html
     */
    getViewStream(link)
    {

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
                                <a href='http://localhost:8001${link}'>
                                    click me
                                </a>
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
     * @param {number} userId 
     * @param {string} token 
     */
    async sendVerificationMail(userMail,userId,token)
    {
        const { mailer } = this.fastify
  
        const params={
            from:"test@gmail.com",
            to: userMail,
            subject: 'Confirmation de compte',
            html: this.getViewStream(`/auth/${userId}/${token}`),
            priority:"hight"
          }

        mailer.sendMail(params, (errors, info) => {})

        return true

    }
}