// 모듈
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sessionParser = require("express-session");
var bodyParser = require("body-parser");
var MySQLStore = require("express-mysql-session")(sessionParser);

// html 라우터 
const indexRouter = require("./routes/index");
const companyRouter = require("./routes/company");
const pastTableRouter = require("./routes/pastTable");

// DB 라우터
const articleRouter = require("./routes/api/article");

const app = express();

// view engin setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 미들웨어
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/public/images", express.static("images"));
app.use("/public/fonts", express.static("fonts"));
app.use("/public/javascripts", express.static("javascripts"));

app.use(express.urlencoded({ extended: false }));

// 세션 관리를 위한 미들웨어 설정
/*app.use(
  sessionParser({
    key: "login", // 세션 쿠키 이름
    secret: "loginID", // 세션 데이터 암호화를 위한 키
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000, // 세션 쿠키 유효 기간 (1일)
    },
    store: new MySQLStore({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      path: "./sessions", // 세션 파일을 저장할 경로
    }),
  })
);*/


//
app.use("/", indexRouter);
app.use("/company", companyRouter);
app.use("/pastTable", pastTableRouter);

// DB
app.use("/api/article", articleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send("something wrong!");
  });

  module.exports = app;