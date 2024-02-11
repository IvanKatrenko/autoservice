import { fetchData } from './fetchData'

const form = document.querySelector('.form');
const formBtnPrev = document.querySelector('.form__btn_prev');
const formBtnNext = document.querySelector('.form__btn_next');
const formBtnSubmit = document.querySelector('.form__btn_submit');
const formTime = document.querySelector('.form__time')
const formFieldsetType = document.querySelector('.form__fieldset_type')
const formFieldsetDate = document.querySelector('.form__fieldset_date')
const formFieldsetClient = document.querySelector('.form__fieldset_client');
const formFieldsets = [formFieldsetType, formFieldsetDate, formFieldsetClient];
const typeRadioWrapper = document.querySelector('.form__radio-wrapper_type');
const dayRadioWrapper = document.querySelector('.form__radio-wrapper_day');
const timeRadioWrapper = document.querySelector('.form__radio-wrapper_time');
const formMonthsWrapper = document.querySelector('.form__months');
const formInfoType = document.querySelector('.form__info_type');
const formInfoData = document.querySelector('.form__info_data');



currentMonth = new Intel.DateTimeFormat('en - EN', { month: 'long' }).format(new Date(),
) //таким образом определяем текущий месяц Intel.DateTimeFormat

let month = 'january'

let currentStep = 0; //начинаем с нулевого щага

const data = await fetchData(); // вот так мы получаем данные, вызываем фнукию но так как она async то мы подождем await

const dataToWrite = { //другие данные, данные для записи, данные для отправки на сервер
    dataType: {},
    day: '',
    time: '',
};

//функция которая будет выгружить наши данные, что мы выберем на сервер
const createRadioBtns = (wrapper, name, data) => { //cоздаем радиокнопки
    wrapper.textContent = ''; //wrapper очищаем

    data.forEach((item) => { //data перебираем с помощью foreach

        const radioDiv = document.createElement('div');
        radioDiv.className = 'radio';

        const radioInput = document.createElement('input') //cоздаем input
        radioInput.className = 'radio__input';
        radioInput.type = 'radio';
        radioInput.name = name;
        radioInput.id = item.value;
        radioInput.value = item.value;

        const radioLabel = document.createElement('label');// cоздаем label
        radioLabel.className = 'radio__label';
        radioLabel.htmlFor = item.value;
        radioLabel.textContent = item.title;

        //добавляем  radioInput , radioLabel, а в  wrapper добавляем radioDiv
        radioDiv.append(radioInput, radioLabel);
        wrapper.append(radioDiv);

        //<div class="radio">
        //<input class="radio__input" type="radio" name="day" id="day1">
        //<label class="radio__label" for="day1">1</label>  
        //</div> 

    })
}

const allMonth = ['january', 'february', 'march', 'april', 'may', 'june', 'jule', 'august', 'september', 'october', 'november', 'december'];

{/* <p class="form__info">Engine diagnostics and repair</p>
 <p class="form__info">
<time class="form__info-date"date datatime="2024-03-02T14:00">
    <span class="form__info-day">03.02</span>
     <span class="form__info-time">14:00</span>
    </time>
</p> */}

// отображаем рузельтат в конце третьей формы
const showResultData = () => {
    const currentYear = new Date().getFullYear();
    const monthIndex = allMonth.findIndex(item => item === month);
    const dateString = `${currentYear}
    ${(monthIndex + 1).toString().padStart(2, '0')}
    ${dataToWrite.day.toString().padStart(2, '0')}
    T${dataToWrite.time}`; //padstart добавь ноль в начало если будет 1 символ

    const dateObj = new Date(dateString);

    const formattedDate = dateObj.toLocaleDateString('en-EN', {
        day: '2-digit',
        month: '2-digit'
    })

    formInfoType.textContent = dataToWrite.dataType.title;
    formInfoData.innerHTML = `
        <span class="form__info-data-day" >${formattedDate}</span >
            <span class="form__info-data-time">${dataToWrite.time}</span>
    `;
    formInfoData.datetime = dateString;

}

const updateFieldsetVisibility = () => {
    for (let i = 0; i < formFieldsets.length; i++) {
        if (i === currentStep) {
            formFieldsets[i].classList.add('form__fieldset_active')
        } else {
            formFieldsets[i].classList.remove('form__fieldset_active')
        }
    }
    if (currentStep === 0) {
        formBtnPrev.style.display = 'none';
        formBtnNext.style.display = '';
        formBtnSubmit.style.display = 'none';
    } else if (currentStep === formFieldsets.length - 1) {  // это для полсденего элемента
        formBtnPrev.style.display = '';
        formBtnNext.style.display = 'none';
        formBtnSubmit.style.display = '';

        showResultData()

    } else { // это шаги промежуточные
        formBtnPrev.style.display = '';
        formBtnNext.style.display = '';
        formBtnSubmit.style.display = 'none';
    }
};

const createFormDay = (date) => {
    const objectMonth = date.find(item => item.month === month);
    const days = Object.keys(objectMonth.day);
    const typeData = days.map(item => ({
        value: item,
        title: item
    }))
    createRadioBtns(dayRadioWrapper, 'day', typeData) //создаем новые кнопки
}

const createFormMonth = (months) => {
    formMonthsWrapper.textContent = ''//очищаем
    const buttonsMonth = months.map(item => {
        const btn = document.createElement('button'); // создаем кнопку

        btn.className = 'form__btn-month';
        btn.type = 'button';
        // attention !!!!!
        btn.textContent = item[0].toUpperCase() + item.substring(1).toLowerCase(); //первая буква большая остальные маленькие

        if (item === month) {
            btn.classList.add('form__btn-month_active')
        }

        return btn

        // <button class="form__btn-month form__btn-month_active" type="button">February</button>

    });
    formMonthsWrapper.append(...buttonsMonth);

    buttonsMonth.forEach((btn) => { //перебираем все три кнопки
        btn.addEventListener('click', ({ target }) => { //на каждую кнопку навещиваем событие, модем на низ нажать
            if (target.classList.contains('form__btn-month_active')) {
                return; //закончить аыполнение функции 
            }
            buttonsMonth.forEach(btn => {
                btn.classList.remove('form__btn-month_active') //у всех кнопок удаляем класс  form__btn-month_active
            });
            target.classList.add('form__btn-month_active'); //там гед наджали добавялем класс

            month = target.textContent.toLowerCase(); //забираем текст

            const date = data.find(item => item.type === dataToWrite.dataType.type).date; //вызовем формирование дней кнопок, вытаскиваем данные 

            createFormDay(date)
        });
    });
};

//это для второй формы делаем при выборе дня что б выпадало время
const createFormTime = (date, day) => { //передаем дату и день
    const objectMonth = date.find(item => item.month === month); //получаем месяца
    const days = objectMonth.day;//вытаскиваем дни из обьекта
    const daysData = days[day].map(item => ({ //перебираем
        value: `${item}:00`,
        title: `${item}:00`,
    }))
    createRadioBtns(timeRadioWrapper, 'time', daysData)
    formTime.style.display = 'block';
};

//в первой форме выбираем что нам нужно и кнопка ДАЛЕЕ => разблокировалась, переходим на следующую форму
const handleInputForm = ({ currentTarget, target }) => {
    if (currentTarget.type.value && currentStep === 0) {
        formBtnNext.disabled = false;//как только выбираем что то кнопка расблокируеться

        const typeObj = data.find((item) => item.type === currentTarget.type.value)

        dataToWrite.dataType.type = typeObj.type; // из typeObj достаем type
        dataToWrite.dataType.type = typeObj.title; //из  typeObj достаем title


        const date = typeObj.date;
        const months = date.map((item) => item.month)

        createFormMonth(months)
        createFormDay(date)
    }
    if (currentStep === 1) {
        if (currentTarget.day.value && target.name === 'day') {

            dataToWrite.day = currentTarget.day.value;
            const date = data.find(item => item.type === dataToWrite.dataType.type).date;
            //data - это данные, date - это дата
            createFormTime(date, dataToWrite.day)
        }

        if (currentTarget.time.value && target.name === 'time'
        ) {
            dataToWrite.time = currentTarget.time.value;
            formBtnNext.disabled = false;
        } else {
            formBtnNext.disabled = true; //заблокировать
        }
    }
    if (currentStep === 2) { //это 3 форма с именем и тд
        const inputs = formFieldsetClient.querySelectorAll('form__input');
        let allFilled = true; //поле как флажок что они все заполнены

        inputs.forEach(input => { //перебираем inputы
            if (input.value.trim() === '') { //если input  равен пустому зщначению, МЕТОД trim удаляет проблелы слева и справа
                allFilled = false; //это значит что какое то поле не заполненное
            }
        });
        formBtnSubmit.disabled = !allFilled //disabled должен быть true тогда кнопка расблокируеться
    }
};

const renderTypeFieldset = () => { // в этой функции создаем все что бы сработала функция createRadioBtns
    const typeData = data.map(item => ({
        value: item.type,
        title: item.title,
    }));

    createRadioBtns(typeRadioWrapper, 'type', typeData);
}

// const updateFieldsetVisibility2 = function () { };
// function updateFieldsetVisibility3() { };

//это самая главная фнукция которая будет ввыполнять все действия
const init = () => {
    formBtnNext.disabled = true; //при запуске кнопка заблокирована

    formBtnNext.addEventListener('click', () => { //это кошда мы переключаемчс на следующий шаг
        if (currentStep < formFieldsets.length - 1) {
            currentStep += 1; //переулючаемся на один шаг
            updateFieldsetVisibility();//функция которая будет обновлять нашу страницу
            formBtnNext.disabled = true;
            formBtnSubmit.disabled = true;
        }
    });

    formBtnPrev.addEventListener('click', () => { //когда мы возвращаемся нахад
        if (currentStep > 0) {
            currentStep -= 1;
            updateFieldsetVisibility()
            formBtnNext.disabled = false;

        }
    });

    form.addEventListener('input', handleInputForm)


    updateFieldsetVisibility();
    renderTypeFieldset();

    //делаем отправку данных на сервер
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); //запрещаем браузеру делать все самому

        const formData = new FormData(form); //все данные считуем с формы

        const formDataObject = Object.fromEntries(formData);
        formDataObject.month = month
        //отправляем данные
        try {
            const response = await fetch('https://delicate-inky-anaconda.glitch.me/api/orders',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'aplication/json'
                    },
                    body: JSON.stringify(formDataObject) //данные отправлчем в фОРМАТЕ json
                });

            if (response.ok) {
                console.log('data sent successfully');
                alert('data sent successfully');
                form.innerHTML = '<h2>Data sent successfully</h2>'
            } else {
                throw new Error(`Error sending data: ${response.status}`)
            }

        } catch (error) { //обрабатываем ошибку
            console.error(`Error sending request: ${error}`)
        }
    })
}

init();