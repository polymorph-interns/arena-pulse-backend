import cron from 'node-cron';
import { updateAllTeams } from '../services/index';
// import { getCurrentSeason } from '../utils/seasonUtils';
import { TeamStats } from '../models/teamModel';
import {logger} from '../utils/logger';
import { fetchTeamsByLeague, fetchTeamStats } from '../apiClient';
import { UpSertTeam, UpsertTeamStats } from '../db';
import { NBA_LEAGUE_ID, CURRENT_SEASON } from '../constants';
import { Team } from '../models/teamModel';
import {updateTeamGames} from "../services/"
import Fixture from "../models/fixturesModel"

interface Team {
  id: number;
  [key: string]: any; // Additional properties if needed
}

interface UpdateResult {
  teamId: string;
  success: boolean;
}
export function scheduleTeamUpdates(): void {
  // Update all teams weekly (Monday 3 AM ET)
  cron.schedule('0 3 * * 1', async () => {
    try {
      const results = await updateAllTeams(CURRENT_SEASON, NBA_LEAGUE_ID);
      logger.info(`Weekly update completed. Updated ${results.filter(r => r.success).length} teams`);
    } catch (error: any) {
      logger.error('Weekly team update failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });

  //  Update active teams daily (6 PM ET)
  cron.schedule('0 18 * * *', async () => {
    try {
      const activeTeams = await TeamStats.find({
        updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }).distinct('teamId');
      
      if (activeTeams.length === 0) {
        logger.info('No active teams found for update');
        return;
      }

      const allTeams = await fetchTeamsByLeague(NBA_LEAGUE_ID, CURRENT_SEASON);
      
      
     

      const results: UpdateResult[] = [];

      for (const team of allTeams.filter((t: Team) => activeTeams.includes(t.id))) {
        try {
          await UpSertTeam(team);
          const statsResponse: any = await fetchTeamStats(team.id);
          
          if (statsResponse) {
        await UpsertTeamStats(team.id, Number(NBA_LEAGUE_ID), CURRENT_SEASON, statsResponse);
          }
          
          results.push({ teamId: team.id, success: true });
        } catch (error) {
          results.push({ teamId: team.id, success: false });
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      logger.info(`Updated ${results.filter(r => r.success).length} active teams`);
    } catch (error: any) {
      logger.error('Daily team update failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });

  logger.info('Team update jobs scheduled');
}



export function scheduleGameUpdates(): void {
  // Update games daily at 4 AM ET
  cron.schedule('0 4 * * *', async () => {
    try {
      // Get all teams that might have games
      const teams = await Team.find().distinct('id');
      
      if (teams.length === 0) {
        logger.info('No teams found for game updates');
        return;
      }

      const results = [];
      
      for (const teamId of teams) {
        try {
          const updatedGames = await updateTeamGames(teamId);
          results.push({
            teamId,
            success: true,
            gamesUpdated: updatedGames.length
          });
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          results.push({
            teamId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      logger.info(`Game update completed. Updated games for ${results.filter(r => r.success).length} teams`);
    } catch (error: any) {
      logger.error('Daily game update failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });

  cron.schedule('*/15 * * * * *', async () => {
    try {
      // Find games that are in progress
      const liveStatuses = ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT', 'HT'];
      const liveGames = await Fixture.find({
        'status.short': { $in: liveStatuses }
      }).distinct('teams.home.id');

      const uniqueTeamIds = [...new Set(liveGames)];
      
      if (uniqueTeamIds.length === 0) {
        return;
      }

      const results = [];
    
      for (const teamId of uniqueTeamIds) {
        try {
            // @ts-ignore
          const updatedGames = await updateTeamGames(teamId);
          results.push({
            teamId,
            success: true,
            gamesUpdated: updatedGames.length
          });
        } catch (error) {
          results.push({
            teamId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      logger.info(`Live game update completed. Updated ${results.filter(r => r.success).length} teams`);
    } catch (error: any) {
      logger.error('Live game update failed:', error);
    }
  });

  logger.info('Game update jobs scheduled');
}
