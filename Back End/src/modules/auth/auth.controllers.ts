
import { Request, Response } from "express";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { OAuth2Client } from "google-auth-library";
dotenv.config();

export const registration = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, email, password, } = req.body;
  
if(!name || !email || !password){
  return res.status(404).json({message:'Please requird '})
}
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" })
    
  }

 

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  
  });

  await newUser.save();

  return res.status(201).json({
    message: "User registered successfully",
    data: {
      user: newUser,
    },
  }) ;
};





export const login = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, password, } = req.body;
  
if( !email || !password){
  return res.status(404).json({message:'Please requird '})
}
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" })
    
  }
   
const validpassword  :string|boolean= bcrypt.compareSync(password,user.password)
if (!validpassword) {
  return res.status(400).json({ message: "Password is wrong" })
}



const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET_USER!, {
    expiresIn: "1h",
  });

  return res.status(200).json({ message: "Password is correct",
data:{
    token:token,
    userid:user.id,
    email:user.email
}
})
};

//
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token } = req.body;


  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  console.log(ticket.getPayload(),"log ticket");
  

  const { email, name } = ticket.getPayload() as { email: string; name: string };



  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, name: name });
    await user.save();
  }

 
  const JWttoken = jwt.sign({ id: user?._id }, process.env.JWT_SECRET_USER!, {
    expiresIn: "1h",
  });

  res.status(200).json({ message: "from backend google auth",
    token: JWttoken,
    user,
  });
};

