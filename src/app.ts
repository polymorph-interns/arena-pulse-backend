import mongoose from "mongoose"
import express from "express"
import { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./routes/auth/authRoute"
import teamRouter from "./routes/teams/teamRoute"
import { logger } from "./utils/logger"
import { scheduleTeamUpdates, scheduleGameUpdates } from "./jobs/updateCronJob"
import fixtureRouter from "./routes/fixtures/fixturesRoute"


const app =express();

//Configure the dotenv
dotenv.config();


//Configure the middleware
app.use(
  express.json(),
  // cors()
) 

//CORS Middleware
app.use((req:Request, res:Response, next)=>
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

//AuthRouter
app.use("/v1/auth",authRouter);
app.use("/v1/teams", teamRouter);
app.use("/v1/games", fixtureRouter)
//Connect to database

const MONGO_URI:string = process.env.MONGODB_URI as string;

mongoose.connect(MONGO_URI)
.then(()=>logger.info("✅Connected to database"))
.catch((err)=>logger.error("🙆MongoDB Connection Error:", err));


scheduleTeamUpdates();
scheduleGameUpdates();
app.get("/",(req:Request, res:Response)=>
{
  res.send("The arena-pulse-backend app is working");
})

export default app;
