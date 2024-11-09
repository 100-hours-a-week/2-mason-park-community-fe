import {appendChildElement, insertBeforeElement} from "../utils/function.js";
import Header from "../components/header/header.js";
import PostItem from "../components/post/postItem.js"
import {strings} from "../utils/constants.js";
import {getPostsRequest} from "../api/post.js";

document.addEventListener('DOMContentLoaded', () => {
    const postWriteBtn = document.getElementById('post-write-btn');

    const setPosts = async (offset=0, limit=5) => {
        const response = await getPostsRequest(offset, limit);

        if(!response.ok) {
            throw new Error('failed to get posts');
        }

        const posts = await response.json();
        // console.log(posts.data);
        // TODO : 가져올 데이터가 없는 경우 처리
        const container = document.querySelector('.container-column');
        posts.data.forEach(post => {
            appendChildElement(PostItem(
                post
            ), container);
        })
    }

    const setEventListener = () => {
        // 게시글 작성 버튼
        postWriteBtn.addEventListener('click', () => {
            window.location.href = 'posts/write';
        })

        let offset = 0;
        let limit = 5;

        const infinityScrollEventHandler = (e) => {

            // 페이지의 맨 아래로 스크롤 했을 때
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                offset += limit;
                setPosts(offset, limit);
                // console.log(offset, limit);
            }
        }
        // 인피니티 스크롤
        window.addEventListener('scroll', infinityScrollEventHandler)
    }

    // TODO : 스크롤 이벤트 (페이지네이션)
    const init = async () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            false
        ), document.body)
        await setPosts();
        setEventListener();
    }

    init();
})