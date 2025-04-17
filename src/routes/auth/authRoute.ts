import Router from "express"
import { authController } from "../../controllers/auth/authController";
import { Request, Response } from "express";


 const authRouter = Router();


authRouter.post("/create-account", async(req:Request, res:Response)=>
{
  const {firstName, lastName, email,password} = req.body;
  try {
    const userData = await authController.createAccount({firstName, lastName, email, password});
    res.status(201).json({message:"Account successflly created", data: userData})
    
  } catch (error:any) {
    // console.log(error)
   res.status(400).json({message: error.message}) 
  }
})


authRouter.post("/login", async(req:Request, res:Response)=>
{
  const {email, password} = req.body;
  if(!email || !password)
  {
   throw Error("Email and password are required")
  }
  try {
    const token = await authController.logUserIn({email, password});
    // console.log(email, password)
    // console.log(token)
    res.status(200).json({message:"Login successful", token})
  } catch (error:any) {
    // console.log(error)
    res.status(400).json({message: error.message})
  }
})

authRouter.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL parameters
    const userDetails = await authController.getUserDetails(userId);
    res.status(200).json({ message: "User details fetched successfully", data: userDetails });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
export default authRouter;

