import React, { useEffect } from "react";
import { auth } from "../_actions/user_action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
/*  eslint-disable import/no-anonymous-default-export*/

export default function (SpecificComponent, option, adminRoute = null) {
  //option
  //null -> 아무나 출입이 가능한 페이지
  //true -> 로그인한 유저만 출입이 가능한 페이지
  //false -> 로그인한 유저는 출입 불가능한 페이지

  function AuthenticationCheck(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
        //로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            //true인 페이지에 들어가려고 하면 못가게 막는다
            navigate("/login");
          }
        } else {
          //로그인 한 상태
          if (adminRoute && !response.payload.isAdmin) {
            //관리자가 아닌데 관리자 페이지로 들어가려고 할때
            navigate("/");
          } else {
            if (option === false)
              //로그인한 유저가 들어가려고 할때
              navigate("/");
          }
        }
      });
    }, []);
    return <SpecificComponent />;
  }
  return <AuthenticationCheck />;
}
