import { GroupFormData } from "../repositories/group.repositry.js";
export declare const createGroupService: (groupData: GroupFormData) => Promise<import("mongoose").Document<unknown, {}, import("../models/group.model.js").GroupDocument> & import("../models/group.model.js").GroupDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const fetchGroupDetails: (adminId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/group.model.js").GroupDocument> & import("../models/group.model.js").GroupDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const fetchGroupDetailsService: (groupId: any) => Promise<(import("mongoose").Document<unknown, {}, import("../models/group.model.js").GroupDocument> & import("../models/group.model.js").GroupDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
export declare const fetchGroups: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/group.model.js").GroupDocument> & import("../models/group.model.js").GroupDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const requestToJoinGroup: (groupId: string, userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/groupRequest.model.js").GroupRequestDocument> & import("../models/groupRequest.model.js").GroupRequestDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const fetchGroupRequestsByGroupId: (groupId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/groupRequest.model.js").GroupRequestDocument> & import("../models/groupRequest.model.js").GroupRequestDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const fetchGroupRequestsByAdminId: (adminId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/groupRequest.model.js").GroupRequestDocument> & import("../models/groupRequest.model.js").GroupRequestDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const fetchGroupRequestsByuserId: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/groupRequest.model.js").GroupRequestDocument> & import("../models/groupRequest.model.js").GroupRequestDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
export declare const modifyGroupRequestStatus: (requestId: string, status: "Accepted" | "Rejected") => Promise<(import("mongoose").Document<unknown, {}, import("../models/groupRequest.model.js").GroupRequestDocument> & import("../models/groupRequest.model.js").GroupRequestDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | {
    message: string;
} | undefined>;
export declare const processGroupPaymentService: (token: any, amount: number, requestId: string, groupRequestData: any) => Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Charge>>;
export declare const removeMemberFromGroup: (groupId: string, userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/group.model.js").GroupDocument> & import("../models/group.model.js").GroupDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
export declare const deleteGroupByIdService: (groupId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/group.model.js").GroupDocument> & import("../models/group.model.js").GroupDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
export declare const updateGroupImageService: (groupId: string, profilePic?: string, coverPic?: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/group.model.js").GroupDocument> & import("../models/group.model.js").GroupDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
export declare const groupDetilsForMembers: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/group.model.js").GroupDocument> & import("../models/group.model.js").GroupDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
})[]>;
//# sourceMappingURL=group.service.d.ts.map