import express,{Router} from 'express';
import { Team } from '../../models/teamModel';
import { updateAllTeams, getTeamWithStats } from '../../services/index';
import { NBA_LEAGUE_ID,CURRENT_SEASON } from '../../constants';
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
    const results = await updateAllTeams(season, league);
    
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
