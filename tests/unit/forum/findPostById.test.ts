import PostServiceImpl from "../../../src/client/service/PostServiceImpl";
import {Post as P} from "../../../src/client/model/Post";
import PostDto from "../../../src/client/dto/PostDto";


jest.mock('../../../src/client/model/Post');


describe('PostServiceImpl.findPostById', () => {
    let postService: PostServiceImpl;

    beforeEach(()=> {
        postService = new PostServiceImpl();
    })

    afterEach(()=> {
        jest.clearAllMocks();
    })


    it("Passed test", async() =>{
        const id = "1234";
        const fakePostDto = {
            id: "1235",
            title: "Test Title",
            content: "Test Content",
            author: "Test Author",
            dateCreated: new Date('2025-02-21'),
            tags: ['node', 'jest'],
            likes: 10,
            comments: [
                {
                    user:"TestUser",
                    message:"TestMessage",
                    dateCreated:new Date('2025-02-21'),
                    likes:1
                },
            ],

        };

        (P.findById as jest.Mock).mockResolvedValue(fakePostDto);

        const result = await postService.findPostById("1234");

        expect(P.findById).toHaveBeenCalledWith(id);

        expect(result).toBeInstanceOf(PostDto);
        expect(result.id).toEqual(fakePostDto.id);
        expect(result.title).toEqual(fakePostDto.title);
        expect(result.content).toEqual(fakePostDto.content);
        expect(result.author).toEqual(fakePostDto.author);
        expect(result.dateCreated).toEqual(fakePostDto.dateCreated);
        expect(result.tags).toEqual(fakePostDto.tags);
        expect(result.likes).toEqual(fakePostDto.likes);
        expect(result.author).toEqual(fakePostDto.author);
        expect(result.comments).toEqual(fakePostDto.comments);
    })




    test("Failed test", async() =>{


        (P.findById as jest.Mock).mockResolvedValue(null);

        await expect(postService.findPostById("UNKNOWN")).rejects.toThrow("post is null");
    })

});


