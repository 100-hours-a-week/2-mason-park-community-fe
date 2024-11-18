import {appendChildElement, insertBeforeElement} from "../utils/function.js";
import Header from "../components/header/header.js";
import PostItem from "../components/post/postItem.js"
import {status, strings} from "../utils/constants.js";
import {getPostsRequest} from "../api/post.js";

document.addEventListener('DOMContentLoaded', () => {
    const postWriteBtn = document.getElementById('post-write-btn');

    const setPosts = async (offset=0, limit=5) => {
        const getResponse = await getPostsRequest(offset, limit);

        if(!getResponse.ok) {
            if (getResponse.status === status.UNAUTHORIZED) {
                console.error('Unauthorized : Get Posts')
            } else if (getResponse.status === status.INTERNAL_SERVER_ERROR) {
                console.error('Internal Server Error : Get Posts');
            }
        }

        const getResult = await getResponse.json();
        const posts = getResult.data;

        const container = document.querySelector('.container-column');
        const blankTitle = document.querySelector('.blank-title');

        if (posts.length > 0) {
            blankTitle.classList.add('none');
            posts.forEach(post => {
                console.log(post);
                appendChildElement(PostItem(
                    post
                ), container);
            })
        } else {
            blankTitle.classList.remove('none');
        }
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
                await setPosts(offset, limit);
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
        await setPosts();
        setEventListener();
    }

    init();
})