import {beforeAll,afterAll,afterEach, describe,test, expect, vi} from 'vitest';
import {MongoMemoryServer} from "mongodb-memory-server"
import mongoose from 'mongoose';
import {Team} from "../models/teamModel";
import { updateAllTeams, updateTeamStats } from '../services';
import { TeamData } from '../data';
import { fetchTeamsByLeague } from '../apiClient';
import { fetchTeamStats } from '../apiClient';
import { StatsData } from '../data';
import request from "supertest"
import app from '../app';
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
          //New Implementation Using Mocking

          /*nitially, I thought to mock the actual function but then I realized it won't make sense since it will implement the function 
          basically return the actual data and not the mock data
          If I still wanted to mock the function itself that would require creating a function that hits a fake endpoint
          i.e.does not go to the internet and basically make it return the mock data.
          Then I can basically mock that function (I think that could also be effective in some cases) 
          This also made me think about the modularity of the fetchTeamsByLeague function , where I can essentially use an axios instance with parameters of a base URL and pass that into the fetchTeamLByleagues function
          It will make it replicate the mock fetchTeamsByLeague function(Maybe)
          However , for now since I have the actual response from the internet api, I can just mock it and use that 
          */

          // const mockfetchTeamData = vi.fn().mockResolvedValue(TeamData)
          // const teamData = await mockfetchTeamData()
          // const result = await updateAllTeams(teamData)


          // Previous Implementation)
          const teams:any = TeamData;
         const result =  await updateAllTeams(teams);   
         expect(result).toHaveLength(32)
        }
      )
      test('given the update all teeam is called, it should  update the database with teams',
        async ()=>
        {
          // const mockfetchTeamData = vi.fn().mockResolvedValue(TeamData)
          // const teamData = await mockfetchTeamData()
          // const result = await updateAllTeams(teamData)
          const teams:any = TeamData;
         await updateAllTeams(teams);
        
         const teamsDb = await Team.find() //Seen spying been used on stuff like this. But there is already a memory mongodb server , so it may not be necessary
         console.log(teamsDb) 
         expect(teamsDb).toHaveLength(32)
        }
      )
    })

    describe('Update All Teams Stats', ()=>
    {
      test('given the update team stats is called, it should populate the database with stats for each team', async ()=>
      {
        const mockfetchTeamData = vi.fn().mockResolvedValue(TeamData)
        const teamData = await mockfetchTeamData()
        // const result = await updateAllTeams(teamData)
      

        //Will have to mokc this data 
          const statsResponse: any= await fetchTeamStats( 12, "2023-2024");
   const stats = await updateTeamStats("12", "2023-2024", teamData, statsResponse);
  expect(stats).toMatchObject(StatsData);
});
      })

    
      
    })
  
    //Testing the teams API
   

