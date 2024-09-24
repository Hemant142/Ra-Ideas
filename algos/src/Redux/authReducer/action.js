import { USER_LOADING } from "../actionTypes";
import axios from "axios";
// let URL = "https://centrum-backend2.vercel.app";
// let URL="https://centrum.stoq.club/api/backend"
let URL =`https://zetamoney-mvp-backend.vercel.app`



export const userLogin = (data) => (dispatch) => {
console.log(data,"Login sent data")
  dispatch({ type: USER_LOADING });
  return axios.post(
    `${URL}/api/v1/genrateToken?username=${data.username}&password=${data.password}&role=${data.userType}`
  );


  // return axios.post(
  //   `${URL}/api/v1/genrateToken/`, null,{
   
  //     params: {
  //       username: data.username,
  //       password: data.password,
  //       role:data.userType
  //   }}
  // );
};



