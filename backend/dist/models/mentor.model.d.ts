import mongoose, { Document } from "mongoose";
export interface IMentor extends Document {
    userId: string;
    isApproved?: boolean;
    skills?: string[];
    certifications?: string[];
    specialization?: string;
    availableSlots?: object[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMentor, {}, {}, {}, mongoose.Document<unknown, {}, IMentor> & IMentor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=mentor.model.d.ts.map