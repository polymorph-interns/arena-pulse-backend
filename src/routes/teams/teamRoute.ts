import express,{Router} from 'express';
import { Team } from '../../models/teamModel';
import { updateAllTeams, getTeamWithStats, updateTeamStats } from '../../services/index';
import { NBA_LEAGUE_ID,CURRENT_SEASON } from '../../constants';
import { fetchTeamsByLeague, fetchTeamStats, StatsResponse } from '../../apiClient';
// import { getCurrentSeason } from '../../utils/seasonUtils';

const teamRouter = Router();


teamRouter.get("/", async (req, res) => {
  try {
    const teams = await Team.find({}).lean();
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
// @ts-ignore
teamRouter.get('/:id', async (req, res) => {
  try {
    const team = await Team.findOne({ id: req.params.id }).lean();
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// @ts-ignore
teamRouter.get('/:id/stats', async (req, res) => {
  try {
    const { season = CURRENT_SEASON, league = NBA_LEAGUE_ID } = req.query;
    const result = await getTeamWithStats(
      Number(req.params.id),
      season as string,
      league as string
    );
    
    if (!result.team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

teamRouter.post('/update-teams', async (req, res) => {
  try {
    const { season = CURRENT_SEASON, league = NBA_LEAGUE_ID } = req.body;
    const teams = await fetchTeamsByLeague(league, season);

    const results = await updateAllTeams(teams);
    
    res.json({
      success: true,
      updated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});
export default teamRouter;

teamRouter.post("/update-team-stats", 
  async (req, res) =>
  {
    try {
      const { season = CURRENT_SEASON, league = NBA_LEAGUE_ID } = req.query;
      const teams =  await Team.find().lean();
      const statsResponses :Record<number, StatsResponse> = {}
        for (const team of teams) {
          // @ts-ignore
          try {
            const stats = await fetchTeamStats(Number(team.id), league as string, season as string)

            statsResponses[team.id] = stats;
          } catch (error) {
            console.log(`Failed to fetch stats for team ${team.id}`)
          }
          
      }
      // @ts-ignore
      const results = await updateTeamStats(league as string, season as string,teams, statsResponses, );
      console.log(results)
      res.json(results)
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
)

