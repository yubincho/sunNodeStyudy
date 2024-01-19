const express = require("express")
const handlebars = require("express-handlebars")
const app = express()
const postService = require("./services/post-service")

const mongodbConnection = require("./configs/mongodb-connection")
const {ObjectId} = require("mongodb");
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

const projectionOption = {
    projection: {
        password: 0,
        "comments.password": 0,
    }
}


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
    res.render("write", { title: "테스트 게시판", mode: "create" })
})

app.get("/modify/:id", async (req, res) => {
    const post = await postService.getPostById(collection, req.params.id)
    console.log("[post]", post)
    res.render("write", { title: "테스트 게시판", mode: "modify", post })
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


app.post("/modify/", async (req, res) => {
    const { id, title, writer, password, content } = req.body

    const post = {
        title,
        writer,
        password,
        content,
        // createdDt: new Date().toISOString(),
    }

    const result = postService.updatePost(collection, id, post)
    res.redirect(`/detail/${id}`)
})


app.delete("/delete", async (req, res) => {
    const { id, password } = req.body
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id), password: password })
        if (result.deletedCount !== 1) {
            console.log("삭제 실패")
            return res.json({ isSuccess: false })
        }
        return res.json({ isSuccess: true })
    } catch (error) {
        console.error(error)
        return res.json({ isSuccess: false })
    }
})


// delete 구현을 controller 와 service 계층으로 분리
// 삭제 후 홈 화면으로 redirect 는 view(detail핸들바) 에서 설정.
app.delete("/delete/:id", async (req, res) => {
    const { id, password } = req.body
    const isSuccess  = postService.deleteOne(collection, id, password)

    return res.json({ isSuccess })
})


app.post("/write-comment", async (req, res) => {
    const { id, name, password, comment } = req.body
    Object.entries(req.body).forEach(([key, value]) => {
        // 여기에서 키와 값을 사용한 작업 수행
        if (!req.body[key]) {
            return res.status(400).send(`Error: ${key} is required.`);
        }
    });
    const post = await postService.getPostById(collection, id)

    if (post.comments) {
        post.comments.push({
            idx: post.comments.length + 1,
            name,
            password,
            comment,
            createdDt: new Date().toISOString(),
        })
    } else {
        post.comments = [
            {
                idx: 1,
                name,
                password,
                comment,
                createdDt: new Date().toISOString(),
            }
        ]
    }
    await postService.updatePost(collection, id, post)
    return res.redirect(`/detail/${id}`)
})


app.delete("/delete-comment", async (req, res) => {
    const { id, idx, password } = req.body

    const post = await collection.findOne({
        _id: new ObjectId(id),
        comments: { $elemMatch: {idx: parseInt(idx), password} },
    },
        postService.projectionOption,
    )

    if (!post) {
        return res.json({ isSuccess: false })
    }

    // post.comments = post.comments.filter((comment) => post.comments.splice(comment.idx === idx, 1))

    post.comments = post.comments.filter(comment => comment.idx !== parseInt(idx));
    // post.comments = post.comments.filter((comment) => indexToRemove !== idx) //

    // console.log("[indexToRemove]", indexToRemove)
    // if (indexToRemove !== -1) {
    //     post.comments.splice(indexToRemove, 1);
    // }

    console.log("[post.comments]", post.comments)

    await postService.updatePost(collection, id, post)
    return res.json({ isSuccess: true })

})


app.post("/check-password", async (req, res) =>  {
    const { id, password } = req.body
    const post = await postService.getPostByIdAndPassword(collection, { id, password })

    if (!post) {
        return res.status(404).json({ isExist: false })
    } else {
        return res.json({ isExist: true })
    }
})





app.listen(3000, async () => {
    console.log("Server started")
    const mongoClient = await mongodbConnection()
    collection = mongoClient.db().collection("post")
    console.log("MongoDB connected")
})