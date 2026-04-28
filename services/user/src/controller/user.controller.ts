import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import ENV from "../config/env.config.js";
import TryCatch from "../utils/tryCatch.js";
import type { AuthenticatedRequest } from '../types/authenticatedRequest.js';

export const loginUser = TryCatch(async (req, res) => {
  const { email, name, image } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      image,
    });
  }

  const token = jwt.sign(
    {
      user,
    },
    ENV.JWT_SECRET as string,
    { expiresIn: "5d" },
  );

  res.status(200).json({
    success: true,
    data: {
      token,
      user,
    },
  });
});

export const myProfile = TryCatch(async (req:AuthenticatedRequest, res) => {
  const user = req.user;
  res.status(200).json(
    user,
  )
});

export const getUserProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(!user){
    res.status(400).json({
      success: false,
      message: `No user with the id: ${req.params.id}`
    })
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user
    },
  })
});

export const updateUser = TryCatch(async (req:AuthenticatedRequest, res) => {
  const {name, instagram, facebook, linkedin, bio} = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      name,
      instagram,
      facebook,
      linkedin,
      bio
    },
    {
      new: true,
    }
  );

  const token = jwt.sign(
    {
      user,
    },
    ENV.JWT_SECRET as string,
    { expiresIn: "5d" },
  );

  res.status(201).json({
    success: true,
    data: {
      token,
      user,
    }
  })
})