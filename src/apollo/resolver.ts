import { Response } from "express";
import { Team } from "../models/teamModel";
import { getTeamWithStats } from "../services";
import { NBA_LEAGUE_ID, CURRENT_SEASON } from "../constants";
import { getTeamFixtures } from "../services";
import { parseArgs } from "util";

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

    // async teamStats(_:any,args:any, info: any, context:any){
    //   const {teamId, leagueId, season} = args;
    //   const result = await getTeamWithStats(
    //     teamId,
    //   season ? String(args.season) : CURRENT_SEASON,
    //   leagueId ? String(args.leagueId) : NBA_LEAGUE_ID
    //   )
    //   return result
    // },
    
    async teamStats(_: any, args: { teamId: string; leagueId?: string; season?: string }) {
      try {
        const { teamId, leagueId, season } = args;
        
        // Input validation
        if (!teamId) {
          throw new Error('Team ID is required');
        }
        
        const teamIdNum = Number(teamId);
        if (isNaN(teamIdNum)) {
          throw new Error('Team ID must be a valid number');
        }
    
        
        const result = await getTeamWithStats(
          teamIdNum,
          season || CURRENT_SEASON,
          leagueId || NBA_LEAGUE_ID
        );
    
       
        if (!result.team) {
          throw new Error('Team not found');
        }
    
        
        return {
          teamId: result.team.id.toString(),
          leagueId: leagueId || NBA_LEAGUE_ID,
          season: season || CURRENT_SEASON,
          country: result.team.country,
          team: {
            id: result.team.id.toString(),
            name: result.team.name,
            logo: result.team.logo
          },
          games: result.stats?.games,
          points: result.stats?.points,
          updatedAt: result.stats?.updatedAt?.toISOString() || new Date().toISOString()
        };
        
      } catch (error) {
        console.error('[teamStats] Error:', error);
        throw new Error(
          error instanceof Error ? error.message : 'Failed to fetch team stats'
        );
      }
    },
    async fixtures(_:any, args:any, info:any, context:any){
        const {teamId, leagueId, season} = args;
        const games = await getTeamFixtures(
          Number(teamId),
          leagueId ? Number(leagueId) : undefined,
          season ? String(season) : undefined
        )
        return games
    }
  }
}
