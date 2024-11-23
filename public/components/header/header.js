import { images } from "../../utils/constants.js";
import DropBox from "./dropbox.js";

const Header = (title, backBtn = false, profile) => {
    const header = document.createElement("header");
    const headerContainer = document.createElement("div");
    headerContainer.classList.add("header-container");

    const backDiv = document.createElement("div");
    backDiv.classList.add("header-back");
    // 뒤로가기 버튼 추가
    if (backBtn) {
        const backImg = document.createElement("img");
        backImg.src = images.BACK_BUTTON_IMAGE;

        // 뒤로가기 이벤트 추가
        backDiv.appendChild(backImg);
        backDiv.addEventListener("click", (e) => {
            history.back();
        })
    }

    let profileDiv = document.createElement("div");
    profileDiv.classList.add("user-profile-img");
    let profileImg;
    // 프로필 이미지가 필요한 경우
    if (profile !== undefined) {
        profileImg = document.createElement("img");
        profileImg.classList.add("profile-img");
        profileImg.src = profile === null ? images.DEFAULT_PROFILE_IMAGE : profile;

        let dropbox = DropBox(localStorage.getItem('is_authenticated'));
        dropbox.classList.add("none");

        profileDiv.appendChild(profileImg);
        profileDiv.appendChild(dropbox);

        profileDiv.addEventListener("click", (e) => {
            dropbox.classList.toggle("none");
            e.stopPropagation()
        })
    }


    let headerTitle = document.createElement("div");
    headerTitle.classList.add("header-title");
    headerTitle.textContent = title;

    headerContainer.appendChild(backDiv);
    headerContainer.appendChild(headerTitle);
    headerContainer.appendChild(profileDiv);
    header.appendChild(headerContainer);

    return header;
}

export default Header;