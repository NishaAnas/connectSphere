import mongoose, { Document, Model } from "mongoose";
export interface UserInterface extends Document {
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    password: string | null;
    jobTitle?: string;
    industry?: string;
    reasonForJoining?: string;
    role?: "user" | "mentor" | "admin";
    isBlocked: boolean;
    provider?: string;
    providerId?: string | null;
    profilePic?: string;
    coverPic?: string;
    accessToken?: string;
    refreshToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
    _id: mongoose.Types.ObjectId;
}
declare const User: Model<UserInterface>;
export default User;
//# sourceMappingURL=user.model.d.ts.map