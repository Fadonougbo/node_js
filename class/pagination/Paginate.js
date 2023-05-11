export class Paginate
{

    constructor({totaleElementsByPage,totaleElements,request,baseUrl})
    {
        this.totaleElementsByPage=totaleElementsByPage
        this.totaleElements=totaleElements
        this.req=request
        this.baseUrl=baseUrl

        this.totalePage=this.getTotalePage()
    }

    /**
     * Nombre totale de page
     * @returns {number} totalePage
     */
    getTotalePage()
    {
        return Math.ceil((this.totaleElements/this.totaleElementsByPage))
    }

    getOffset()
    {
        const {p}=this.req.query

        let currentPage=parseInt(p)||1

        const totalePage=this.totalePage

        if (currentPage>totalePage || currentPage<=0)
        {
            currentPage=1
        }

        return (currentPage-1)*this.totaleElementsByPage

    }

    getHtmlLinks()
    {
        let links=[]
        
        for(let i=1;i<=this.totalePage;i++)
        {
            links.push(`<a href="${this.baseUrl}?p=${i}">${i}</a>`)
        }

        return links
    }

}