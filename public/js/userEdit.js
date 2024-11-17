import {status, strings, validator} from "../utils/constants.js";
import {insertBeforeElement, openModal} from "../utils/function.js";
import Header from "../components/header/header.js";
import {updateMyProfile, uploadProfileImage, withdraw} from "../api/user.js";

document.addEventListener('DOMContentLoaded', () => {
    const formData = {
        'nickname': '',
        'profile_image': ''
    }

    const modifyButton = document.querySelector("#modify");
    const withdrawButton = document.querySelector("#withdraw");

    const updateUser = async () => {
        try {
            formData['profile_image'] = localStorage.getItem("profile_image");

            const updateResponse = await updateMyProfile(formData);

            if (!updateResponse.ok) {
                if (updateResponse.status === status.BAD_REQUEST) {
                    console.error('Bad Request : Update My Profile')
                } else if (updateResponse.status === status.INTERNAL_SERVER_ERROR) {
                    console.error('Internal Server Error : Update My Profile');
                }
                return;
            }

            const updateResult = await updateResponse.json();

            const user = JSON.parse(localStorage.getItem('user'));
            user['profile_image'] = formData['profile_image'] ? formData['profile_image'] : user['profile_image'];
            user['nickname'] = formData['nickname'] ? formData['nickname'] : user['nickname'];
            localStorage.setItem('user', JSON.stringify(user));

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

    modifyButton.addEventListener("click", updateUser);

    const deleteUser = async () => {
        try {
            const deleteResponse = await withdraw();

            if (!deleteResponse.ok) {
                if (deleteResponse.status === status.NOT_FOUND) {
                    console.error('Not Found : Withdraw')
                } else if (deleteResponse.status === status.INTERNAL_SERVER_ERROR) {
                    console.error('Internal Server Error : Withdraw');
                }
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

    // Helper Text 업데이트
    const updateHelper = (helperElement, message = '') => {
        helperElement.textContent = message;
    }

    // Register Data 유효성 검사
    const validateData = () => {
        const {
            nickname,
            profileImg,
        } = formData;

        modifyButton.disabled = !(
            profileImg ||
            nickname &&
            validator.nickname(nickname)
        );
        modifyButton.style.backgroundColor = modifyButton.disabled ? '#ACA0EB' : '#7F6AEE';
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

        if (!response.ok) {
            if (response.status === status.INTERNAL_SERVER_ERROR) {
                console.error('Internal Server Error : Upload Profile Image');
            } else if (response.status === status.BAD_REQUEST) {
                console.error('Bad Request : Upload Profile Image');
            }
        }

        const json = await response.json();
        const data = json.data;
        localStorage.setItem('profile_image', data.profile_image);
    }

    const inputEventHandler = (e, id) => {
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
                // TODO : 닉네임 중복 체크
                updateHelper(helper, strings.BLANK);
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
        const user = JSON.parse(localStorage.getItem('user'));

        const headerProfileImg = document.querySelector(".profile-img");
        headerProfileImg.src = user.profile_image;

        const profileImg = document.querySelector(".image-cover");
        profileImg.src = user.profile_image;

        const email = document.querySelector("#email");
        email.textContent = user.email;

        const nickname = document.querySelector("#nickname");
        nickname.placeholder = user.nickname;
    }

    const init = () => {
        insertBeforeElement(Header(
            strings.HEADER_TITLE,
            true,
            JSON.parse(localStorage.getItem('user')).profile_image
        ), document.body);
        setMyProfile();
        addEventListenerInput();
    };
    init();
})