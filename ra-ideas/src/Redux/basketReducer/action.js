import axios from "axios";
import { BASKET_REQUEST, GET_BASKET_SUCCESS } from "../actionTypes";

let URL = "https://centrum-backend2.vercel.app";

export const getSuccessAction=(payload)=>{
    return {type:GET_BASKET_SUCCESS,payload}
    }
export const fetchBasket = (token) => (dispatch) => {
  dispatch({ type: BASKET_REQUEST });


let response=JSON.parse(localStorage.getItem('create_Ideas'))||[]
  dispatch(getSuccessAction(response.reverse()));
  // return axios.get(`${URL}/get-list/baskets`, {
  //   headers: { "Access-Token": token },
    
  // });
};


export const postBasketData = (dataToSend, token) => async (dispatch) => {

  try {
    dispatch({ type: BASKET_REQUEST });
    const response = await axios.post(`${URL}/create-basket`, dataToSend, {
      headers: { "Access-Token": token },
    });
  
    // if(response.data=='success'){
    //   fetchBasket(token)
    // }
    return response.data; // Return the response data if needed elsewhere
  } catch (error) {
    console.error("Error creating basket:", error);
    return error
    // throw new Error(error); // Optionally re-throw the error for further handling
  }
};