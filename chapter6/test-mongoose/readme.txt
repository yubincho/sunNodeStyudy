
몽구스 이용하기
1. 몽고디비 compass 설치 - 윈도우 버전으로 설치하였음
2. npm i mongoose

-----------------------------------------
* 아래 body-parser 때문에 에러났다.
const bodyparser = require("body-parser")
app.use(bodyparser.json())


(node:4004) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option:
useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version


* body-parser 대신 아래 코드로 해결됨
app.use (express.urlencoded ({extended : true}));
app.use (express.json ());


----------------------------------------------
* useNewUrlParser 때문에 아래 메시지가 노출됨. 에러는 안났지만 수정이 필요

(node:11940) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option:
useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version

mongoose.connect('your-mongodb-uri', { useNewUrlParser: true });를 아래 코드로 수정.
useNewUrlParser를 삭제하니 해결됨

수정된 코드 :mongoose.connect('your-mongodb-uri');

------------------------------------------------

* chapter6 -> Postman으로 publish하였음
* Postman 주소 : https://documenter.getpostman.com/view/11038161/2s9YsNeANN