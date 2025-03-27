import mongoose, { Schema } from "mongoose";

interface FixturesTypes {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  stage: string | null;
  week: string |  number | null;
  venue: string | null;
  status: {
    long: string;
    short: string;
    timer: string | null;
  };
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
  teams: {
    home: {
      id: number;
      name: string;
      logo: string | null;
    };
    away: {
      id: number;
      name: string;
      logo: string | null;
    };
  };
  scores: {
    home: {
      quarter_1: number;
      quarter_2: number;
      quarter_3: number;
      quarter_4: number;
      over_time: number | null;
      total: number;
    };
    away: {
      quarter_1: number;
      quarter_2: number;
      quarter_3: number;
      quarter_4: number;
      over_time: number | null;
      total: number;
    };
  };
}

const FixtureSchema = new Schema<FixturesTypes>({
  id: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  timestamp: { type: Number, required: true },
  timezone: { type: String, required: true },
  stage: { type: String, default: null },
  week: { type: Schema.Types.Mixed, default: null },
  venue: { type: String, default: null },
  status: {
    long: { type: String, required: true },
    short: { type: String, required: true },
    timer: { type: String, default: null },
  },
  league: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    season: { type: String, required: true },
    logo: { type: String, default: null },
  },
  country: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    flag: { type: String, required: true },
  },
  teams: {
    home: {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      logo: { type: String, default: null },
    },
    away: {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      logo: { type: String, default: null },
    },
  },
  scores: {
    home: {
      quarter_1: { type: Number, required: true },
      quarter_2: { type: Number, required: true },
      quarter_3: { type: Number, required: true },
      quarter_4: { type: Number, required: true },
      over_time: { type: Number, default: null },
      total: { type: Number, required: true },
    },
    away: {
      quarter_1: { type: Number, required: true },
      quarter_2: { type: Number, required: true },
      quarter_3: { type: Number, required: true },
      quarter_4: { type: Number, required: true },
      over_time: { type: Number, default: null },
      total: { type: Number, required: true },
    },
  },
});

export default mongoose.model<FixturesTypes>("Fixture", FixtureSchema);
