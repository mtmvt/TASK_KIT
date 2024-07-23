import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  
  const { name, email, phone, password } = req.body;

  console.log("jknj" , req.body)
  if (!name || !email || !phone || !password) {
    return next(new ErrorHandler("Please fill full form11!",name, 400));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists!", 400));
  }
  
  user = await User.create({
    name,
    email,
    phone,
    password,
  });

  console.log("regis")
  sendToken("User Registered!", user, res, 200);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email  or password!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email  or password!", 400));
  }
  sendToken("User Logged In!", user, res, 200);
});

export const logout = catchAsyncErrors((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User Logged Out!",
    });
});
export const myProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
