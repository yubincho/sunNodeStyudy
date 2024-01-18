
const { getPostById  } = require("../services/post-service")
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');


// MongoDB 메소드를 모의합니다.
jest.mock('mongodb', () => {
    const ObjectId = jest.fn().mockImplementation(id => id);
    return {
        MongoClient: {
            connect: jest.fn().mockImplementation(() => ({
                db: jest.fn().mockImplementation(() => ({
                    collection: jest.fn().mockImplementation(() => ({
                        // 여기에 컬렉션의 메소드를 모의 구현합니다.
                        // find: jest.fn().mockReturnValue({
                        //     toArray: jest.fn().mockResolvedValue([...]) // 예상되는 반환값
                        // }),
                        findOne: jest.fn().mockResolvedValue({
                            id: "65a3d2820391157561a008ed",
                            // title: "게시판",
                            writer: "andy2",
                            // password: 1234,
                            // content: "this is contents.",
                            // createdDt: "2024-01-18 00:00:00",
                        }),
                        // insertOne: jest.fn().mockResolvedValue({...}), // insertOne에 대한 예상되는 반환값
                        // updateOne: jest.fn().mockResolvedValue({...}), // updateOne에 대한 예상되는 반환값
                        // deleteOne: jest.fn().mockResolvedValue({...}), // deleteOne에 대한 예상되는 반환값
                        // 기타 필요한 메소드들을 여기에 추가합니다.
                    })),
                })),
            })),
        },
        ObjectId,
    };
});

const projectionOption = {
    projection: {
        password: 0,
        "comments.password": 0,
    }
}

test('1개 게시물 가져오기, collection으로 확인', async () => {
    const db = await MongoClient.connect().db();
    const collection = db.collection('collection');

    const result = await collection.findOne({ id: "65a3d2820391157561a008ed"})
    expect(result).toEqual({writer: "andy2", id: "65a3d2820391157561a008ed"})
})

test('1개 게시물 가져오기 , service 코드 확인', async () => {
    const mockCollection = {
        findOne: jest.fn().mockResolvedValue({ _id: "65a3d2820391157561a008ed", /* 기타 필드 */ }),
    };

    const result = await getPostById(mockCollection, "65a3d2820391157561a008ed", projectionOption);
    // expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: "65a3d2820391157561a008ed" });
    expect(result).toEqual({ _id: "65a3d2820391157561a008ed", /* 기타 필드 */ });

})
