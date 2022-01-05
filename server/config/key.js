if (process.env.NODE_ENV === "production") {
  //local환경이라면, prod파일을 Deploy한 후라면 dev파일을 가져옴
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
