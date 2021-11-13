
let userAnswer = {};
let correctAnwer = {};

/** Call APIs */
async function getQuestions() {
    const response = await fetch('https://wpr-quiz-api.herokuapp.com/attempts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();

    return result;
}

async function submitAnswers(id) {
    const response = await fetch(`https://wpr-quiz-api.herokuapp.com/attempts/${id}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            "answers": userAnswer
        })
    });
    const result = await response.json();
    return result;
}


/** Mutate DOM */
const startingPointBtn = document.getElementById('starting_point');

startingPointBtn.addEventListener('click', handleStartingPointBtnClick)
// onBtnStartClick
async function handleStartingPointBtnClick(e) {
    const data = await getQuestions();
    hideIntro();
    renderQuestions(data);
}




async function handleSubmitBtnClick(e, questionFormData) {
    if(confirm('Are you sure want to finish this quiz ?')){
    const data = await submitAnswers(questionFormData._id);
    console.log(data);
    let mark=data.score;
    let comment=data.scoreText;
    document.body.scrollIntoView();
    correctAnswer = data.correctAnswers;
    console.log(correctAnswer);
    //hidden Attemp-quiz
    const hiddenQuestions = document.getElementById("attempt-quiz")
    hiddenQuestions.setAttribute("class", "hiddenAttemptQuiz")


    //render review
    const section = document.getElementById('review-quiz');

    let correctAnswers = {}
    correctAnswers = data.correctAnswers


    data.questions.map((index, key) => {

        // render questions 
        const h2 = document.createElement('h2')
        h2.setAttribute('class', 'no-ques')
        h2.textContent = `Question ${key + 1} of 10`
        section.appendChild(h2)

        const p = document.createElement('p')
        p.setAttribute('class', 'no-question')
        p.textContent = index.text
        section.appendChild(p)

        const form = document.createElement('form')
        form.setAttribute('id', index._id)
        section.appendChild(form)

        // render answer
        // QuestionIds = index._id

        index.answers.map((text, keys) => {




            const div = document.createElement('div')
            div.setAttribute('class', 'ans')
            form.appendChild(div)



            const input = document.createElement('input')
            input.setAttribute('id', `answer${keys + 1}${index._id}`)
            input.setAttribute('type', 'radio')
            input.setAttribute('name', 'answer')
            input.setAttribute('value', keys)
            input.setAttribute('onchange', 'checked_option(this)')
            div.appendChild(input)



            const label = document.createElement('label')
            label.setAttribute('for', `answer${keys + 1}${index._id}`)
            label.textContent = text
            div.appendChild(label)

            input.disabled = true;
            if (userAnswer[form.id] == keys) {
                input.checked = true;
            }

            if (userAnswer[form.id] == keys && correctAnswer[form.id] == keys) {
                div.classList.add('correctAnswers')

            }
            if (userAnswer[form.id] == keys && correctAnswer[form.id] != keys) {
                div.classList.add('wrongAnswers')

            }

            if (userAnswer[form.id] != keys && correctAnswer[form.id] == keys) {
                div.classList.add('unchosenCorrectAnswers')
            }

        })

    })
    const resultContainer = document.createElement("div")
    resultContainer.setAttribute('class', 'resultContainer')
    section.appendChild(resultContainer)

    const resultTitle = document.createElement("h1")
    resultTitle.textContent = 'Result:'
    resultTitle.setAttribute('class','resultTitle')
    resultContainer.appendChild(resultTitle)

    const totalCorrectAnswers = document.createElement("p")
    totalCorrectAnswers.setAttribute('class', 'totalCorrectAnswers')
    totalCorrectAnswers.textContent = `${mark}/10`
    resultContainer.appendChild(totalCorrectAnswers)

    const percentage = document.createElement("p")
    percentage.setAttribute('class', 'percentage')
    percentage.textContent = `${mark*10}%`
    resultContainer.appendChild(percentage)

    const comments = document.createElement("p")
    comments.setAttribute('class', 'comment')
    comments.textContent = `${comment}`
    resultContainer.appendChild(comments)



    const tryAgainButton = document.createElement("button")
    tryAgainButton.textContent = 'Try again'
    tryAgainButton.setAttribute('class', 'tryAgainButton')
    resultContainer.appendChild(tryAgainButton)
    tryAgainButton.addEventListener('click',()=>{
        document.body.scrollIntoView();
        location.reload();
    })

    }

}




function hideIntro() {
    document.querySelector('.author').setAttribute('class', 'hiddenAuthor')
    document.querySelector('#introduction').setAttribute('class', 'introText');
}

function renderQuestions(data) {
    const section = document.getElementById('attempt-quiz');

    data.questions.map((index, key) => {
        // render question
        const h2 = document.createElement('h2')
        h2.setAttribute('class', 'no-ques')
        h2.textContent = `Question ${key + 1} of 10`
        section.appendChild(h2)

        const p = document.createElement('p')
        p.setAttribute('class', 'no-question')
        p.textContent = index.text
        section.appendChild(p)

        const form = document.createElement('form')
        form.setAttribute('id', index._id)
        section.appendChild(form)

        // render answers
        index.answers.map((text, keys) => {
            const div = document.createElement('div')
            div.setAttribute('class', 'ans')
            form.appendChild(div)

            div.addEventListener('click', function checkedOption(event) {
                const optionDiv = event.currentTarget;
                const form = optionDiv.parentElement;
                const newInput = optionDiv.querySelector('input');
                newInput.checked = true;

                const checkedDiv = form.querySelector('.checked-option');
                if (checkedDiv) {
                    checkedDiv.classList.remove('checked-option');


                }
                optionDiv.classList.add('checked-option');
                userAnswer[form.id] = newInput.value;


            });




            const input = document.createElement('input')
            input.setAttribute('id', `answer${keys + 1}${index._id}`)
            input.setAttribute('type', 'radio')
            input.setAttribute('name', 'answer')
            input.setAttribute('value', keys)
            input.setAttribute('onchange', 'checked_option(this)')

            div.appendChild(input)

            const label = document.createElement('label')
            label.setAttribute('for', `answer${keys + 1}${index._id}`)
            label.textContent = text
            div.appendChild(label)
        })
    })

    // render submit button
    const submitBox = document.createElement('div')
    submitBox.setAttribute('class', 'submitBox')
    section.appendChild(submitBox)

    const submit = document.createElement('button')
    submit.setAttribute('class', 'submit')
    submit.textContent = 'Submit your answers ❯'

    submitBox.appendChild(submit)

    submit.addEventListener('click', (e) => handleSubmitBtnClick(e, data))
}
