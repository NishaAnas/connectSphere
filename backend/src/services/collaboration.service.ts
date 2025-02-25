import { sendEmail } from "../utils/email.utils.js";
import {
  createCollaboration,
  createTemporaryRequest,
  deleteMentorRequest,
  findCollabById,
  getCollabDataForMentor,
  getCollabDataForUser,
  getMentorRequestsByMentorId,
  getRequestByUserId,
  markCollabAsCancelled,
  updateMentorRequestStatus,
} from "../repositories/collaboration.repositry.js";
import stripe from "../utils/stripe.utils.js";
import { v4 as uuid } from "uuid";

export const TemporaryRequestService = async (requestData: any) => {
  try {
    const newRequest = await createTemporaryRequest({
      ...requestData,
      paymentStatus: "Pending",
      isAccepted: "Pending",
    });
    return newRequest;
  } catch (error: any) {
    throw new Error(`Error creating temporary request: ${error.message}`);
  }
};

// Fetch all requests for a mentor
export const getMentorRequests = async (mentorId: string) => {
  try {
    const request = await getMentorRequestsByMentorId(mentorId);
    return request;
  } catch (error: any) {
    throw new Error(`Error fetching mentor requests: ${error.message}`);
  }
};

// Accept a mentor request
export const acceptRequest = async (requestId: string) => {
  try {
    return await updateMentorRequestStatus(requestId, "Accepted");
  } catch (error: any) {
    throw new Error(`Error accepting mentor request: ${error.message}`);
  }
};

// Reject a mentor request
export const rejectRequest = async (requestId: string) => {
  try {
    return await updateMentorRequestStatus(requestId, "Rejected");
  } catch (error: any) {
    throw new Error(`Error rejecting mentor request: ${error.message}`);
  }
};

// get requset for the user
export const getRequsetForUser = async (userId: string) => {
  try {
    return await getRequestByUserId(userId);
  } catch (error: any) {
    throw new Error(`Error in retrieving request: ${error.message}`);
  }
};

//make payemnt using stripe
export const processPaymentService = async (
  token: any,
  amount: number,
  requestId: string,
  mentorRequestData: any
) => {
  const idempotencyKey = uuid();

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const charge = await stripe.charges.create(
      {
        amount,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
        description: `Payment for Request ID: ${requestId}`,
      },
      { idempotencyKey }
    );

    if (charge.status === "succeeded") {
      // Calculate dates
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 30); // Add 30 days

      // Create a collaboration document
      await createCollaboration({
        mentorId: mentorRequestData.mentorId,
        userId: mentorRequestData.userId,
        selectedSlot: mentorRequestData.selectedSlot,
        price: amount / 100,
        payment: true,
        isCancelled: false,
        startDate,
        endDate,
      });

      // Delete the mentor request document
      await deleteMentorRequest(requestId);
    }

    return charge;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

//Get collab data for user
export const getCollabDataForUserService = async (userId: string) => {
  try {
    const collabData = await getCollabDataForUser(userId);
    return collabData;
  } catch (error: any) {
    throw new Error(
      `Error getting collaboration data for user: ${error.message}`
    );
  }
};

//get collab data for mentor
export const getCollabDataForMentorService = async (mentorId: string) => {
  try {
    const collabData = await getCollabDataForMentor(mentorId);
    return collabData;
  } catch (error: any) {
    throw new Error(
      `Error getting collaboration data for mentor: ${error.message}`
    );
  }
};

//Delete collab
export const removecollab = async (collabId: string, reason: string) => {
  // Check if the group exists
  const collab = await findCollabById(collabId);
  if (!collab) {
    throw new Error("Collab not found");
  }

  // Ensure mentorId is an object, not a string
  if (typeof collab.mentorId === "string") {
    throw new Error("Mentor details are not populated properly.");
  }

  // Ensure userId in mentor is an object
  if (typeof collab.mentorId.userId === "string") {
    throw new Error("Mentor's user details are not populated properly.");
  }

  // Ensure userId is an object, not a string
  if (typeof collab.userId === "string") {
    throw new Error("User details are not populated properly.");
  }

  // Extract mentor details
  const mentorEmail = collab.mentorId?.userId?.email;
  const mentorName = collab.mentorId?.userId?.name;
  const userName = collab.userId?.name;

  if (!mentorEmail) {
    throw new Error("Mentor email not found");
  }

  // Send cancellation email
  const subject = "Mentorship Session Cancellation Notice";
  const text = `Dear ${mentorName},

  We regret to inform you that your mentorship session with ${userName} has been cancelled.
  Reason: ${reason}

  If you have any questions, please contact support.

  Best regards,
  ConnectSphere Team`;

  await sendEmail(mentorEmail, subject, text);

  console.log(`Cancellation email sent to mentor: ${mentorEmail}`);

  return await markCollabAsCancelled(collabId);
};
