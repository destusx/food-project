import {openModal, closeModal} from './modal';
import {postData} from '../services/services';


function forms(formsSelector, modalTimerId) {
    //Forms

    const forms = document.querySelectorAll(formsSelector);

    const message = {
        loading: 'icons/spinner.svg',
        succses: 'Спасибо! Скоро мы с вами свяжимся',
        failure: 'Что-то пошла не так...'
    };

    forms.forEach(item => {
        bimdPostData(item);
    });

    function bimdPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;    
            `
            form.insertAdjacentElement('afterend', statusMessage)


            const formData = new FormData(form);
        
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data)
                showThanksModal(message.succses);
                statusMessage.remove()
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset()
            })
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog')

        prevModalDialog.classList.add('hide');
        openModal('.modal', modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 4000)
    }
}

export default forms;