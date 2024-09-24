import { GET_CLIENTS_SUCCESS, CLIENTS_FAILURE, CLIENTS_REQUEST, GET_ALGO_CLIENTS_SUCCESS } from "../actionTypes";

    const initalState = {
    clients: [],
    algoClients:[],
    isLoading: false,
    isError: false,
    error: "",
  };
  export const reducer = (state = initalState, action) => {
    switch (action.type) {
      case CLIENTS_REQUEST:
        return { ...state, isLoading: true };
      case CLIENTS_FAILURE:
        return {
          ...state,
          isLoading: false,
          isError: true,
          error: action.payload,
        };
      case GET_CLIENTS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          clients: action.payload,
          isError: false,
        };

        case GET_ALGO_CLIENTS_SUCCESS:
          return {
            ...state,
            isLoading: false,
            algoClients: action.payload,
            isError: false,
          };
  
      default:
        return state;
    }
  };
  