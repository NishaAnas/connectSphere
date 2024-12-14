import {
  createUser,
  findUserByEmail,
  findUserById,
  updatePassword,
  updateRefreshToken,
} from "../repositories/user.repositry.js";
import bcrypt from "bcryptjs";
import { generateAccessToken,generateRefreshToken, verifyRefreshToken,removeRefreshToken } from "../utils/jwt.utils.js";
import { generateOTP } from "../utils/otp.utils.js";
import { sendEmail } from "../utils/email.utils.js";

// Handle personal details registration
export const savePersonalDetails = async (data: {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
}) => {
  const { fullName, email, phone, dateOfBirth } = data;

  // Check if the email already exists
  const userExists = await findUserByEmail(email);
  if (userExists) throw new Error("User already exists.");

  //create new user with the passed details
  const newUser = await createUser({ fullName, email, phone, dateOfBirth });
  return newUser;
};

// Handle account details registration
export const saveAccountDetails = async (data: {
  userId: string;
  username: string;
  password: string;
  confirmPassword: string;
}) => {
  const { userId, username, password, confirmPassword } = data;

  if (password !== confirmPassword) throw new Error("Passwords do not match.");

  const user = await findUserById(userId);
  if (!user) throw new Error("User not found.");

  const hashedPassword = await bcrypt.hash(password, 10);
  user.username = username;
  user.password = hashedPassword;

  await user.save();
  return user;
};

// Handle professional details registration
export const saveProfessionalDetails = async (data: {
  userId: string;
  jobTitle?: string;
  industry?: string;
}) => {
  const { userId, jobTitle, industry } = data;

  const user = await findUserById(userId);
  if (!user) throw new Error("User not found.");

  user.jobTitle = jobTitle;
  user.industry = industry;

  await user.save();
  return user;
};

// Handle reason and role registration
export const saveReasonAndRole = async (data: {
  userId: string;
  reasonForJoining?: string;
  role: "user" | "mentor";
}) => {
  const { userId, reasonForJoining, role } = data;

  const user = await findUserById(userId);
  if (!user) throw new Error("User not found.");

  user.reasonForJoining = reasonForJoining;
  user.role = role;

  if (role === "mentor") {
    user.isMentorApproved = false;
  }

  await user.save();
  return user;
};

// Handle login logic
export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");


  // Ensure user.password is defined
  if (!user.password) {
    throw new Error("Password not set for user");
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // Generate JWT token
  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  // Save the refresh token in the database
  await updateRefreshToken(user._id.toString(), refreshToken);
  return { user, accessToken, refreshToken };
};


// Handle refresh token logic
export const refreshToken = async (refreshToken: string) => {
  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate a new access token
    const newAccessToken = generateAccessToken({ userId: decoded.userId });

    return { newAccessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token.");
  }
};

//Handle forgot password
const otpStore: Record<string, string> = {}; // Temporary storage for OTPs

export const forgotPassword = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found.");

  const otp = generateOTP();
  otpStore[email] = otp; // Save OTP in memory
  await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);
  
  // Return the OTP for testing (remove in production)
  return otp;
};

//Handle veify OTP logic
export const verifyOTP = async (email: string, otp: string) => {
  if (otpStore[email] !== otp) throw new Error("Invalid or expired OTP.");
  delete otpStore[email]; // OTP is used once
  return generateAccessToken({ email }, "10m"); // Temporary token for resetting password
};

//Handle reset password
export const resetPassword = async (email: string, newPassword: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found.");

  //Compare the old password with the new one
  const isSamePassword = await bcrypt.compare(newPassword, user.password || "");
  if (isSamePassword)
    throw new Error("New password cannot be the same as the old password.");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updatePassword(user._id.toString(), hashedPassword);
};

export const logout = async(userId:string) =>{
  try {
    // Call the removeRefreshToken function 
    await removeRefreshToken(userId);
  } catch (error: any) {
    throw new Error('Error during logout: ' + error.message);
  }
}