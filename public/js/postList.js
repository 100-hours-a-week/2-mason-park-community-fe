import {appendChildElement, insertBeforeElement} from "../utils/function.js";
import Header from "../components/header/header.js";
import PostItem from "../components/post/postItem.js"
import {strings} from "../utils/constants.js";
import {getPostsRequest} from "../api/post.js";

document.addEventListener('DOMContentLoaded', () => {
    let postCount = 0;
    const postWriteBtn = document.getElementById('post-write-btn');

    const getPosts = async (offset=0, limit=5) => {
        const response = await getPostsRequest(offset, limit);
        const result = await response.json();

        if(!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        postCount += result.data.length;
        return result.data;
    }

    const setPosts = async (posts) => {
        const blankTitle = document.querySelector('.blank-title');
        postCount > 0 ? blankTitle.classList.add('none') : blankTitle.classList.remove('none');

        const container = document.querySelector('.container-column');
        posts.forEach(post => {
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

        const infinityScrollEventHandler =  async (e) => {

            // 페이지의 맨 아래로 스크롤 했을 때
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                offset += limit;
                const posts = await getPosts(offset, limit);
                await setPosts(posts);
            }
        }

        // 인피니티 스크롤
        window.addEventListener('scroll', infinityScrollEventHandler)
    }

    const init = async () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            false,
            localStorage.getItem('profile_image')
        ), document.body)

        const posts = await getPosts();
        await setPosts(posts);

        setEventListener();
    }

    init();
})