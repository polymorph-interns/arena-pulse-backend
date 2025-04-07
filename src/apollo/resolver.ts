import { Response } from "express";
import { Team } from "../models/teamModel";
import { getTeamWithStats } from "../services";
import { NBA_LEAGUE_ID, CURRENT_SEASON } from "../constants";
import { getTeamGames } from "../services";

export const resolvers = {
  Query: {
    async hello(){
      console.log("hello");
      return "hello world";
    },

    //Get teams
    async teams (_:any, args:string, info:any, context:any){
      const teams = await Team.find({}).lean();
      return teams     
    },
    //Get team by a single ID
    async team(_:any,args:any, info: any, context:any)
    {
      const team = await Team.findOne({id:args.id}).lean();
      return team
    },
    async teamStats(_:any,args:any, info: any, context:any){
      const result = await getTeamWithStats(
        args.teamId,
        CURRENT_SEASON as string,
        NBA_LEAGUE_ID as string
      )
      return result
    },
    async fixtures(_:any, args:any, info:any, context:any){
        const {teamId, leagueId, season} = args;
        const games = await getTeamGames(
          Number(teamId),
          leagueId ? Number(leagueId) : undefined,
          season ? String(season) : undefined
        )
        return games
    }
  }
}
