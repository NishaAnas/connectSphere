import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  defaultprofilepic:process.env.DEFAULT_PROFILE_PIC,
  defaultcoverpic:process.env.DEFAULT_COVER_PIC,
  node_env:process.env.NODE_ENV,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_key',
  emailService:process.env.EMAIL_SERVICE,
  emailUser:process.env.EMAIL_USER,
  emailPassword:process.env.EMAIL_PASS,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  googleclientid: process.env.GOOGLE_CLIENT_ID,
  googleclientsecret: process.env.GOOGLE_CLIENT_SECRET,
  googleredirecturi:process.env.GOOGLE_REDIRECT_URI,
  githubclientid: process.env.GITHUB_CLIENT_ID,
  githubclientsecret: process.env.GITHUB_CLIENT_SECRET,
  githubcallbackurl:process.env.GITHUB_CALLBACK_URL,
  baseurl: process.env.BASE_URL,
  sessionsecret: process.env.SESSION_SECRET,
  adminpasscode:process.env.PASSKEY_ADMIN
  
};

export default config;
