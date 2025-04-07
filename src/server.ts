import app from "./app";
import { Request } from "express";
import { logger } from "./utils/logger";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer"
import http from "http";
import cors, { CorsRequest } from "cors";
import { typeDefs } from "./apollo/typeDefs";
import { resolvers } from "./apollo/resolver";
const PORT = process.env.PORT || 4001


const httpServer = http.createServer(app);
interface Context {
  token ?:string
}
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection:true,
  plugins:[
    ApolloServerPluginDrainHttpServer({httpServer})
  ]
})


await server.start();

app.use('/', 
  cors<CorsRequest>(),
  // @ts-ignore
  expressMiddleware(server,{
    context: async ({ req}) => ({ token: req.headers.token }),
  })
)


await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, () => resolve()));
logger.info(`✅ Server is running on port ${PORT}`);
// app.listen(PORT,()=>
// {
//   logger.info(`✅ Server is running on port ${PORT}`)
// })


