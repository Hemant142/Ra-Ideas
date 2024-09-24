
import {
  BASKET_FAILURE,
  BASKET_REQUEST,
  GET_BASKET_SUCCESS,
} from "../actionTypes";

const data = [
  {
      id: 1,
      name: "Strategy A eskj nckjdnkj dfjvb jbejhbdkjhb",
      strategy1: "Breakout",
      strategy2: "Option Buy",
      strategy3: "Intraday",
      description: "Breakout strategy focused on intraday option buying.",
      fundRequired: 100000,
      clientNumber: 101,
      isActive: true
  },
  {
      id: 2,
      name: "Strategy B",
      strategy1: "Breakout",
      strategy2: "Option Sell",
      strategy3: "BTST",
      description: "Breakout strategy with option selling and BTST positions.",
      fundRequired: 200000,
      clientNumber: 102,
      isActive: true
  },
  {
      id: 3,
      name: "Strategy C",
      strategy1: "Breakout",
      strategy2: "Option Buy",
      strategy3: "Positional",
      description: "Breakout strategy with positional option buying.",
      fundRequired: 150000,
      clientNumber: 103,
      isActive: true
  },
  {
      id: 4,
      name: "Strategy D",
      strategy1: "Breakout",
      strategy2: "Option Sell",
      strategy3: "Intraday",
      description: "Intraday option selling strategy based on breakout.",
      fundRequired: 120000,
      clientNumber: 104,
      isActive: true
  },
  {
      id: 5,
      name: "Strategy E",
      strategy1: "Breakout",
      strategy2: "Option Buy",
      strategy3: "BTST",
      description: "BTST strategy focusing on option buying during breakout.",
      fundRequired: 180000,
      clientNumber: 105,
      isActive: true
  },
  {
      id: 6,
      name: "Strategy F",
      strategy1: "Breakout",
      strategy2: "Option Sell",
      strategy3: "Positional",
      description: "Positional strategy with option selling on breakout.",
      fundRequired: 220000,
      clientNumber: 106,
      isActive: true
  },
  {
      id: 7,
      name: "Strategy G",
      strategy1: "Breakout",
      strategy2: "Option Buy",
      strategy3: "Intraday",
      description: "Intraday breakout strategy with option buying.",
      fundRequired: 130000,
      clientNumber: 107,
      isActive: true
  },
  {
      id: 8,
      name: "Strategy H",
      strategy1: "Breakout",
      strategy2: "Option Sell",
      strategy3: "BTST",
      description: "BTST option selling strategy based on breakout.",
      fundRequired: 210000,
      clientNumber: 108,
      isActive: true
  },
  {
      id: 9,
      name: "Strategy I",
      strategy1: "Breakout",
      strategy2: "Option Buy",
      strategy3: "Positional",
      description: "Positional breakout strategy focusing on option buying.",
      fundRequired: 140000,
      clientNumber: 109,
      isActive: true
  },
  {
      id: 10,
      name: "Strategy J",
      strategy1: "Breakout",
      strategy2: "Option Sell",
      strategy3: "Intraday",
      description: "Intraday breakout strategy with option selling.",
      fundRequired: 160000,
      clientNumber: 110,
      isActive: true
  }
];

const initalState = {
  baskets: [],
  isLoading: false,
  isError: false,
  error: "",
};
export const reducer = (state = initalState, action) => {
  switch (action.type) {
    case BASKET_REQUEST:
      return { ...state, isLoading: true };
    case BASKET_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    case GET_BASKET_SUCCESS:
      return {
        ...state,
        isLoading: false,
        baskets: action.payload,
        isError: false,
      };

    default:
      return state;
  }
};
