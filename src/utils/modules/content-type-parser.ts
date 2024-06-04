import { FastifyInstance, FastifyRequest } from "fastify"
import { ContentTypes } from "../../types/interface/content-type"

export class ContentTypeParser {


    static forRoot(fastify: FastifyInstance) {
        fastify.addContentTypeParser('*',this.handlePayload)
      

    

    }
    private static handlePayload(request:FastifyRequest, payload:any,done:any) {
        var data = ''
        payload.on('data', (chunk: string) => { data += chunk })
        payload.on('end', () => {
            done(null, data)
        })
    }
    static removeContentTypeParser(fastify: FastifyInstance, type: ContentTypes[] = ['application/json', 'text/plain']) {
        return Array.isArray(type) ? fastify.removeContentTypeParser(type) : fastify.removeAllContentTypeParsers()
    }
    


}

