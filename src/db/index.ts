import { Team, TeamStats } from "../models/teamModel";
import  {TeamResponse, StatsResponse} from "../apiClient"

export const UpSertTeam = async(teamData: TeamResponse) =>
{
  return Team.findOneAndUpdate({id: teamData.id}, teamData, {upsert: true, new: true}).lean();
}

export const UpsertTeamStats = async (
  teamId: number,
  leagueId: number,
  season: string,
  statsData: StatsResponse
) => {
  return TeamStats.findOneAndUpdate(
    { teamId, leagueId, season },
    { $set: { ...statsData, updatedAt: new Date() } },
    { upsert: true, new: true }
  ).lean();
};

export const getCurrentSeason = (): string => {
  const currentYear = new Date().getFullYear();
  return `${currentYear - 1}-${currentYear}`;
};
