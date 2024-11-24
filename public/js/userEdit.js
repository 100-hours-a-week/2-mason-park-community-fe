import {images, status, strings, validator} from "../utils/constants.js";
import {insertBeforeElement, openModal, updateHelper} from "../utils/function.js";
import Header from "../components/header/header.js";
import {getMyProfile, updateMyProfile, uploadProfileImage, withdraw} from "../api/user.js";
import {existNickname} from "../api/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    let isDisabled = true;
    const formData = {
        'nickname': '',
        'profile_image': ''
    }

    const modifyButton = document.querySelector("#modify");
    const withdrawButton = document.querySelector("#withdraw");

    const updateUser = async () => {
        try {
            if (isDisabled) {
                return;
            }

            formData['profile_image'] = localStorage.getItem("profile_image");

            const response = await updateMyProfile(formData);
            const result = await response.json();

            if (!response.ok) {
                console.error(`${result.error} : ${result.message}`);
                return;
            }

            await setUserData();
            setMyProfile()

            const toast = document.querySelector("#toast");

            toast.classList.toggle('active');
            setTimeout(() => {
                toast.classList.toggle('active');
            }, 2000);
        } catch (e) {
            console.error(e);
        }
    }

    const setUserData = async () => {
        const response = await getMyProfile();
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        localStorage.setItem('profile_image', result.data.profile_image);
        localStorage.setItem('nickname', result.data.nickname);
    }

    modifyButton.addEventListener("click", updateUser);

    const deleteUser = async () => {
        try {
            const response = await withdraw();
            const result = await response.json();

            if (!response.ok) {
                console.error(`${result.error} : ${result.message}`);
                return;
            }

            localStorage.clear();
            location.href = '/';
        } catch (e) {
            console.error(e);
        }
    }

    withdrawButton.addEventListener("click", (e) => {
        openModal(
            strings.MODAL_USER_DELETE_TITLE,
            strings.MODAL_USER_DELETE_CONTETN,
            deleteUser
        );

    })

    // Register Data 유효성 검사
    const validateData = () => {
        const {
            nickname,
            profileImg,
        } = formData;

        isDisabled = !(
            profileImg ||
            nickname && validator.nickname(nickname)
        );
        modifyButton.style.backgroundColor = isDisabled ? '#ACA0EB' : '#7F6AEE';
        modifyButton.style.cursor = isDisabled ? 'default' : 'pointer';
    }

    const updateData = (e, key)  => {
        formData[key] = e.target.value;
        validateData();
    }

    const changeEventHandler = async (e, id) => {
        const file = e.target.files[0];

        if (!file) return;

        // 이미지 미리보기
        const fileReader = new FileReader();
        const img = document.querySelector(".image-cover");

        fileReader.onload = (e) => {
            img.setAttribute('src', e.target.result);
            img.setAttribute('width', '150');
            img.style.objectFit = 'contain';
        }
        fileReader.readAsDataURL(file);

        const image = new FormData();
        image.append('profile_image', file);

        const response = await uploadProfileImage(image);
        const result = await response.json();

        if (!response.ok) {
            console.error(`${result.error} : ${result.message}`);
            return;
        }

        localStorage.setItem('profile_image', result.data.profile_image);
    }

    const inputEventHandler = async (e, id) => {
        const helper = document.querySelector(".span-helper");
        const value = e.target.value;

        if (id === 'nickname') {
            if (!value) {
                updateHelper(helper, strings.NICKNAME_BLANK);
            } else if (value.includes(' ')) {
                updateHelper(helper, strings.NICKNAME_INCLUDE_SPACE);
            } else if (value.length > strings.NICKNAME_INCLUDE_SPACE) {
                updateHelper(helper, strings.NICKNAME_EXCEED_MAX_LEN);
            } else {
                const response = await existNickname(value);
                if (response.status === status.CONFLICT) {
                    updateHelper(helper, strings.NICKNAME_EXIST);
                } else if (response.status === status.OK) {
                    updateHelper(helper, strings.BLANK);
                }
            }
        }
        updateData(e, id);
    }

    const addEventListenerInput = () => {
        const inputs = document.querySelectorAll(".input");

        inputs.forEach(input => {
            const id = input.id;

            if (id === 'profile-img') {
                input.addEventListener('change', (e) => {
                    changeEventHandler(e, id);
                })
            } else {
                input.addEventListener('input', (e) => {
                    inputEventHandler(e, id);
                })
            }
        })
    }

    const setMyProfile = () => {
        const profile_image = localStorage.getItem('profile_image');
        const headerProfileImg = document.querySelector(".profile-img");
        headerProfileImg.src = profile_image ? profile_image : images.DEFAULT_PROFILE_IMAGE;

        const profileImg = document.querySelector(".image-cover");
        profileImg.src = profile_image ? profile_image : images.DEFAULT_PROFILE_IMAGE;

        const email = document.querySelector("#email");
        email.textContent = localStorage.getItem('email');

        const nickname = document.querySelector("#nickname");
        nickname.placeholder = localStorage.getItem('nickname');
    }

    const init = () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true,
            localStorage.getItem('profile_image')
        ), document.body);
        setMyProfile();
        addEventListenerInput();
    };
    init();
})