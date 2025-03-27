// src/routes/gameRoutes.ts

import express, {Request,Response} from 'express';
import { getGamesByTeam } from '../../controllers/games/gameController';
const gameRouter = express.Router();

gameRouter.get('/team/:teamId', getGamesByTeam);



export default gameRouter;
