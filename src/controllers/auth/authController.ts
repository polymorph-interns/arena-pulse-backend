import mongoose from "mongoose"
import User from "../../models/userModel"
import { jwtUtils } from "../../utils/jwtUtils"
import bcrypt from "bcrypt"


export const authController= {
  createAccount :async({firstName,lastName,email,password}:{firstName:string, lastName:string, email:string, password:string})=>
  {
    if(!firstName)
    {
      throw new Error("First name is required")
    }
    if(!lastName)
    {
      throw new Error("Last name is required")
    }
    if(!email)
    {
      throw new Error("Email is required")
    }
    if(!password)
    {
      throw new Error("Password is required")
    }
   try{
    const emailExists = await User.findOne({email})
    if(emailExists)
    {
      throw new Error("This email is already in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser =  new User ({
      firstName,
      lastName,
      email,
      password:hashedPassword
    })
    // console.log(firstName,lastName,email,password)
    await newUser.save();
    const token = jwtUtils.generateToken(newUser._id as unknown as string)
    // console.log(token)
    return {token, user: {firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email}}
   }
   catch(err:any){
    console.log({err})
    throw new Error(`Failed to create an account. Please try again.`)
   }
},

logUserIn:async({email, password}:{email:string, password:string})=>
{
  try {
    if(!email || !password){
      throw new Error("Email and password are required");
    }
    const user = await User.findOne({email})
    if(!user)
    {
      throw new Error("User not found")
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid)
    {
      throw new Error("Invalid password")
    }
    const token = jwtUtils.generateToken(user._id as unknown as string)
      return {token, user: {firstName: user?.firstName, lastName: user?.lastName, email: user?.email}}
  } catch (error:any) {
    throw new Error(`An error occured while logging in`)
    // console.log(error)
  }
},

getUserDetails: async (userId: string) => {
  try {
    // Check if userId is provided
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Return only the necessary user details
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  } catch (error: any) {
    throw new Error(`An error occurred while fetching user details: ${error.message}`);
  }
}
}
