// src/routes/gameRoutes.ts

import express, {Request,Response} from 'express';
import { getFixturesByTeam } from '../../controllers/games/gameController';
const fixtureRouter = express.Router();

fixtureRouter.get('/team/:teamId', getFixturesByTeam);



export default fixtureRouter;
