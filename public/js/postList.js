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

        let offset = 5,
            limit = 5,
            isEnd = false,
            isProcessing = false;
        const infinityScrollEventHandler =  async (e) => {

            // 페이지의 맨 아래로 스크롤 했을 때
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !isEnd && !isProcessing) {
                isProcessing = true;
                try {
                    const posts = await getPosts(offset, limit);
                    if (!posts || posts.length === 0) {
                        isEnd = true;
                    } else {
                        offset += limit;
                        await setPosts(posts);
                    }
                } catch (e) {
                    console.error(e);
                    isEnd = true;
                } finally {
                    isProcessing = false;
                }
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