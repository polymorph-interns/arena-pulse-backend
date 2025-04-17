// src/controllers/gameController.ts

import { Request, Response } from 'express';
import { getTeamFixtures } from '../../services/index';
import { logger } from '../../utils/logger';

export const getFixturesByTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { leagueId, season } = req.query;
    
    const games = await getTeamFixtures(
      Number(teamId),
      leagueId ? Number(leagueId) : undefined,
      season ? String(season) : undefined
    );
    
    res.json(games);
  } catch (error: any) {
    logger.error('Error fetching games by team', {
      error: error.message,
      params: req.params,
      query: req.query
    });
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};
