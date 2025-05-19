import { version } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Hotel Systems API",
            version: "1.0.0",
            description: "API para gestion de hoteles.",
            contact: {
                name: "Angel Magaña",
                email: "amagana_2023257@kinal.org.gt"
            }
        },
        servers: [
            {
                url: "http://127.0.0.1:3001/hotelManager/v1"
            }
        ]
    },
    apis: [
        "./src/auth/*.js",
        "./src/user/*.js",
        "./src/hotel/*.js",
        "./src/room/*.js",
        "./src/event/*.js"
    ]
}
const swaggerDocs = swaggerJSDoc(swaggerOptions)
export { swaggerDocs, swaggerUi }