import mongoose from "mongoose"
import User from "../../models/userModel"
import { jwtUtils } from "../../utils/jwtUtils"
import bcrypt from "bcrypt"


export const authController= {
  createAccount :async(firstName:string, lastName:string, email:string, password:string)=>
  {
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
     password: hashedPassword
    })
    newUser.save();
    const token = jwtUtils.generateToken(newUser._id as unknown as string)
    return {token, user: {firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email}}
   }
   catch(err:any){
    throw new Error(`Failed to create an account. Please try again.`)
   }
},

logUserIn:async(email:string, password:string)=>
{
  try {
    const user = await User.findOne({email})
    if(!user)
    {
      throw new Error("user not found")
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid)
    {
      throw new Error("Invalid password")
    }
    const token = jwtUtils.generateToken(user._id as unknown as string)
      return {token, user: {firstName: user?.firstName, lastName: user?.lastName, email: user?.email}}
  } catch (error:any) {
    throw new Error(`An error occured while logging in: ${error.message}`)
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
