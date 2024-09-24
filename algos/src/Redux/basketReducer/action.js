import axios from "axios";
import { BASKET_REQUEST, GET_BASKET_SUCCESS } from "../actionTypes";

// let URL = "https://centrum-backend2.vercel.app";
// let URL="https://centrum.stoq.club/api/backend"
let URL ="https://zetamoney-mvp-backend.vercel.app"


export const getSuccessAction = (payload) => {
  return { type: GET_BASKET_SUCCESS, payload };
};

export const fetchBasket = (token) => (dispatch) => {
  dispatch({ type: BASKET_REQUEST });
  return axios.get(`${URL}/api/v1/get/algorithms/`, {
    headers: { "Access-Token": token },
  });
};


export const fetchClientData = (basketIds, token) => async (dispatch) => {
  try {
    // Ensure basketIds is an array. If it's a single value, wrap it in an array.
    const basketIdArray = Array.isArray(basketIds) ? basketIds : [basketIds];

    // Create an array of axios GET requests for each basketId
    const requests = basketIdArray.map((id) =>
      axios.get(`${URL}/api/v1/get/algorithms/clients/${id}`, {
        headers: { "Access-Token": token },
      })
    );

    // Fetch all responses concurrently
    const responses = await Promise.all(requests);
 

    // Map responses to extract the data from each
    if(responses[0].data.status=="success"){
      const clientsData = responses.map((response) => response.data.data.algo_clients)
          return clientsData
    }else{
      const clientsData = responses.map((response) => response.data);
    
      
          return clientsData;
    }

   
  } catch (error) {
    console.error('Error fetching algo clients:', error);
    return [];
  }
};


export const fetchAlgoBasket = (token) => (dispatch) => {
  dispatch({ type: BASKET_REQUEST });
  return axios.get(`${URL}/api/v1/get/algorithms/`, {
    headers: { "Access-Token": token },
  });
};

export const postBasketData = (dataToSend, token) => async (dispatch) => {
  
  try {
    dispatch({ type: BASKET_REQUEST });
    const response = await axios.post(`${URL}/create-basket`, dataToSend, {
      headers: { "Access-Token": token },
    });

    return response.data; // Return the response data if needed elsewhere
  } catch (error) {
    console.error("Error creating basket:", error);
    throw new Error(error); // Optionally re-throw the error for further handling
  }
};

export const fetchSingleBasketData=(id,token)=>async(dispatch)=>{
  try {
    const response = await axios.post(
      `${URL}/get-one/baskets?basket_id=${id}`,
      {},
      {
        headers: { "Access-Token": token },
      }
    );

    return response.data.response.data[0]
  } catch (error) {
    console.error(error.message, "error");
  }
}





export const updateAlgorithmStatus=(dataToSend, token) => async () => {

  try {
    
    const response = await axios.post(`${URL}/api/v1/post/algorithms/isActiveStatus/`, null,{
      headers: { "Access-Token": token },
      params: {
        isActiveStatus:dataToSend.isActiveStatus,
        alog_id:dataToSend.alog_id
      }
   
    });
// console.log(response,"updateAlgorithmStatus")


  
    return response;
  } catch (error) {
    console.error(error,"Error in postAddToBasket:");
    throw error; // Ensure the error is thrown so it can be caught in handleAddToBasket
  }
};