import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { User } from "./user.model.js";
import { uploadOnCloudinary } from "../../shared/utils/cloudinary.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { Profile } from "./profile.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "username email role fullName -_id"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged In Successfully"
      )
    );
});

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
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorize Access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const option = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    const { accessToken, newrefreshToken } = generateAccessAndRefereshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newrefreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newrefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const getAllStudents = asyncHandler(async (req, res) => {
  try {
    const users = await User.find(
      { role: "student" },
      { username: 1, _id: 1, fullName: 1 }
    );

    if (users.length === 0) {
      throw new ApiError(404, "No students found");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        users,
      })
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Error while Fetching the Students"
    );
  }
});

const getAllTeacher = asyncHandler(async (req, res) => {
  try {
    const users = await User.find(
      { role: "teacher" },
      { username: 1, _id: 1, fullName: 1 }
    );

    if (users.length == 0) {
      throw new ApiError(404, "No Teacher Found");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        users,
      })
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Error while Fetching the Teachers"
    );
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(userId).select(
    "username email role fullName"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        avatar: user.avatar
      },
    }, "User verified successfully")
  );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let profile = await Profile.findOne({ user: userId });
  
  if (!profile) {
    profile = {
      bio: "",
      education: [],
      projects: [],
      achievements: [],
      socialLinks: {}
    };
  }

  return res.status(200).json(
    new ApiResponse(200, { user, profile }, "Profile fetched successfully")
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { bio, education, projects, achievements, socialLinks, contact, personalWebsite } = req.body;

  let profile = await Profile.findOne({ user: userId });

  if (profile) {
    profile.bio = bio || profile.bio;
    profile.education = education || profile.education;
    profile.projects = projects || profile.projects;
    profile.achievements = achievements || profile.achievements;
    profile.socialLinks = socialLinks || profile.socialLinks;
    profile.contact = contact || profile.contact;
    profile.personalWebsite = personalWebsite || profile.personalWebsite;
    await profile.save();
  } else {
    profile = await Profile.create({
      user: userId,
      bio,
      education,
      projects,
      achievements,
      socialLinks,
      contact,
      personalWebsite
    });
  }

  return res.status(200).json(
    new ApiResponse(200, profile, "Profile updated successfully")
  );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "Full name and email are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email
      }
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, user, "Account details updated successfully")
  );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getAllStudents,
  getAllTeacher,
  verifyUser,
  getUserProfile,
  updateProfile,
  updateAccountDetails,
  updateUserAvatar,
};
