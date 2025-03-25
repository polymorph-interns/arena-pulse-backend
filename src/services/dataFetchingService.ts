import {axios} from "axios";
import {Team,TeamStats} from "../models/teamModel";

//Is this necessary? I don't think so(Just overdoing)
interface ApiResponse<T> {
  get:string,
  parameters:Record<string,string>,
  errors:[string],
  results: number,
  response:T
}

interface TeamResponse {
  id: number;
  name: string;
  national: boolean;
  logo: string | null;
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
}

interface StatsResponse {
  league: {
    id: number;
    name: string;
    type: string;
    season: string;
    logo: string | null;
  };
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  team: {
    id: number;
    name: string;
    logo: string | null;
  };
  games: {
    played: {
      home: number;
      away: number;
      all: number;
    };
    wins: {
      home: {
        total: number;
        percentage: string;
      };
      away: {
        total: number;
        percentage: string;
      };
      all: {
        total: number;
        percentage: string;
      };
    };
    loses: {
      home: {
        total: number;
        percentage: string;
      };
      away: {
        total: number;
        percentage: string;
      };
      all: {
        total: number;
        percentage: string;
      };
    };
  };
  points: {
    for: {
      total: {
        home: number;
        away: number;
        all: number;
      };
      average: {
        home: string;
        away: string;
        all: string;
      };
    };
    against: {
      total: {
        home: number;
        away: number;
        all: number;
      };
      average: {
        home: string;
        away: string;
        all: string;
      };
    };
  };
}

