const CommentItem = (data, isAuth, handler) => {
    const commentBox = document.createElement('div');
    commentBox.classList.add('comment-box');

    const commentHeader = document.createElement('div');
    commentHeader.classList.add('comment-header');

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

    const createdAt = document.createElement("span");
    createdAt.classList.add("span-time");
    createdAt.textContent = data.created_at;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("btn-container");

    let button;
    ["수정", "삭제"].forEach(text => {
        button = document.createElement("div");
        button.classList.add("c-btn");
        button.textContent = text;

        button.addEventListener("click", (e) => {
            if (text === "수정") {
                handler.update();
            } else if (text === "삭제") {
                handler.delete();
            }
        });

        buttonContainer.appendChild(button);
    })

    commentHeader.appendChild(profileContainer);
    commentHeader.appendChild(createdAt);
    if (isAuth) {
        commentHeader.appendChild(buttonContainer);
    }

    const commentContent = document.createElement("article");
    commentContent.classList.add("comment-content");
    commentContent.textContent = data.content;

    commentBox.appendChild(commentHeader);
    commentBox.appendChild(commentContent);

    return commentBox
}

export default CommentItem;