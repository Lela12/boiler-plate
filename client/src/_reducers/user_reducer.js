import { LOGIN_USER, REGISTER_USER } from "../_actions/types";
/*  eslint-disable import/no-anonymous-default-export*/

//다른 타입이 올때 마다 다른 조치를 취할 곳

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginsucess: action.payload };

    case REGISTER_USER:
      return { ...state, register: action.payload };

    default:
      return state;
  }
}
