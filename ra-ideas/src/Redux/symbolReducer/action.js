import axios from 'axios';
import { GET_FUTURE_SUCCESS, GET_OPTIONS_SUCCESS, GET_SYMBOLS_SUCCESS, SYMBOLS_REQUEST } from '../actionTypes';


export const symbolsRequest = () => ({
  type: SYMBOLS_REQUEST,
});


export const getSymbolsSuccess = (payload) => ({
  type: GET_SYMBOLS_SUCCESS,
  payload,
});

export const getOptionsSuccess = (payload) => ({
  type: GET_OPTIONS_SUCCESS,
  payload,
});

export const getFutureSuccess = (payload) => ({
  type: GET_FUTURE_SUCCESS,
  payload,
});

let url="https://centrum-backend2.vercel.app/symbols/NSE"

export const fetchSymbols = () => (dispatch) => {
  dispatch(symbolsRequest());

  // Specific symbols to exclude
  const excludeSymbols = [
    "2.50% GOLDBONDS2024 TR-VI",
    "2.50%GOLDBONDS 2025 SR-X",
    "2.50%GOLDBONDS 2025 SR-XI",
    "2.50%GOLDBONDS 2025SR-IX",
    "2.50%GOLDBONDS 2025TR-VII",
    "2.50%GOLDBONDS2025 SR-XII",
    "2.75% GOLDBONDS2024TR-V",
    'GOI LOAN   7.25% 2028',
  'GOI LOAN   7.37% 2054',
  'GOI LOAN  5.15% 2025',
  'GOI LOAN  5.63% 2026',
  'GOI LOAN  5.74% 2026',
  'GOI LOAN  5.85% 2030',
  'GOI LOAN  6.10% 2031',
  'GOI LOAN  6.22% 2035',
  'GOI LOAN  6.54% 2032',
  'GOI LOAN  6.64% 2035',
  'GOI LOAN  6.67% 2035',
  'GOI LOAN  6.67% 2050',
  'GOI LOAN  6.76% 2061',
  'GOI LOAN  6.8% 2060',
  'GOI LOAN  6.89% 2025',
  'GOI LOAN  6.95% 2061',
  'GOI LOAN  6.99% 2026',
  'GOI LOAN  6.99% 2051',
  'GOI LOAN  7.02% 2027',
  'GOI LOAN  7.02% 2031',
  'GOI LOAN  7.04% 2029',
  'GOI LOAN  7.06% 2028',
  'GOI LOAN  7.1% 2034',
  'GOI LOAN  7.10% 2028',
  'GOI LOAN  7.17% 2030',
  'GOI LOAN  7.18% 2033',
  'GOI LOAN  7.18% 2037',
  'GOI LOAN  7.23% 2039',
  'GOI LOAN  7.25% 2063',
  'GOI LOAN  7.26% 2032',
  'GOI LOAN  7.26% 2033',
  'GOI LOAN  7.29% 2033',
  'GOI LOAN  7.3% 2053',
  'GOI LOAN  7.32% 2030',
  'GOI LOAN  7.33% 2026',
  'GOI LOAN  7.34% 2064',
  'GOI LOAN  7.36% 2052',
  'GOI LOAN  7.37% 2028',
  'GOI LOAN  7.4% 2062',
  'GOI LOAN  7.41% 2036',
  'GOI LOAN  7.46% 2073',
  'GOI LOAN  7.54% 2036',
  'GOI LOAN 8.24%2027',
  'GOI LOAN 8.28%2032',
  "SGB2.50%MAY2025SR-I 17-18",
  "SGB2.50%JUL2025SR-II17-18",
  ];

  // Regex patterns to exclude
  const excludeGoiPattern = /GOI(?: LOAN)?\s\d+(\.\d+)?%\s\d{4}/i;
  const excludeGoldBondsPattern =
    /2\.5(?:0|%|0%)? ?%? ?GOLDBONDS20(?:24|25|26|27|28|29|30|31|32)(?: ?SR| ?TR|-SR|-TR)?(?:-?I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)?/i;

  axios
    .get(url)
    .then((response) => {
      const filteredSortedData = response.data.response
        .filter(
          (item) =>
            !excludeGoiPattern.test(item.name) &&
            !excludeGoldBondsPattern.test(item.name) &&
            !excludeSymbols.includes(item.name)
        )
        .sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0; // names must be equal
        });

    
      dispatch(getSymbolsSuccess(filteredSortedData));
    })
    .catch((error) => {
      console.error("Error fetching symbols:", error);
    });
};
let NewURL="https://odinscripmaster.s3.ap-south-1.amazonaws.com/scripfiles/NSE_FO.json?ser=EQ"
export const fetchOptionFuture = () => (dispatch) => {
  dispatch(symbolsRequest()); 

  const excludedSymbols = [
    "MIDCPNIFTY","NIFTY","BANKNIFTY","FINNIFTY"
  ];

  axios
  .get(NewURL)
  .then((response) => {
    const today = new Date();
    const nextSevenDays = new Date(today);
    nextSevenDays.setDate(today.getDate() + 7);
    const filterFutureData = response.data.filter((ele) => ele.inst === "FUTIDX");
 

    const filterOptions = response.data.filter((ele) => {
      const expDate = new Date(ele.exp);
      return ele.inst === "OPTIDX" && excludedSymbols.includes(ele.sym) && expDate <= nextSevenDays;
    });
    console.log(filterOptions,"filterOptions")
 dispatch(getOptionsSuccess(filterOptions))
    dispatch(getFutureSuccess(filterFutureData));
  })
  .catch((error) => {
    console.error('Error fetching symbols:', error);
  });
};