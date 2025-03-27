import axios, { AxiosInstance } from "axios";
import { logger } from "./utils/logger";
import { NBA_LEAGUE_ID,CURRENT_SEASON } from "./constants";

type ApiResponse<T> = {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  response: T;
};

export type TeamResponse = {
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
};

export type StatsResponse = {
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
};
const APIKEY = process.env.BASKETBALL_API_KEY as string;
const createApiClient = (): AxiosInstance => {
 
  return axios.create({
    baseURL: "https://v1.basketball.api-sports.io",
    headers: {
      "x-rapidapi-host": "v1.basketball.api-sports.io",
      "x-rapidapi-key": APIKEY
    },
    paramsSerializer: params => {
      return Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');
    }
    // timeout: 5000
  });
  
};

const apiClient = createApiClient();

export const fetchTeamsByLeague = async (
  leagueId: string = NBA_LEAGUE_ID, 
  season: string = CURRENT_SEASON
) => {
  try {
    console.log('API Key:', process.env.BASKETBALL_API_KEY, APIKEY);
    console.log(`Fetching teams for league ${leagueId} season ${season}`);
    const response = await axios.get("https://v1.basketball.api-sports.io/teams?league=12&season=2023-2024", {
     headers:{
      "x-rapidapi-host": "v1.basketball.api-sports.io",
      "x-rapidapi-key": process.env.BASKETBALL_API_KEY
     }
    });
    console.log('Full API Response:', JSON.stringify(response.data, null, 2));
    // logger.info(response)
    if (!response.data.response || response.data.response.length === 0) {
      throw new Error(`No teams found for league ${leagueId} and season ${season}`);
    }
    
    return response.data.response;
  } catch (error: any) {
    logger.error("Error fetching teams", {
      error: error.message,
      leagueId,
      season
    });
    throw error;
  }
};

export const fetchTeamStats = async (
  teamId: number , 
  leagueId: string | number  = NBA_LEAGUE_ID, 
  season: string = CURRENT_SEASON
) => {
  try {
    const response = await axios.get("https://v1.basketball.api-sports.io/statistics", {
      headers:{
        "x-rapidapi-host": "v1.basketball.api-sports.io",
        "x-rapidapi-key": process.env.BASKETBALL_API_KEY
       },
      params: {
        team: teamId,
        league: leagueId,
        season: season
      }
    });
    return response.data.response;
  } catch (error: any) {
    logger.error("Error fetching team stats", {
      error: error.message,
      teamId,
      leagueId,
      season
    });
    throw error;
  }

  
};

export const fetchGames = async (
  teamId: number,
  leagueId: string | number = NBA_LEAGUE_ID,
  season: string = CURRENT_SEASON,
  timezone: string = "America/New_York"
) => {
  try {
    const response = await axios.get('https://v1.basketball.api-sports.io/games', {
      headers: {
        "x-rapidapi-host": "v1.basketball.api-sports.io",
        "x-rapidapi-key": process.env.BASKETBALL_API_KEY
      },
      params: {
        team: teamId,
        league: leagueId,
        season: season,
        timezone: timezone  // Note lowercase 'z'
      }
    });
    
    // Add debug logging
    logger.info('Games API response', {
      url: response.config.url,
      params: response.config.params,
      dataCount: response.data.response?.length || 0
    });
    
    return response.data.response;
  } catch (error: any) {
    logger.error("Error fetching games", {
      error: error.message,
      teamId,
      leagueId,
      season,
      timezone,
      // Include full error details if available
      response: error.response?.data
    });
    throw error;
  }
}