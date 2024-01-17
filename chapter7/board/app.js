const express = require("express")
const handlebars = require("express-handlebars")
const app = express()
const postService = require("./services/post-service")

const mongodbConnection = require("./configs/mongodb-connection")
let collection;

app.engine("handlebars",
    handlebars.create({
        helpers: require("./configs/handlebars-helpers")
    }).engine,
    )
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")


app.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1   // * 현재 페이지
    const search = req.query.search || ""  // 검색어
    try {
        const [posts, paginator] = await postService.list(collection, page, search)
        res.render("home", { title: " 테스트 게시판", search, paginator, posts })
    } catch (error) {
        console.error(error)
        res.render("home", { title: "안녕하세요" })  // 에러있으면 빈 값으로 전달
    }
    // res.render("home", { title: "안녕하세요" })
})

app.get("/write", async (req, res) => {
    res.render("write", { title: "테스트 게시판" })
})

app.get("/detail/:id", async (req, res) => {
    const result = await postService.getDetailPost(collection, req.params.id)
    // console.log("[result]", result)
    // console.log("[result.value]", result.value)
    res.render("detail", {title: "테스트 게시판", post: result,})
})

app.post("/write", async (req, res) => {
    const post = req.body
    const result = await postService.writePost(collection, post)
    res.redirect(`/detail/${result.insertedId}`)
})








app.listen(3000, async () => {
    console.log("Server started")
    const mongoClient = await mongodbConnection()
    collection = mongoClient.db().collection("post")
    console.log("MongoDB connected")
})