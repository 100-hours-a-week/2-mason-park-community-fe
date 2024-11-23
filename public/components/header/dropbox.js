import {status, strings} from "../../utils/constants.js";
import {logoutRequest} from "../../api/auth.js";

const DropBox = (auth) => {
    const dropboxContainer = document.createElement("div");
    dropboxContainer.classList.add("dropbox-container");

    // 회원 정보 수정
    const linkUserSetting = document.createElement("div");
    linkUserSetting.classList.add("dropbox");
    linkUserSetting.textContent = strings.MODIFY_USERS_INFO;
    linkUserSetting.addEventListener("click", (e) => {
        window.location.href = '/users/setting';
    })

    // 비밀번호 수정
    const linkPassword = document.createElement("div");
    linkPassword.classList.add("dropbox");
    linkPassword.textContent = strings.MODIFY_USERS_PASSWORD;
    linkPassword.addEventListener("click", (e) => {
        window.location.href = '/users/password';
    })

    // 로그아웃
    const linkLogout = document.createElement("div");
    linkLogout.classList.add("dropbox");
    linkLogout.textContent = strings.LOGOUT;
    linkLogout.addEventListener("click", logout);

    // 로그인
    const linkLogin = document.createElement("div");
    linkLogin.classList.add("dropbox");
    linkLogin.textContent = strings.LOGIN;
    linkLogin.addEventListener("click", (e) => {
        window.location.href = '/login';
    })

    if (auth) {
        dropboxContainer.appendChild(linkUserSetting);
        dropboxContainer.appendChild(linkPassword);
        dropboxContainer.appendChild(linkLogout);
    } else {
        dropboxContainer.appendChild(linkLogin);
    }

    return dropboxContainer;
}

const logout = async () => {
    try {
        const response = await logoutRequest();

        if (!response.ok) {
            if (response.status === status.INTERNAL_SERVER_ERROR) {
                console.error('Internal Server Error : Logout');
            }
        }

        localStorage.clear();
        location.href = '/login';
    } catch (e) {
        console.error(e);
    }
}

export default DropBox;