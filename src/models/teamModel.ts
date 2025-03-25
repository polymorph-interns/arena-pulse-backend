import { Schema, model, Document } from 'mongoose';

// Team Interface
export interface ITeam extends Document {
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
  updatedAt: Date;
}

// Team Schema
const teamSchema = new Schema<ITeam>({
  id: { type: Number, unique: true },
  name: String,
  national: Boolean,
  logo: String,
  country: {
    id: Number,
    name: String,
    code: String,
    flag: String
  },
  updatedAt: { type: Date, default: Date.now }
});

// Team Statistics Interface
export interface ITeamStats extends Document {
  teamId: number;
  leagueId: number;
  season: string;
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
  updatedAt: Date;
}

// Team Stats Schema
const teamStatsSchema = new Schema<ITeamStats>({
  teamId: { type: Number, index: true },
  leagueId: { type: Number, index: true },
  season: String,
  league: {
    id: Number,
    name: String,
    type: String,
    season: String,
    logo: String
  },
  country: {
    id: Number,
    name: String,
    code: String,
    flag: String
  },
  team: {
    id: Number,
    name: String,
    logo: String
  },
  games: {
    played: {
      home: Number,
      away: Number,
      all: Number
    },
    wins: {
      home: {
        total: Number,
        percentage: String
      },
      away: {
        total: Number,
        percentage: String
      },
      all: {
        total: Number,
        percentage: String
      }
    },
    loses: {
      home: {
        total: Number,
        percentage: String
      },
      away: {
        total: Number,
        percentage: String
      },
      all: {
        total: Number,
        percentage: String
      }
    }
  },
  points: {
    for: {
      total: {
        home: Number,
        away: Number,
        all: Number
      },
      average: {
        home: String,
        away: String,
        all: String
      }
    },
    against: {
      total: {
        home: Number,
        away: Number,
        all: Number
      },
      average: {
        home: String,
        away: String,
        all: String
      }
    }
  },
  updatedAt: { type: Date, default: Date.now }
});


export const Team = model<ITeam>('Team', teamSchema);
export const TeamStats = model<ITeamStats>('TeamStats', teamStatsSchema);
