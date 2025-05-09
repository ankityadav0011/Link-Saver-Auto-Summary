const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

async function register(req,res){
  const {email,password}= req.body;
  if(!email || !password){
      return res.status(400).json({
          message:"Email and password are required"
      })
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
      return res.status(409).json({
          message: "User already exists. Please login"
      });
  }
  const hashedPassword = await bcrypt.hash(password,10);
  try{
     const user = await User.create({
        email,
        password:hashedPassword
     });
     const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
     res.status(201).json({
        message:"User created Successfully",
        user:{
          id:user._id,
          email:user.email,
        },
        token
     })

  }
  catch(e){
     return res.status(500).json({
      message:"Error creatng USer",
      error:e.message
     })
  }
}




// login 

async function login(req,res){
  try{
    const {email,password}= req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"Email and password are required"
        })
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({
            message:"Invalid Password"
        })
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.status(200).json({
        message:"Login Successful",
        user:{
          id:user._id,
          email:user.email,
        },
        token
     })
  }
  catch(e){
    return res.status(500).json({
      message:"Error logging in",
      error:e.message
    })
  }
}

module.exports= {
  register,
  login
}