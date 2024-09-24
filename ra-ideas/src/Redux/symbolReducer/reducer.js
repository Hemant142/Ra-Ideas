import { GET_FUTURE_SUCCESS, GET_OPTIONS_SUCCESS, GET_SYMBOLS_SUCCESS, SYMBOLS_FAILURE, SYMBOLS_REQUEST } from "../actionTypes";

    const initalState = {
    symbols: [],
    options:[],
    future:[],
    isLoading: false,
    isError: false,
    error: "",
  };
  export const reducer = (state = initalState, action) => {
    switch (action.type) {
      case SYMBOLS_REQUEST:
        return { ...state, isLoading: true };
      case SYMBOLS_FAILURE:
        return {
          ...state,
          isLoading: false,
          isError: true,
          error: action.payload,
        };
      case GET_SYMBOLS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          symbols: action.payload,
          isError: false,
        };

        case GET_OPTIONS_SUCCESS:
          return {
            ...state,
            isLoading: false,
            options: action.payload,
            isError: false,
          };
  
          case GET_FUTURE_SUCCESS:
            return {
              ...state,
              isLoading: false,
              future: action.payload,
              isError: false,
            };
    
      default:
        return state;
    }
  };
  