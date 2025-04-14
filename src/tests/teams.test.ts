import {beforeAll,afterAll,afterEach, describe,test, expect} from 'vitest';
import {MongoMemoryServer} from "mongodb-memory-server"
import mongoose from 'mongoose';
import {Team} from "../models/teamModel";
import { updateAllTeams, updateTeamStats } from '../services';
import { TeamData } from '../data';
import { fetchTeamStats } from '../apiClient';
import { StatsData } from '../data';
describe('Team Updates ', ()=>
{
  let connection: any;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    connection = await mongoose
      .connect(mongoUri, {
        autoCreate: true,
      })
      .then(() => {
        console.log('Database connected');
      });
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop().then(async () => {
        if (connection) {
          await connection.close();
        }
      });
    }
  });

  afterEach(async () => {
    // clean up after each
    await Team.deleteMany({});
  });

  describe('updateAllTeams', ()=>
    {
      test('given the update all teeam is called, it should return the list of the updated teams',
        async ()=>
        {
          const teams:any = TeamData;
         const result =  await updateAllTeams(teams);   
         expect(result).toHaveLength(32)
        }
      )
      test('given the update all teeam is called, it should  update the database with teams',
        async ()=>
        {
          const teams:any = TeamData;
         await updateAllTeams(teams);
         const teamsDb = await Team.find() 
         console.log(teamsDb) 
         expect(teamsDb).toHaveLength(32)
        }
      )
    })

    describe('Update All Teams Stats', ()=>
    {
      test('given the update team stats is called, it should populate the database with stats for each team', async ()=>
      {
          const teams :any = TeamData
          const statsResponse: any= await fetchTeamStats( 12, "2023-2024");
   const stats = await updateTeamStats("12", "2023-2024", teams, statsResponse);
  expect(stats).toEqual(StatsData);
});
      })
    })
  

