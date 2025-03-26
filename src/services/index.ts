import { Team } from "../models/teamModel";
import { fetchTeamsByLeague, fetchTeamStats } from "../apiClient";
import { UpSertTeam, UpsertTeamStats} from "../db";
import { logger } from "../utils/logger";
import { TeamResponse } from "../apiClient";
const NBA_LEAGUE_ID = "12";

export const getTeamWithStats = async (
  teamId: number,
  season: string,
  league: string = NBA_LEAGUE_ID
) => {
  // First get all teams in the league to find our specific team
  const teams = await fetchTeamsByLeague(league, season);
  const teamResponse: TeamResponse | undefined = teams.find((t: TeamResponse) => t.id === teamId);
  
  if (!teamResponse) {
    return { team: null, stats: null };
  }

  const team = await UpSertTeam(teamResponse);
  const statsResponse = await fetchTeamStats(team.id, league, season);
  
  if (!statsResponse) {
    return { team, stats: null };
  }

  const stats = await UpsertTeamStats(team.id, Number(league), season, statsResponse);
  return { team, stats };
};

export const updateAllTeams = async (
  season: string,
  league: string = NBA_LEAGUE_ID
):Promise<{ teamId: number; success: boolean; teamName?: string; statsUpdated?: boolean; error?: string }[]> => {
  try {
    // 1. First fetch all teams for the league/season
    const teams = await fetchTeamsByLeague(league, season);
    
    if (teams.length === 0) {
      throw new Error(`No teams found for league ${league} and season ${season}`);
    }

    const results = [];
    const teamIds: number[] = teams.map((team: TeamResponse) => team.id); // Extract IDs from response
    
    // 2. Process each team
    for (const team of teams) {
      try {
        const upsertedTeam = await UpSertTeam(team);
        const statsResponse = await fetchTeamStats(team.id, league, season);
        
        const stats = statsResponse 
          ? await UpsertTeamStats(team.id, Number(league), season, statsResponse)
          : null;

        results.push({
          teamId: team.id,
          success: true,
          teamName: team.name,
          statsUpdated: stats !== null
        });
        
        console.log(`Updated team ${team.id} (${team.name})`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to update team ${team.id}:`, error instanceof Error ? error.message : 'Unknown error');
        results.push({
          teamId: team.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results as { teamId: number; success: boolean; teamName?: string; statsUpdated?: boolean; error?: string }[];
  } catch (error:any) {
    logger.error('Failed to update teams:', error);
    throw error;
  }
};
