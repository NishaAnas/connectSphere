import express from 'express';
import passport from "passport";
import { signup, login, handleForgotPassword, handleVerifyOTP, handleResetPassword, logout, refreshToken, googleAuthRedirect, githubAuthRedirect, verifyPasskey, checkProfile, getprofileDetails, updateUserDetails, googleSignup, googleLogin, } from '../controllers/auth.controller.js';
import { verifyToken, checkBlockedStatus, verifyRefreshTokenMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { apiLimiter, authLimiter } from '../middlewares/ratelimit.middleware.js';
import { upload } from '../utils/multer.utils.js';
const router = express.Router();
// Public routes
router.post('/register/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/register/forgot-password', authLimiter, handleForgotPassword);
router.post('/register/verify-otp', authLimiter, handleVerifyOTP);
router.post('/register/reset-password', authLimiter, handleResetPassword);
router.post('/google-signup', authLimiter, googleSignup);
router.post('/google-login', authLimiter, googleLogin);
// Protected routes
router.post('/verify-admin-passkey', [authLimiter, verifyToken, authorize('admin')], verifyPasskey);
router.post('/refresh-token', [apiLimiter, verifyRefreshTokenMiddleware], refreshToken);
router.post('/logout', [apiLimiter, verifyToken], logout);
// Protected user routes
router.get('/check-profile/:id', [apiLimiter, verifyToken, checkBlockedStatus], checkProfile);
router.get('/profiledetails/:id', [apiLimiter, verifyToken, checkBlockedStatus], getprofileDetails);
router.put('/updateUserDetails/:Id', [
    apiLimiter,
    verifyToken,
    checkBlockedStatus,
    upload.fields([
        { name: "profilePic", maxCount: 1 },
        { name: "coverPic", maxCount: 1 },
    ])
], updateUserDetails);
;
// Google Authentication Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), googleAuthRedirect);
// GitHub Authentication Routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: "/login" }), githubAuthRedirect);
export default router;
//# sourceMappingURL=auth.routes.js.map