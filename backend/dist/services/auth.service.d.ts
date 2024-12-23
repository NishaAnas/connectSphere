export declare const sigupDetails: (data: {
    name: string;
    email: string;
    password: string;
}) => Promise<import("mongoose").Document<unknown, {}, import("../models/user.model.js").UserInterface> & import("../models/user.model.js").UserInterface & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const loginUser: (email: string, password: string) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("../models/user.model.js").UserInterface> & import("../models/user.model.js").UserInterface & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const refreshToken: (refreshToken: string) => Promise<{
    newAccessToken: string;
}>;
export declare const findOrCreateUserforPassport: (profile: any, provider: string) => Promise<import("../models/user.model.js").UserInterface>;
export declare const forgotPassword: (email: string) => Promise<string>;
export declare const verifyOTP: (email: string, otp: string) => Promise<string>;
export declare const resetPassword: (email: string, newPassword: string) => Promise<void>;
export declare const logout: (useremail: string) => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map