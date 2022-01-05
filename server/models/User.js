const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    //토큰 유효기간
    type: Number,
  },
});
//user모델에 user정보를 저장하기 전에
userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    //필드중에 패스워드가 변환될때만 비밀번호 암호화 해준다
    //saltRounds salt가 몇 글자인지
    //비밀번호를 암호화 시킨다.(salt생성해서 이용)
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); //에러가 나면 index.js err로 가고

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash; //해쉬된 비밀번호로 바꿔줌
        next(); //완성되면 다시 돌아감
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567   암호화된 비밀번호 $2b$10$lsb6OWuLAkQeJp1SnSGCvuYlsGMOocxPxf0thLpcOaNtT3zgu8m5e
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch); //같은 경우
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  //   user._id + 'secretToken' = token
  //   ->
  //   'secretToken' -> user._id

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // user._id + '' = token
  //토큰을 decode 한다
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema); //모델 안에 스키마 넣어줌

module.exports = { User }; //다른 곳에서도 사용할 수 있도록
