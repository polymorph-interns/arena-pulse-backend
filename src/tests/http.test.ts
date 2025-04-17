import {describe, expect ,test} from "vitest" 
import request from "supertest"
import app from "../app"
import { TeamData } from "../data"

describe('these are the main app requests', ()=> {
  describe('GET /v1/teams/',()=>
    {
      test('given the season and league id, should return the list of teams in the leaguea and season', async ()=>
      {
        const res = await request(app)
        .get('/api/v1/teams')
        .expect('Content-Type', /json/)
        .expect(200);
  
        expect (res.body.message).toBe(TeamData)
      })
    })

    describe('GET /api/v1/teams')
})

