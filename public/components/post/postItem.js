import { limit } from "../../utils/constants.js"
import {convertToKUnit} from "../../utils/function.js";

const PostItem = (data) => {
    const postBox = document.createElement("article");
    postBox.classList.add("post-box");

    let postBoxWrap = document.createElement("div");
    postBoxWrap.classList.add("post-box-wrap");

    const postTitle = document.createElement("span");
    postTitle.classList.add("post-title");

    if (data.title.length >= limit.TITLE_MAX_LEN) {
        postTitle.textContent = `${data.title.substring(0, limit.TITLE_MAX_LEN)}...`;
    } else {
        postTitle.textContent = data.title;
    }

    const postMetaContainer = document.createElement("div");
    postMetaContainer.classList.add("post-meta-container");

    let postMetaItem;
    ['thumbs', 'views', 'comments', 'created_at'].forEach(item => {
        postMetaItem = document.createElement("span");
        postMetaItem.classList.add("post-meta-item");
        if (item === 'thumbs') {
            postMetaItem.textContent = `좋아요 ${convertToKUnit(data[item])}`
        } else if (item === 'views') {
            postMetaItem.textContent = `조회수 ${convertToKUnit(data[item])}`
        } else if (item === 'comments') {
            postMetaItem.textContent = `댓글 ${convertToKUnit(data[item])}`
        } else if (item === 'created_at') {
            postMetaItem.classList.add('span-time');
            // TODO: yyyy-MM-dd HH:mm:ss
            postMetaItem.textContent = data[item]
        }
        postMetaContainer.appendChild(postMetaItem);
    });

    postBoxWrap.appendChild(postTitle);
    postBoxWrap.appendChild(postMetaContainer);

    postBox.appendChild(postBoxWrap);
    postBox.appendChild(document.createElement("hr"));

    postBoxWrap = document.createElement("div");
    postBoxWrap.classList.add("post-box-wrap");

    const writer = data.writer;

    const profileContainer = document.createElement("div");
    profileContainer.classList.add("profile-container");

    const profileImgBox = document.createElement("div");
    profileImgBox.classList.add("profile-img-box");

    const profileImg = document.createElement("img");
    profileImg.classList.add("image-cover");
    profileImg.src = writer.profile_image;

    profileImgBox.appendChild(profileImg);

    const profileNickname = document.createElement("span");
    profileNickname.classList.add("profile-nickname");
    profileNickname.textContent = writer.nickname;

    profileContainer.appendChild(profileImgBox);
    profileContainer.appendChild(profileNickname);

    postBoxWrap.appendChild(profileContainer);
    postBox.appendChild(postBoxWrap);

    // 클릭 시 상세 페이지 이동
    postBox.addEventListener("click", (e) => {
        location.href = `/posts/${data.post_id}`;
    })

    return postBox;
}


export default PostItem;