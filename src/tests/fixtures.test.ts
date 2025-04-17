import {beforeAll,afterAll,afterEach, describe,test, expect} from "vitest"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import Fixtures from "../models/fixturesModel"
import { fetchGames } from "../apiClient"
import { updateTeamFixtures } from "../services"
import { TeamData } from "../data"
import { Fixture137 } from "../data"
import { convertOidFields } from "../utils/convertOID"
describe('given the update game function a list of games should be updated in the db', ()=>
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
      await Fixtures.deleteMany({});
    });
 

  test('',async ()=>
  {
    const team = TeamData[5]
    const fixtures = convertOidFields(Fixture137)
    console.log("games",fixtures)
    const result = await updateTeamFixtures(team.id, fixtures)
    console.log("result",result)
    expect(result).toHaveLength(48)
  })
})
