import {PostDto} from "./blog.model";
import { readFile, writeFile } from "fs/promises"

export interface BlogRepository {
    getAllPost(): Promise<PostDto[]>;
    createPost(postDto: PostDto);
    getPost(id: string): Promise<PostDto>;
    deletePost(id: string);
    updatePost(id: string, postDto: PostDto);
}

export class BlogFileRepository implements BlogRepository {
    FILE_NAME = './src/blog.data.json'

    async getAllPost(): Promise<PostDto[]> {
        const datas = await readFile(this.FILE_NAME, 'utf8')
        const posts = JSON.parse(datas)
        return posts
    }

    async createPost(postDto: PostDto) {
        const posts = await this.getAllPost()
        const id = posts.length + 1
        const createPost = { id: id.toString(), ...postDto, createdDt: new Date() }
        posts.push(createPost)
        await writeFile(this.FILE_NAME, JSON.stringify(posts))
    }

    async getPost(id: string) {
        const posts = await this.getAllPost()
        const result = posts.find((post) => post.id === id)
        return result
    }

    async deletePost(id: string) {
        const posts = await this.getAllPost()
        const filteredPosts = posts.filter((post) => post.id !== id)
        await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts))
    }

    async updatePost(id: string, postDto: PostDto) {
        const posts = await this.getAllPost()
        const index = posts.findIndex((post) => post.id === id)
        const updatePost = { id, ...postDto, updateDt: new Date() }
        posts[index] = updatePost
        await writeFile(this.FILE_NAME, JSON.stringify(posts))
    }


}

