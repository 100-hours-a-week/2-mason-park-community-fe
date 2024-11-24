import {closeModal} from "../../utils/function.js";

const Modal = (title, content, handler) => {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    const modalBox = document.createElement('div');
    modalBox.classList.add('modal-box');

    const modalTitle = document.createElement('p');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = title;

    const modalContent = document.createElement('p');
    modalContent.classList.add('modal-content');
    modalContent.textContent = content;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-btn-container');

    const cancelButton = document.createElement('div');
    cancelButton.classList.add('modal-cancel-btn');
    cancelButton.textContent = "취소";
    cancelButton.addEventListener('click', (e) => {
        closeModal();
    })

    const confirmButton = document.createElement('div');
    confirmButton.classList.add('modal-confirm-btn');
    confirmButton.textContent = "확인";
    confirmButton.addEventListener('click',  async (e) => {
        await handler();
    })

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);

    modalBox.appendChild(modalTitle);
    modalBox.appendChild(modalContent);
    modalBox.appendChild(buttonContainer);

    modalContainer.appendChild(modalBox);

    return modalContainer;
}

export default Modal;