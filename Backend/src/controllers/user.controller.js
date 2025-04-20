import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
  //get user details from the frontend
  // validation
  //check if user is already exist :username ,email
  //check image ,check for avatar
  // create user object - create entry in db
  // remove pass and refres token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email & username already exists");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImagePath = req.files?.coverImage[0]?.path;

  // let coverImagePath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImagePath = req.files.coverImage[0].path;
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar is required in local path");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImagePath);
  // if (!avatar) {
  //   throw new ApiError(400, "Avatar is required");
  // }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createduser) {
    throw new ApiError(500, "Something went wrong while creating");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createduser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("username email role fullName -_id")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  )

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const  incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorize Access");
    }

    try {
        const decodedToken  = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
        const user  = await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401,"Invalid refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
    
        const option = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newrefreshToken} =  generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie('accessToken',accessToken,option)
        .cookie('refreshToken',newrefreshToken,option)
        .json(
            new ApiResponse(
                200,{
                    accessToken,refreshToken:newrefreshToken
                },
                'Access token refreshed'
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh Token");
        
    }

})

const getAllStudents = asyncHandler(async (req, res) => {
  try {
    const users = await User.find(
      { role: "student" },
      { username: 1, _id: 0 }
    );

    // Check if the users array is empty
    if (users.length === 0) {
      throw new ApiError(404, "No students found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200, {
            users
          }
        )
      );

  } catch (error) {
    // Return a custom error message for any unexpected errors
    throw new ApiError(500, error?.message || "Error while Fetching the Students");
  }
});



const verifyUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(userId).select("username email role fullName"); // Expose only necessary fields

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ 
    user: {
      _id:user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});





export { registerUser, loginUser, logoutUser,refreshAccessToken,getAllStudents,verifyUser};
 