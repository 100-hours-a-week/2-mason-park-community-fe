import {strings} from "../../utils/constants.js";

const DropBox = () => {
    let dropboxContainer = document.createElement("div");
    dropboxContainer.classList.add("dropbox-container");

    // 회원 정보 수정
    let linkUserSetting = document.createElement("div");
    linkUserSetting.classList.add("dropbox");
    linkUserSetting.textContent = strings.MODIFY_USERS_INFO;
    linkUserSetting.addEventListener("click", (e) => {
        window.location.href = '/users/setting';
    })

    // 비밀번호 수정
    let linkPassword = document.createElement("div");
    linkPassword.classList.add("dropbox");
    linkPassword.textContent = strings.MODIFY_USERS_PASSWORD;
    linkPassword.addEventListener("click", (e) => {
        window.location.href = '/users/password';
    })

    // 로그아웃
    let linkLogout = document.createElement("div");
    linkLogout.classList.add("dropbox");
    linkLogout.textContent = strings.LOGOUT;
    linkLogout.addEventListener("click", (e) => {
        // TODO : 세션 쿠키 제거
        window.location.href = '/login';
    })

    dropboxContainer.appendChild(linkUserSetting);
    dropboxContainer.appendChild(linkPassword);
    dropboxContainer.appendChild(linkLogout);
    return dropboxContainer;
}

export default DropBox;