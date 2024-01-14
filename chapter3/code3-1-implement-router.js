const http = require("http")

const code31ImplementRouter = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.end("OK")
})

code31ImplementRouter.listen("3000", () => console.log("OK 서버 시작"))