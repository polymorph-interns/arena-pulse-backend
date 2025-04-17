import { describe, expect, test, beforeAll, afterAll, afterEach } from "vitest"
import request from "supertest"
import express from "express"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import authRouter from "../routes/auth/authRoute"
import  User  from "../models/userModel" 
import { authController } from "../controllers/auth/authController"

const app = express();
app.use(express.json());
app.use('/v1/auth', authRouter); // Mounted at /v1/auth

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  // Clean up database between tests
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
 
});

describe('Authentication HTTP Request tests', ()=>
{
  describe('Register HTTP requests', ()=>
  {
    test('should create account and return 201 with token', async () => {
      const response = await request(app)
        .post('/v1/auth/create-account') 
        .send({
          firstName: "Selasie",
          lastName: "Sepenu",
          email: "test@example.com",
          password: "validPassword123"
        })
        .expect(201);
  
      // expect(response.body).toHaveProperty('token');
      // expect(typeof response.body.token).toBe('string');
      
      // Verify user was actually created
      const user = await User.findOne({ email: "test@example.com" });
    
      expect(user).toBeDefined();
      expect(user?.firstName).toBe("Selasie");
      expect(response.body.data).toHaveProperty('token');
      expect(typeof response.body.data.token).toBe('string');
    });
    test("given no first name but last name, email and password",async()=>
    {
      await expect(authController.createAccount({lastName:"Sepenu",email: "test@example.com", password:"validPassword123"} as any))
      .rejects
      .toThrowError("First name is required")
    })
    test("given no last name but first name, email and password",async()=>
    {
      await expect(authController.createAccount({firstName:"Sepenu",email: "test@example.com", password:"validPassword123"} as any))
      .rejects
      .toThrowError("Last name is required")
    })
    test("given no email but first name, last name and password",async()=>
    {
      await expect(authController.createAccount({lastName:"Sepenu",firstName:"Sepenu", password:"validPassword123"} as any))
      .rejects
      .toThrowError("Email is required")
    })
    test("given no password but first name, last name and email",async()=>
    {
      await expect(authController.createAccount({lastName:"Sepenu",email: "test@example.com", firstName:"Sepenu"} as any))
      .rejects
      .toThrowError("Password is required")
    })
  })
  describe('Login HTTP Requests', ()=>
  {
  test('given email and password, return a token and a status code of 200 - POST v1/auth/login ', async ()=>
  {

    await authController.createAccount({
      firstName:"Selasie",
      lastName: "Sepenu",
      email:"test@example.com",
      password: "validPassword123"
    })

    const response = await request(app)
    .post('/v1/auth/login')
    .send({
        email: "test@example.com",
      password: "validPassword123"
    })
    .expect(200)
    
    const user = await User.findOne({ email: "test@example.com" });
    expect(user).toBeDefined();
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body.token).toHaveProperty('token')
    expect(typeof response.body.token.token).toBe('string')
  })
  test('given just email without password,should return a rejected promise and throw an error', async ()=>
  {
    await expect(authController.logUserIn({email: "test@example.com"} as any))
  .rejects
  .toThrowError("An error occured while logging in")
  })
  
  test('given just password without email, should return a rejected promise and throw an error', async ()=>
  {
    await expect(authController.logUserIn({password: "validPassword123"} as any))
    .rejects
    .toThrowError("An error occured while logging in")
  })
  })
test("given no email and password,should return a rejected promise and throw an error", async ()=>
{
  await expect(authController.logUserIn({} as any))
  .rejects
  .toThrowError("An error occured while logging in")
})
})
