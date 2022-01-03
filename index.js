const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User");

//분석한 데이터 가지고 오기
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
