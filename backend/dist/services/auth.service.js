import { createUser, findUserByEmail, updatePassword, updateRefreshToken, findUserById, isProfileComplete, updateUser, } from "../repositories/user.repositry.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, removeRefreshToken, } from "../utils/jwt.utils.js";
import { generateOTP } from "../utils/otp.utils.js";
import { sendEmail } from "../utils/email.utils.js";
import config from "../config/env.config.js";
import { uploadImage } from "../utils/cloudinary.utils.js";
import { OAuth2Client } from "../utils/googleconfig.utils.js";
import axios from "axios";
const gitclientId = config.githubclientid;
const gitclientSecret = config.githubclientsecret;
// Handle Registration with details
export const sigupDetails = async (data) => {
    const { name, email, password } = data;
    console.log("data at service file :", data);
    // Check if the email already exists
    const userExists = await findUserByEmail(email);
    if (userExists)
        throw new Error("User already exists.");
    //create new user with the passed details
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashedPassword });
    return newUser;
};
// Handle login logic
export const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user)
        throw new Error("User not found");
    if (user.isBlocked) {
        throw new Error("Blocked");
    }
    if (!user.password) {
        throw new Error("This account is registered using a third-party provider. Please log in with your provider.");
    }
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    // Generate JWT token
    const accessToken = generateAccessToken({
        userId: user._id,
        userRole: user.role,
    });
    const refreshToken = generateRefreshToken({
        userId: user._id,
        userRole: user.role,
    });
    // Save the refresh token in the database
    await updateRefreshToken(user._id.toString(), refreshToken);
    return { user, accessToken, refreshToken };
};
// Handle refresh token logic
export const refreshToken = async (refreshToken) => {
    try {
        // Verify the refresh token
        const decoded = verifyRefreshToken(refreshToken);
        // Generate a new access token
        const newAccessToken = generateAccessToken({ userId: decoded.userId });
        return { newAccessToken };
    }
    catch (error) {
        throw new Error("Invalid or expired refresh token.");
    }
};
//Handles google signin
export const googleSignupService = async (code) => {
    // Exchange code for tokens
    const { tokens } = await OAuth2Client.getToken(code);
    OAuth2Client.setCredentials(tokens);
    // Fetch user info from Google
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`);
    const { email, name, picture } = userRes.data;
    console.log("Google User Info during signup:", { email, name, picture });
    // Check if the email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("Email already registered.");
    }
    // Create a new user using the repository
    const newUser = await createUser({
        name,
        email,
        provider: "google",
        providerId: tokens.id_token,
        profilePic: picture,
        password: null, // No password for Google users
    });
    return newUser;
};
//Handles login with google
export const googleLoginService = async (code) => {
    //Exchange code for access token
    const tokenResponse = await axios.post(`https://github.com/login/oauth/access_token`, {
        client_id: gitclientId,
        client_secret: gitclientSecret,
        code,
    }, {
        headers: {
            Accept: "application/json",
        },
    });
    const { access_token } = tokenResponse.data;
    //Fetch user details from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    const { email } = userResponse.data;
    // Check if the email exists in the database
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
        throw new Error("Email not registered");
    }
    // Generate JWT tokens
    const accessToken = generateAccessToken({
        userId: existingUser._id,
        userRole: existingUser.role,
    });
    const refreshToken = generateRefreshToken({
        userId: existingUser._id,
        userRole: existingUser.role,
    });
    // Save refresh token to the database
    await updateRefreshToken(existingUser._id.toString(), refreshToken);
    return { user: existingUser, accessToken, refreshToken };
};
//Handles github signup
export const githubSignupService = async (code) => {
    try {
        // Step 1: Exchange code for access token
        const tokenResponse = await axios.post(`https://github.com/login/oauth/access_token`, {
            client_id: gitclientId,
            client_secret: gitclientSecret,
            code,
        }, {
            headers: {
                Accept: "application/json",
            },
        });
        const { access_token } = tokenResponse.data;
        // Step 2: Fetch user details from GitHub
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { login: githubUsername, email: initialEmail, avatar_url: profilePic, name, } = userResponse.data;
        let email = initialEmail;
        // Step 3: Fetch emails explicitly if not included in the initial response
        if (!email) {
            const emailsResponse = await axios.get("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const primaryEmail = emailsResponse.data.find((e) => e.primary);
            if (primaryEmail) {
                email = primaryEmail.email;
            }
            else {
                throw new Error("Email not found for GitHub user.");
            }
        }
        // Step 4: Check if the email already exists in the database
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new Error("Email already registered.");
        }
        // Step 5: Create a new user
        const newUser = await createUser({
            name,
            email,
            provider: "github",
            providerId: githubUsername,
            profilePic,
            password: null, // Password is null since this is an OAuth signup
        });
        return newUser;
    }
    catch (error) {
        console.error("GitHub Signup Error:", error.message);
        throw new Error(error.message || "GitHub authentication failed.");
    }
};
// Handles GitHub login
export const githubLoginService = async (code) => {
    try {
        //Exchange code for access token
        const tokenResponse = await axios.post(`https://github.com/login/oauth/access_token`, {
            client_id: gitclientId,
            client_secret: gitclientSecret,
            code,
        }, {
            headers: {
                Accept: "application/json",
            },
        });
        const { access_token } = tokenResponse.data; // Extract the access token
        // Fetch user details from GitHub
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { email: initialEmail } = userResponse.data;
        let email = initialEmail;
        //Fetch emails explicitly if email is not provided in the user object
        if (!email) {
            const emailsResponse = await axios.get("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            // Find the primary email from the list of emails
            const primaryEmail = emailsResponse.data.find((e) => e.primary);
            if (primaryEmail) {
                email = primaryEmail.email;
            }
            else {
                throw new Error("Email not found for GitHub user.");
            }
        }
        // Check if the email exists in the database
        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            throw new Error("Email not registered.");
        }
        //Generate JWT tokens
        const accessToken = generateAccessToken({
            userId: existingUser._id,
            userRole: existingUser.role,
        });
        const refreshToken = generateRefreshToken({
            userId: existingUser._id,
            userRole: existingUser.role,
        });
        //Save the refresh token to the database
        await updateRefreshToken(existingUser._id.toString(), refreshToken);
        //Return the user data and tokens
        return { user: existingUser, accessToken, refreshToken };
    }
    catch (error) {
        console.error("GitHub Login Error:", error.message);
        throw new Error(error.message || "GitHub login failed.");
    }
};
//Handle forgot password
const otpStore = {}; // Temporary storage for OTPs
export const forgotPassword = async (email) => {
    const user = await findUserByEmail(email);
    if (!user)
        throw new Error("User not found.");
    const otp = generateOTP();
    otpStore[email] = otp; // Save OTP in memory
    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);
    // Return the OTP for testing (remove in production)
    return otp;
};
//Handle veify OTP logic
export const verifyOTP = async (email, otp) => {
    if (otpStore[email] !== otp)
        throw new Error("Invalid or expired OTP.");
    delete otpStore[email]; // OTP is used once
    return generateAccessToken({ email }, "10m"); // Temporary token for resetting password
};
//Handle reset password
export const resetPassword = async (email, newPassword) => {
    const user = await findUserByEmail(email);
    if (!user)
        throw new Error("User not found.");
    //Compare the old password with the new one
    const isSamePassword = await bcrypt.compare(newPassword, user.password || "");
    if (isSamePassword)
        throw new Error("New password cannot be the same as the old password.");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(user._id.toString(), hashedPassword);
};
//Handle logout
export const logout = async (useremail) => {
    try {
        // Call the removeRefreshToken function
        await removeRefreshToken(useremail);
    }
    catch (error) {
        throw new Error("Error during logout: " + error.message);
    }
};
//Check passcode for admin
export const verifyAdminPasskey = (passkey) => {
    if (passkey === config.adminpasscode) {
        return true;
    }
    else {
        throw new Error("Invalid admin passkey");
    }
};
// Check profile completion
export const checkProfileCompletion = async (userId) => {
    // Fetch user from the database
    const user = await findUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    // Check if the profile is complete using the repository logic
    return isProfileComplete(user);
};
//  profile Details
export const profileDetails = async (userId) => {
    // Fetch user from the database
    const user = await findUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
export const updateUserProfile = async (userId, data) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    // Upload images to Cloudinary if provided
    let profilePicUrl = user.profilePic;
    let coverPicUrl = user.coverPic;
    if (data.profilePicFile) {
        profilePicUrl = await uploadImage(data.profilePicFile.path, "profiles");
    }
    if (data.coverPicFile) {
        coverPicUrl = await uploadImage(data.coverPicFile.path, "covers");
    }
    // Update user data
    const updatedData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth),
        jobTitle: data.jobTitle,
        industry: data.industry,
        reasonForJoining: data.reasonForJoining,
        profilePic: profilePicUrl,
        coverPic: coverPicUrl,
    };
    const updatedUser = await updateUser(userId, updatedData);
    return updatedUser;
};
//# sourceMappingURL=auth.service.js.map