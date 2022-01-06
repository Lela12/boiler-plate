import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../_actions/types";
/*  eslint-disable import/no-anonymous-default-export*/

//다른 타입이 올때 마다 다른 조치를 취할 곳

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginsucess: action.payload };

    case REGISTER_USER:
      return { ...state, register: action.payload };

    case AUTH_USER:
      return { ...state, userData: action.payload }; //모든 유저 데이터가 들어있음

    default:
      return state;
  }
}
