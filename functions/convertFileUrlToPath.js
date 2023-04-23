/* eslint-disable @babel/object-curly-spacing */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 
 * @param {string} fileUrl 
 * @param {number} dirnameNumber 
 * @param {string} joinPath 
 */
export const convertFileUrlToPath=(fileUrl,dirnameNumber=null,joinPath=null)=>{

    let convertePath=fileURLToPath(fileUrl)

    if(dirnameNumber!==null)
    {
        for(let i=0;i<dirnameNumber;i++)
        {
            convertePath=dirname(convertePath)
        }
        
    }

    if(joinPath!==null)
    {
        convertePath=join(convertePath,joinPath)
    }

    return convertePath
}