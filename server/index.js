const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//분석한 데이터 가지고 오기
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
const { Router } = require("express");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", (req, res) => {
  res.send("Hello World!~"); //화면에 보이게끔
});

app.post("/api/users/register", (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 데이스에 넣어준다.

  const user = new User(req.body); //model유저들 사용
  //body.parser을 이용해서 client정보를 받아준다

  user.save((err, userInfo) => {
    //정보들이 user 모델에 저장
    if (err) return res.json({ success: false, err }); //json형식으로 성공안됬다고 말해줌(err메세지와 함께)
    return res.status(200).json({
      //성공하면 sucess:true 출력
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginsucess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다",
      });
    }
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginsucess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다 어디에? 쿠키, 로컬스토리지
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginsucess: true, userId: user._id });
      });
    });
  });
});

// role 1 어드민 role 2 특정 부서 어드민 따라서 달라질 수 있음
// role 0 -> 일반유저 role 0이 아니면 관리자

app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미드웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "" }, //토큰 지워줌
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
