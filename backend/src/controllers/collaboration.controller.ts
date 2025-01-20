import { Request, Response } from "express";
import { acceptRequest,  getMentorRequests,  getRequsetForUser,  processPaymentService,  rejectRequest, TemporaryRequestService } from "../services/collaboration.service.js";
import mentorRequset from "../models/mentorRequset.js";

export const TemporaryRequestController = async (req: Request, res: Response) => {
    try {
      const { mentorId, userId, selectedSlot, price } = req.body;
  
      if (!mentorId || !userId || !selectedSlot || !price) {
        res.status(400).json({ message: "All fields are required" });
        return ;
      }
  
      const requestData = { 
        mentorId, 
        userId, 
        selectedSlot,
        price 
    };
      const newRequest = await TemporaryRequestService(requestData);

      console.log(newRequest)
  
      res.status(201).json({
        message: "Request created successfully",
        request: newRequest,
      });
      return 
    } catch (error:any) {
      res.status(500).json({ message: error.message });
      return 
    }
  };

  // Get all mentor requests for the logged-in mentor
  export const getMentorRequestsController = async (req: Request, res: Response) => {
    const mentorId = req.query.mentorId as string;
    if (!mentorId) {
      res.status(400).json({ message: "Mentor ID is required." });
      return 
    }    
    try {
      const mentorRequests = await getMentorRequests(mentorId);
      res.status(200).json({ requests: mentorRequests });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Accept a mentor request
  export const acceptRequestController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await acceptRequest(id);
      res.status(200).json({ message: "Request accepted", request });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Reject a mentor request
  export const rejectRequestController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await rejectRequest(id);
      res.status(200).json({ message: "Request rejected", request });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

    // Get requset for user
    export const getRequsetForUserController = async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const userRequest = await getRequsetForUser(id);
        res.status(200).json({ message: "Request retrieved successfully", requests: userRequest });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    };

    //Make payemnt requset
    export const makeStripePaymentController = async(req: Request, res: Response) =>{
      const { token, amount, requestId } = req.body;

      try {
        // Retrieve the mentor request document
        const mentorRequestData = await mentorRequset.findById(requestId);

        if (!mentorRequestData) {
            res.status(404).json({ status: 'failure', message: 'Mentor request not found' });
            return 
        }

        // Process payment and handle collaboration creation
        const paymentResult = await processPaymentService(token, amount, requestId, mentorRequestData);

        res.status(200).json({ status: 'success', charge: paymentResult });
        return 
    } catch (error: any) {
        console.error('Payment error:', error.message);
        res.status(500).json({ status: 'failure', error: error.message });
        return 
    }
    }