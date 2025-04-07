export const typeDefs =`#graphql
#Team Data Schema Definition
type Team {
  id: ID!
  name: String!
  national:Boolean
  logo:String,
  country: Country!
  updatedAt: String!
}



#Team Statistics Schema Definition
type TeamStats{
  teamId:ID!,
  leagueId: ID!,
  season:String!
  country: Country!
  games: Games!
  points: Points!
  updatedAt: String!
}


type Games {
played: Played!
wins: Wins!
loses: Loses!
}
type Played {
  home: Int!
  away: Int!
  all: Int!
}
type Wins {
home: Home!
away: Home!
all: Home!
}

type Loses{
home: Home!
away: Home!
all: Home!
}


type Home {
  total: Int!
  percentage: String!
}


type Points{
  for:For!
  against: Against!
}
type For{
total: Total!
average: Average!
}

type Against{
total: Total!
average:Average!
}

type Total {
  home: Int!
  away: Int!
  all:Int!
}
type Average {
  home: Int!
  away: Int!
  all:Int!  
}
type Country {
  id:ID!,
  name:String!,
  code: String!,
  flag:String!
}

union StringOrNumber = WeekNumber | WeekString

type WeekNumber {
  week: Int
}
type WeekString{
  week:String
}
#Schema Definition for Fixutres
type Fixtures {
  id: ID!
  date: String!
  time: String!
  timestamp: Int!
  timezone: String!
  stage: String
  week: StringOrNumber
  venue: String
  status: Status!
  league: League!
  country: Country!
  teams: Teams!
  scores: Scores
}



type Status{
  long:String!
  short: String!
  timer: String
}
type Teams{
home:HomeorAwayTeam!
away: HomeorAwayTeam!
}

type HomeorAwayTeam {
  id: ID!
  name: String!
  logo: String
}

type Scores {
home: HomeOrAwayScores
away: HomeOrAwayScores
}

type HomeOrAwayScores{
  quarter_1: Int
  quarter_2: Int
  quarter_3: Int
  quarter_4: Int
  over_time: Int
  total: Int
}
 type League{
  id:Int
  name: String
  type: String
  season: String
  logo: String
 }

#General query type for GraphQl
type Query{
    hello: String!
    teams: [Team!]!
    team(id: ID!): Team
    teamStats(teamId: ID!): TeamStats
    fixtures(teamId:ID!,leagueId: String, season: String): [Fixtures!]
}

`
