import { Team } from "../models/teamModel";
import { fetchGames, fetchTeamsByLeague, fetchTeamStats, StatsResponse } from "../apiClient";
import { UpSertTeam, UpsertTeamStats } from "../db";
import { logger } from "../utils/logger";
import { TeamResponse } from "../apiClient";
import { CURRENT_SEASON, NBA_LEAGUE_ID } from "../constants";
import Fixture from "../models/fixturesModel";
import { stat } from "fs";

export const getTeamWithStats = async (
  teamId: number,
  season: string,
  league: string = NBA_LEAGUE_ID
) => {
  // const teams = await fetchTeamsByLeague(league, season);
  // const teamResponse: TeamResponse | undefined = teams.find((t: TeamResponse) => t.id === teamId);

  const teams = await Team.find().lean();
  const teamResponse: TeamResponse | undefined = teams.find(
    (t: TeamResponse) => t.id === teamId
  );

  if (!teamResponse) {
    return { team: null, stats: null };
  }

  const team = await UpSertTeam(teamResponse);
  const statsResponse = await fetchTeamStats(team.id, league, season);

  if (!statsResponse) {
    return { team, stats: null };
  }

  const stats = await UpsertTeamStats(
    team.id,
    Number(league),
    season,
    statsResponse
  );
  return { team, stats };
};

// 

export const updateAllTeams = async (
  // season: string,
  // league: string = NBA_LEAGUE_ID,
  teams: TeamResponse[] = [] 
): Promise<
  {
    teamId: number;
    success: boolean;
    teamName?: string;
    error?: string;
  }[]
> => {
  try {

    if (teams.length === 0) {
      throw new Error(
        `No teams found `
      );
    }

    const results = [];
    // const teamIds: number[] = teams.map((team: TeamResponse) => team.id); // Extract IDs from response

    for (const team of teams) {
      try {
        const upsertedTeam = await UpSertTeam(team);
        results.push({
          teamId: team.id,
          success: true,
          teamName: team.name,
        });

        console.log(`Updated team ${team.id} (${team.name} ${upsertedTeam})`);

      } catch (error) {
        console.error(
          `Failed to update team ${team.id}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
        results.push({
          teamId: team.id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results as {
      teamId: number;
      success: boolean;
      teamName?: string;
      error?: string;
    }[];
  } catch (error: any) {
    logger.error("Failed to update teams:", error);
    throw error;
  }
};

export const updateTeamStats = async (
  league: string = NBA_LEAGUE_ID,
  season: string = CURRENT_SEASON,
  teams:TeamResponse[]=[],
  statsResponses:Record<number, StatsResponse> = {}
): Promise<any> => {
  try {
    
    const results = [];
    let stats
    for (const team of teams) {
      try {
        const statsResponse = statsResponses[team.id]
         stats = await UpsertTeamStats(
          team.id,
          Number(league),
          season, 
          statsResponse
        )
        results.push({
          teamId: team.id,
          success: true,
          teamName: team.name,
          statsUpdated: stats !== null,
        });
        console.log(`Stats for team ${team.id} (${team.name}) updated successfully`);

        console.log(`Updated stats for  team ${team.id} (${team.name})`)
          
      } catch (error) {
        console.error(
          `Failed to update team ${team.id}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
        results.push({
          teamId: team.id,
          success: false,
          stats: statsResponses,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    
    }
    return results as {
      teamId: number;
      success: boolean;
      teamName?: string;
      statsUpdated?: boolean;
      error?: string;
    }[];
  } catch (error: any) {
    logger.error("Failed to update teams:", error);
    throw error;
  }

};

export const updateTeamGames = async (
  teamId: number
  // leagueId: string | number = NBA_LEAGUE_ID,
  // season: string = CURRENT_SEASON,
  // timezone: string = "America/New_York"
) => {
  try {
    logger.info(`Fetching games for team ${teamId}`);
    const games = await fetchGames(teamId);

    console.log("Raw API response:", JSON.stringify(games, null, 2)); // Add this line

    if (!games || games.length === 0) {
      logger.info(`No games found for team ${teamId}`);
      return [];
    }
    // @ts-ignore
    const updatePromises = games.map((game) =>
      Fixture.findOneAndUpdate({ id: game.id }, game, {
        upsert: true,
        new: true,
      }).lean()
    );

    const updatedGames = await Promise.all(updatePromises);
    logger.info(`Updated ${updatedGames.length} games for team ${teamId}`);
    return updatedGames;
  } catch (error: any) {
    logger.error(`Error updating games for team ${teamId}`, {
      error: error.message,
      teamId,
    });
    throw error;
  }
};

export const getTeamGames = async (
  teamId: number,
  leagueId: string | number = NBA_LEAGUE_ID,
  season: string = CURRENT_SEASON
) => {
  try {
    return await Fixture.find({
      $or: [{ "teams.home.id": teamId }, { "teams.away.id": teamId }],
      "league.id": leagueId,
      "league.season": season,
    })
      .sort({ timestamp: 1 })
      .lean();
  } catch (error: any) {
    logger.error(`Error fetching games for team ${teamId}`, {
      error: error.message,
      teamId,
      leagueId,
      season,
    });
    throw error;
  }
};
