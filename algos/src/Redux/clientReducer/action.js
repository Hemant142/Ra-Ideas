import axios from 'axios';
import { CLIENTS_REQUEST, GET_CLIENTS_SUCCESS, CLIENTS_FAILURE, GET_ALGO_CLIENTS_SUCCESS } from '../actionTypes';

export const clientsRequest = () => ({
  type: CLIENTS_REQUEST,
});

export const getClientsSuccess = (payload) => ({
  type: GET_CLIENTS_SUCCESS,
  payload,
});


export const getAlgoClientsSuccess = (payload) => ({
  type: GET_ALGO_CLIENTS_SUCCESS,
  payload,
});
export const clientsFailure = (error) => ({
  type: CLIENTS_FAILURE,
  payload: error,
});

// let URL = "https://centrum-backend2.vercel.app";
// let URL="https://centrum.stoq.club/api/backend"
let URL ="https://zetamoney-mvp-backend.vercel.app"


// let dummy =[ {
//                 _id: "66d300e20872038eb32f1218",
//                 centrumClientId: "E0002445",
//                 name: "Hemant"
//             },
//             {
//               _id: "66d300e20872038eb32f1219",
//               centrumClientId: "E0002446",
//               name: "Rahul"
//           }
//           ]

export const fetchClients = (token) => (dispatch) => {
  dispatch(clientsRequest());

  axios.get(`${URL}/api/v1/get/clients/`, {
    headers: { "Access-Token": token },
  })
  .then((response) => {
  // console.log(response.data.data.clients,"Client REsponse")
  const fetchedData =response.data.data.clients
  // const cobinedData=[...fetchedData,...dummy]
    dispatch(getClientsSuccess(fetchedData));
  })
  .catch((error) => {
    console.error('Error fetching clients:', error);
    dispatch(clientsFailure(error.message));
  });
};

// export const postAddToBasket = (dataToSend, token) => async () => {
  
//   try {
//     const response = await axios.post(`${URL}/add-client`, dataToSend, {
//       headers: { "Access-Token": token },
//     });
 
//     // fetchBasketClientList(dataToSend.basketId,token)
//     // fetchClients(token)
//     return response.data;
//   } catch (error) {
//     console.error("Error in postAddToBasket:", error.message);
//     throw error; // Ensure the error is thrown so it can be caught in handleAddToBasket
//   }
// };


export const fetchAlgoClients = (id,token) => (dispatch) => {

  dispatch(clientsRequest());

  axios.get(`${URL}/api/v1/get/algorithms/clients/${id}`, {
    headers: { "Access-Token": token },
  })
  .then((response) => {
    let fetchedData
    console.log(response.data,"fetchAlgoClients")
    if(response.data.status=="error"){
      fetchedData=[]
    }
    fetchedData=response.data.data.algo_clients

    dispatch(getAlgoClientsSuccess(fetchedData));
  })
  .catch((error) => {
    console.error('Error fetching  algos clients:', error);
    dispatch(clientsFailure(error.message));
    dispatch(getAlgoClientsSuccess([]));
  });
};



export const postAddClient=(dataToSend, token) => async () => {
 
 
  try {
    
    const response = await axios.post(`${URL}/api/v1/post/clients/`, null,{
      headers: { "Access-Token": token },
      params: {
        client_name: dataToSend.clientName,
        centrum_user_id: dataToSend.clientId
    },
    });


  //   axios.post(`${URL}/api/v1/post/clients/`, null, {
  //     params: {
  //         client_name: dataToSend.clientName,
  //         centrum_user_id: dataToSend.clientId
  //     },
  //     headers: {
  //         'Access-Token': token
  //     }
  // })
  // .then(response => {
  //     console.log(response.data);
  // })
  // .catch(error => {
  //     console.error('There was an error!', error);
  // });
 
 
  
    return response.data;
  } catch (error) {
    console.error(error,"Error in postAddToBasket:");
    throw error; // Ensure the error is thrown so it can be caught in handleAddToBasket
  }
};



export const UpdateClientStatus=(dataToSend, token) => async () => {

  try {
    
    const response = await axios.post(`${URL}/api/v1/post/algorithms/clients/status?alog_client_id=${dataToSend.alog_client_id}&client_status=${dataToSend.client_status}`, null,{
      headers: { "Access-Token": token },
   
    });
// console.log(response,"response")


  
    return response.data;
  } catch (error) {
    console.error(error,"Error in postAddToBasket:");
    throw error; // Ensure the error is thrown so it can be caught in handleAddToBasket
  }
};


export const updateLotMultiplier=(dataToSend, token) => async () => {

  try {
    
    const response = await axios.post(`${URL}/api/v1/post/algorithms/clients/lot_multiplier?alog_client_id=${dataToSend.alog_client_id}&lot_multiplier=${dataToSend.lot_multiplier}`, null,{
      headers: { "Access-Token": token },
   
    });

  
    return response.data;
  } catch (error) {
    console.error(error,"Error in UpdateLotMultiplier:");
    throw error; // Ensure the error is thrown so it can be caught in handleAddToBasket
  }
};

export const addAlgoClient = (dataToSend, token) => async () => {
  try {
    const response = await axios.post(
      `${URL}/api/v1/post/algorithms/clients/`,
      null,
      {
        headers: { "Access-Token": token },
        params: {
          algo_id: dataToSend.algo_id,
          client_id: dataToSend.client_id,
          lot_multiplier: dataToSend.lot_multiplier,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding algo client:", error);
    throw error;
  }
};




export const fetchPositionClient = (id, token) => (dispatch) => {
  dispatch(clientsRequest());

  return axios
    .get(`${URL}/api/v1/get/algorithms/clients/position/${id}`, {
      headers: { "Access-Token": token },
    })
    .then((response) => {

      return response.data.data;
    })
    .catch((error) => {
      console.error("Error fetching client Position:", error);
      throw error; // Ensure error is thrown and can be caught in calling function
    });
};


export const fetchHistoryClient = (id, token) => async (dispatch) => {
  dispatch(clientsRequest());

  try {
    const response = await axios.get(`${URL}/api/v1/get/algorithms/clients/history/${id}`, {
      headers: { "Access-Token": token },
    });
    
    // Assuming the response has a structure similar to { data: { history: [...] } }
 
    return response.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching client history:', error);
    dispatch(clientsFailure(error.message));
    throw error; // Re-throw the error to be caught in the calling function
  }
};
