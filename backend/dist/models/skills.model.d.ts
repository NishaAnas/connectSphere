import mongoose, { Document, Model } from "mongoose";
export interface SkillInterface extends Document {
    name: string;
    categoryId: mongoose.Types.ObjectId;
    subcategoryId: mongoose.Types.ObjectId;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Skill: Model<SkillInterface>;
//# sourceMappingURL=skills.model.d.ts.map