import {
  createUser,
  findUserByEmail,
  updatePassword,
  updateRefreshToken,
  findOrCreateUser,
} from "../repositories/user.repositry.js";
import bcrypt from "bcryptjs";
import { generateAccessToken,generateRefreshToken, verifyRefreshToken,removeRefreshToken } from "../utils/jwt.utils.js";
import { generateOTP } from "../utils/otp.utils.js";
import { sendEmail } from "../utils/email.utils.js";

// Handle Registration with details 
export const sigupDetails = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = data;
  console.log("data at service file :",data);
  // Check if the email already exists
  const userExists = await findUserByEmail(email);
  if (userExists) throw new Error("User already exists.");

  //create new user with the passed details
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({  name, email, password:hashedPassword });
  return newUser;
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


export const findOrCreateUserforPassport = async (profile: any, provider: string) =>{
  if(!profile) throw new Error('Profile not found');
  if(!provider) throw new Error('Provider not defined');

  let user = await findOrCreateUser(profile, provider);

  return user;
}

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

//Handle logout
export const logout = async(useremail:string) =>{;
  try {
    // Call the removeRefreshToken function 
    await removeRefreshToken(useremail);
  } catch (error: any) {
    throw new Error('Error during logout: ' + error.message);
  }
}
