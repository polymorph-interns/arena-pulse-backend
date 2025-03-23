import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export const jwtUtils = {
 generateToken:(userId:string):string =>
 {
    return jwt.sign({userId}, process.env.JWT_SECRET as string, {expiresIn: "1h"});
 },

 verifyToken:(token:string)=>
 {
  return jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded)=>{
    if(err)
    {
      return err.message;
    }
    return decoded;
  })
 }
  
}
