"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostServiceImpl_1 = __importDefault(require("../../../src/client/service/PostServiceImpl"));
const Post_1 = require("../../../src/client/model/Post");
const PostDto_1 = __importDefault(require("../../../src/client/dto/PostDto"));
jest.mock('../../../src/client/model/Post');
describe('PostServiceImpl.findPostById', () => {
    let postService;
    beforeEach(() => {
        postService = new PostServiceImpl_1.default();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Passed test", () => __awaiter(void 0, void 0, void 0, function* () {
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
                    user: "TestUser",
                    message: "TestMessage",
                    dateCreated: new Date('2025-02-21'),
                    likes: 1
                },
            ],
        };
        Post_1.Post.findById.mockResolvedValue(fakePostDto);
        const result = yield postService.findPostById("1234");
        expect(Post_1.Post.findById).toHaveBeenCalledWith(id);
        expect(result).toBeInstanceOf(PostDto_1.default);
        expect(result.id).toEqual(fakePostDto.id);
        expect(result.title).toEqual(fakePostDto.title);
        expect(result.content).toEqual(fakePostDto.content);
        expect(result.author).toEqual(fakePostDto.author);
        expect(result.dateCreated).toEqual(fakePostDto.dateCreated);
        expect(result.tags).toEqual(fakePostDto.tags);
        expect(result.likes).toEqual(fakePostDto.likes);
        expect(result.author).toEqual(fakePostDto.author);
        expect(result.comments).toEqual(fakePostDto.comments);
    }));
    test("Failed test", () => __awaiter(void 0, void 0, void 0, function* () {
        Post_1.Post.findById.mockResolvedValue(null);
        yield expect(postService.findPostById("UNKNOWN")).rejects.toThrow("post is null");
    }));
});
