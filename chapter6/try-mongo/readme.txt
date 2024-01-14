
* try-mongo > test-crud.js
( npm i mongodb )
-> const client = new MongoClient(url, { useNewUrlParser: true })

* 이 부분에서 에러 났다.

(node:10252) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option:
useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
(Use `node --trace-warnings ...` to show where the warning was created)

그래서 { useNewUrlParser: true } 를 삭제함


* chatgpt 답변
: useNewUrlParser 뿐만 아니라 useUnifiedTopology와 같은 다른 옵션들에도 적용됩니다.
이 옵션들은 이제 기본적으로 활성화되어 있으며 별도로 명시할 필요가 없습니다.

만약 여전히 useNewUrlParser를 사용하고 있고 드라이버 버전을 업그레이드 했다면,
해당 옵션을 제거하기만 하면 됩니다. 이렇게 하면 드라이버가 최신 버전에서 권장하는 방식으로 자동으로 연결 문자열을 파싱하게 됩니다.