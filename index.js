const cats = document.querySelector('.container');

// маленькая приколюха
const body = document.querySelector('body')
const header = document.querySelector('header');
body.style.display = 'none';

let video = document.querySelector('.full-screen__video')
video.style.display = 'none'

let pr = prompt('caps nickname', '')
if (pr == 'Muklyxa13'.toUpperCase()) {
    body.style.display = 'block'
}
else {
    body.style.display = 'block'
    header.style.display = 'none'
    cats.style.display = 'none'
    video.style.display = 'block'
}

/*
за названия переменных сразу хочется извиниться, ибо не везде они отображают суть возможно xD
*/
/*
показать всех котов
*/

const ACTIONS = {
    DETAIL: 'detail',
    DELETE: 'delete',
    EDIT: 'edit',
}

const showALLCats = () => {

    const getCat = (cat) => `
        <div class = 'pet' data-cat-id="${cat.id}">
            <img class = 'pet_image' src='${cat.image}'/>
            <p class = 'pet_name' hidden>Отзывается на "${cat.name}"</p>
            <p class = 'pet_rate' hidden><i class="fas fa-star"></i> ${cat.rate}</p>
            <p class = 'pet_description' hidden>${cat.description}</p>
            <div class = 'action_btn'>
                <button data-action = "${ACTIONS.DETAIL}" type = "button" class = "btn-detail">Описание</button>
                <button data-action = "${ACTIONS.EDIT}" type = "button" class = "btn-edit">Редактировать</button>
                <button data-action = "${ACTIONS.DELETE}" type = "button" class = "btn-delete">Тык, и нет кота!</button>
            </div>
        </div>
    `;

    const fetchAllCats = fetch("https://cats.petiteweb.dev/api/single/Muklyxa13/show/");

    fetchAllCats
        .then((res) => res.json())
        .then(data => {
            cats.insertAdjacentHTML(
                "afterbegin", data.map((cat) => getCat(cat)).join('')
                )
            }
        )
}

showALLCats()

/*
показать инфу кота
*/
const getCatDetails = (cat) => `
    <div class = 'id_detail' data-cat-id="${cat.id}">
        <i class="fas fa-times-circle"></i>
        <div class = 'div_image_detail'>
            <img class = 'img_detail' src='${cat.image}'/>
        </div>
        <p class = 'name_detail'>Отзывается на "${cat.name}"</p>
        <p class = 'rate_detail'>Рейтинг: <i class="fas fa-star"></i> <span class = 'span'>${cat.rate}</span></p>
        <p class = 'age_detail'>Возраст: <span class = 'span'>${cat.age}</span></p>
        <p class = 'favorite_detail'>Любимчик: <span class = 'span'>${!!cat.favorite === true ? '<i class="fas fa-thumbs-up"></i>' : '<i class="fas fa-thumbs-down"></i>'}</span></p>
        <p class = 'description_detail'><span class = 'span'>${cat.description}</span></p>
    <div>
`;

/*
работа с кнопками кота
*/
cats.addEventListener('click', (e) => {
    e.preventDefault()

// удалить кота по id
    if (e.target.dataset.action === ACTIONS.DELETE) {
        const $catWr = e.target.closest('[data-cat-id]')
        const catId = $catWr.dataset.catId

        fetch(`https://cats.petiteweb.dev/api/single/Muklyxa13/delete/${catId}`, {
            method: "DELETE"
        }).then((res) => {
            if (res.status === 200) {
                return $catWr.remove();
            }

            alert(`Кот c id: ${catId} не удаляемый!`)
        })
    }

// показать кота по id
    if (e.target.dataset.action === ACTIONS.DETAIL) {
        const $catWr = e.target.closest('[data-cat-id]')
        const catId = $catWr.dataset.catId
        const showOneCat = fetch(`https://cats.petiteweb.dev/api/single/Muklyxa13/show/${catId}`);

        showOneCat
            .then((res) => res.json())
            .then(data => {
                modalDetailCat.innerHTML = getCatDetails(data)
                const closeModalTwo = document.querySelector('.fa-times-circle')
                closeModalTwo.addEventListener('click', modalClosedTwo)

            })
            
        modalClosedDetails()
    }

// редактирование кота по id
    if (e.target.dataset.action === ACTIONS.EDIT) {
        const $catWr = e.target.closest('[data-cat-id]')
        const catId = $catWr.dataset.catId
        const closeModalThree = document.querySelector('.editClosed')
        closeModalThree.addEventListener('click', modalClosedThree)
        
        async function handleEditCatSubmit (e) {
            e.preventDefault()

            const editData = new FormData(editCat)
            const object = {};
            editData.forEach((value, key) => object[key] = value);

            const res = await editCatFetch(JSON.stringify(object))
            cats.innerHTML = ''
            showALLCats()
        }

        async function editCatFetch(data) {
            return await fetch(`https://cats.petiteweb.dev/api/single/Muklyxa13/update/${catId}`, {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: data,
            }).then((res) => {
                if(res.status === 200) {
                    editCat.removeEventListener('submit', handleEditCatSubmit)
                }
            })
        }

        const editCat = document.getElementById('edit');
        editCat.addEventListener('submit', handleEditCatSubmit);
        
        modalClosedEdit()
    }
})

/*
добавить кота
*/
async function handleAddCatSubmit(event) {
    event.preventDefault()
    
    const data = new FormData(addCat);
    const object = {};
    data.forEach((value, key) => object[key] = value);
    const response = await addCatFetch(JSON.stringify(object));
    cats.innerHTML = ''
    showALLCats()
}

async function addCatFetch(data) {
    return await fetch("https://cats.petiteweb.dev/api/single/Muklyxa13/add/", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: data,
    }).then((res) => {
        if (res.status === 200) {
            // очищаем LS
            LS.removeItem('formData')
            addCat.reset()
        }
    })
    
}

const addCat = document.getElementById('addCat');
addCat.addEventListener('submit', handleAddCatSubmit);

// сохраняем данные в LS
let formData = {};
const LS = localStorage;

addCat.addEventListener('change', () => {
    formData[event.target.name] = event.target.value;
    LS.setItem('formData', JSON.stringify(formData))
})

/*
модалка добавления кота
*/
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.fa-times');
const modalOverlay = document.querySelector('.modal-overlay');
const addCatBtn = document.querySelector('.btn_show_addCat');

const modalClosed = () => {
    modal.classList.toggle('modal-open')
    modal.classList.toggle('fadeIn')
    modal.classList.remove('fadeOut')
    modal.style.display = 'block'
    // восстанавливаем данные из LS
    if (LS.getItem('formData')) {
        formData = JSON.parse(LS.getItem('formData'))
        for (let key in formData) {
            addCat.elements[key].value = formData[key]
        }
    }   
}

addCatBtn.addEventListener('click', modalClosed)

const modalSubmitAddCat = () => {
    modal.classList.toggle('modal-open')
    modal.classList.toggle('fadeIn')
    modal.classList.add('fadeOut')
    modal.style.display = 'block'
}

closeModal.addEventListener('click', () => {
    modal.classList.toggle('modal-open')
    modal.classList.toggle('fadeIn')
    modal.classList.add('fadeOut')
    modal.style.display = 'block'
})

modalOverlay.addEventListener('click', () => {
    modal.classList.remove('modal-open')
    modal.classList.remove('fadeIn')
    modal.classList.add('fadeOut')
    modal.style.display = 'block'
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
        modal.classList.remove('modal-open')
        modalTwo.classList.remove('modal-open-two')
        modalThree.classList.remove('modal-open-three')
        modal.classList.remove('fadeIn')
        modal.classList.add('fadeOut')
        modalTwo.classList.remove('fadeIn')
        modalTwo.classList.add('fadeOut')
        modalThree.classList.remove('fadeIn')
        modalThree.classList.add('fadeOut')
    }
})

document.querySelector('.form__submit').addEventListener('click', modalSubmitAddCat)

/*
модалка описания кота
*/
const modalDetailCat = document.querySelector('.modal_detail_cat');
const modalTwo = document.querySelector('.modal-two');
const modalOverlayTwo = document.querySelector('.modal-overlay-two');

const modalClosedTwo = () => {
    modalTwo.classList.toggle('modal-open-two')
    modalTwo.classList.toggle('fadeIn')
    modalTwo.classList.add('fadeOut')
    modalTwo.style.display = 'block'
}

modalOverlayTwo.addEventListener('click', () => {
    modalTwo.classList.remove('modal-open-two')
    modalTwo.classList.remove('fadeIn')
    modalTwo.classList.add('fadeOut')
    modalTwo.style.display = 'block'
})

const modalClosedDetails = () => {
    modalTwo.classList.toggle('modal-open-two')
    modalTwo.classList.toggle('fadeIn')
    modalTwo.classList.remove('fadeOut')
    modalTwo.style.display = 'block'
}

/*
модалка редактирования кота
*/
const modalEditCat = document.querySelector('.modal_edit_cat');
const modalThree = document.querySelector('.modal-three');
const modalOverlayThree = document.querySelector('.modal-overlay-three');

const modalClosedThree = () => {
    modalThree.classList.toggle('modal-open-three')
    modalThree.classList.toggle('fadeIn')
    modalThree.classList.add('fadeOut')
    modalThree.style.display = 'block'
}

modalOverlayThree.addEventListener('click', () => {
    modalThree.classList.remove('modal-open-three')
    modalThree.classList.remove('fadeIn')
    modalThree.classList.add('fadeOut')
    modalThree.style.display = 'block'
})

const modalClosedEdit = () => {
    modalThree.classList.toggle('modal-open-three')
    modalThree.classList.toggle('fadeIn')
    modalThree.classList.remove('fadeOut')
    modalThree.style.display = 'block'
}

document.querySelector('.edit_btn').addEventListener('click', modalClosedThree)