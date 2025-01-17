import { axiosInstance } from "../lib/axios";
import { handleError } from "./ErrorHandler";


export const SendRequsetToMentor = async (data) => {
    try {
      const response = await axiosInstance.post("/collaboration/create-mentorprofile", data);
      return response.data;
    } catch (error) {
     handleError(error)
    }
  };


  //Get all Requset for the mentor
  export const getAllRequest = async (mentorId) => {
    try {
      const response = await axiosInstance.get(`/collaboration/get-mentor-requests?mentorId=${mentorId}`);
      return response.data;
    } catch (error) {
     handleError(error)
    }
  };

  //Accept the selected mentor request
  export const acceptTheRequest = async (requsetId) => {
    try {
      const response = await axiosInstance.post(`/collaboration/accept-request/${requsetId}`);
      return response.data;
    } catch (error) {
     handleError(error)
    }
  };

  //Reject the selected mentor request
  export const rejectTheRequest = async (requsetId) => {
    try {
      const response = await axiosInstance.post(`/collaboration/reject-request/${requsetId}`);
      return response.data;
    } catch (error) {
     handleError(error)
    }
  };
  

   //get the requset for user
   export const getTheRequestByUser = async (userId) => {
    try {
      const response = await axiosInstance.get(`/collaboration/get-user-requests/${userId}`);
      return response.data;
    } catch (error) {
     handleError(error)
    }
  };

  //Make payment for the mentor
  export const processStripePayment = async (paymentDetails: any) => {
    try {
      const response = await axiosInstance.post(`/collaboration/process-payment`,paymentDetails);
      return response.data;
    } catch (error) {
     handleError(error)
    }
  }