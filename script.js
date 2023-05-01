const form = document.querySelector('form')
const dates = document.querySelectorAll('input')
const day = document.querySelector('#day')
const month = document.querySelector('#month')
const year = document.querySelector('#year')
const btn = document.querySelector('button')

const formData = {
    day: 0,
    month: 0,
    year: 0,
}

const date = new Date
// Used to validate that year isn't in the future
year.max = date.getFullYear()
maxDays = 31

// Update form data
// Also handles max days allowed in month
dates.forEach(i =>
    i.addEventListener('change', updateFormData))

// handle error messages for invalid inputs
dates.forEach(i =>
    i.addEventListener('blur', (e) => errMessages(e)))

// Displays calculated output also responsible for timeout/intervals
// for spinning number    
form.addEventListener('submit', (e) => displayOutput(e))

// Add 0 to start of month if number 
// between 1-9 is entered into month input
month.addEventListener('blur', (e) => {
    if (e.target.value.length === 1) {
        const value = e.target.value
        e.target.value = `0${value}`
    }
})

function updateFormData() {
    // Assign formData values to those of the user input
    formData.day = day.value
    formData.month = month.value
    formData.year = year.value

    // Dynamically update days in month
    // "Thirty days has September, April, June and November
    // All the rest have 31
    // Except Febuary which has 28 or 29 in a leap year"
    switch (Number(month.value)) {
        case 2:
            maxDays = 29
            break;
        case 9:
        case 4:
        case 6:
        case 11:
            maxDays = 30
            break;
        default:
            maxDays = 31
    }

    day.max = maxDays
}

function displayOutput(e) {
    e.preventDefault()
    const labels = document.querySelectorAll('label')
    const inputs = document.querySelectorAll('input')

    if (form.checkValidity()) {
        // Clear error messages
        dates.forEach(i => {
            document.querySelector(`.${i.id}Input span`)
                .textContent = ''
        })
        // Button is disabled on click and then 
        // enabled when output is displayed
        btn.disabled = true
        // Get spans associated with each output
        const daysSpan = document.querySelector('.displayDays span')
        const monthsSpan = document.querySelector('.displayMonths span')
        const yearsSpan = document.querySelector('.displayYears span')
        const age = calcDate()
        let num = 10
        let valid = true

        age.forEach(number => {
            if (number < 0) {
                document.querySelector('.dayInput span').textContent = 'Must be in the past'
                valid = false
                btn.disabled = false
                document.querySelector(`#day`).focus()

                labels.forEach(label => label.style.color = 'red')
                inputs.forEach(label => label.style.borderColor = 'red')
            }

        })

        if (valid) {

            labels.forEach(label => label.style.color = 'hsl(0, 1%, 44%)')
            inputs.forEach(label => label.style.borderColor = 'hsl(0, 0%, 86%)')

            const daysOutput = age[2]
            const monthsOutput = age[1]
            const yearsOutput = age[0]

            let int = setInterval(() => {
                num === 0 ? num = 9 : num--
                daysSpan.textContent = `${numOfNums(num, daysOutput)}`
                monthsSpan.textContent = `${numOfNums(num, monthsOutput)}`
                yearsSpan.textContent = `${numOfNums(num, yearsOutput)}`
            }, 100);

            setTimeout(() => {
                clearInterval(int)
                // daysPara.textContent = daysOutput === 1 ? `day` : `days`
                daysSpan.textContent = `${daysOutput}`

                monthsSpan.textContent = `${monthsOutput}`

                yearsSpan.textContent = `${yearsOutput}`

                // Button is enabled and focus set to first input 
                // for user to enter a new date
                btn.disabled = false
                document.querySelector(`#day`).focus()
            }, 2000);
        }
    } else {

        // Invalid elements put into an array 
        // and focus given to first element
        // so the user can correct their mistake
        const invalidArr = []
        dates.forEach(i => {
            if (i.checkValidity() === false) {
                invalidArr.push(i.id)
                document.querySelector(`.${i.id}Input span`)
                    .textContent = ''
            }

        })
        document.querySelector(`#${invalidArr[0]}`).focus()
        // Generic err message replaces input field specific messages
        labels.forEach(label => label.style.color = 'red')
        inputs.forEach(label => label.style.borderColor = 'red')
        document.querySelector('.dayInput span').textContent = 'Must be a valid date'
    }
}

function errMessages(e) {
    const el = `.${e.target.id}Input`
    if (!e.target.checkValidity()) {
        errMsg = 'This field is required'
        if (e.target.validity.rangeOverflow
            && e.target.id === 'year') {
            errMsg = 'Must be in the past'
        } else if (e.target.validity.rangeUnderflow
            && e.target.id === 'year') {
            errMsg = 'You\'re not that old'
        } else if (e.target.validity.rangeOverflow ||
            e.target.validity.rangeUnderflow &&
            e.target.id !== 'year') {
            errMsg = `Must be a valid ${e.target.id}`
        }
        document.querySelector(`${el} span`).textContent = errMsg
        document.querySelector(`${el} label`).style.color = 'red'
        document.querySelector(`${el} input`).style.borderColor = 'red'
    } else {
        document.querySelector(`${el} span`).textContent = ''
        document.querySelector(`${el} label`).style.color = 'hsl(0, 1%, 44%)'
        document.querySelector(`${el} input`).style.borderColor = 'hsl(0, 0%, 86%)'
    }
}

function calcDate() {
    const day = Number(formData.day)
    const month = Number(formData.month)
    const year = Number(formData.year)

    const userBirthday = new Date(year, month - 1, day)
    const todaysDate = Date.now();

    timeBetween = todaysDate - userBirthday

    const years = Math.floor(timeBetween / (365.25 * 24 * 60 * 60 * 1000));
    let days = Math.floor(timeBetween % (365.25 * 24 * 60 * 60 * 1000) / (1000 * 60 * 60 * 24));
    let months = 0

    if (days > 335) {
        months = 11
        days = days - 335
    }
    else if (days > 304) {
        months = 10
        days = days - 304
    }
    else if (days > 273) {
        months = 9
        days = days - 273
    }
    else if (days > 243) {
        months = 8
        days = days - 243
    }
    else if (days > 212) {
        months = 7
        days = days - 212
    }
    else if (days > 181) {
        months = 6
        days = days - 181
    }
    else if (days > 151) {
        months = 5
        days = days - 151
    }
    else if (days > 120) {
        months = 4
        days = days - 120
    }
    else if (days > 90) {
        months = 3
        days = days - 90
    }
    else if (days > 59) {
        months = 2
        days = days - 59
    }
    else if (days > 31) {
        months = 1
        days = days - 31
    }

    return [years, months, days]
}

// Calculates how long the output string will be 
// and adds the required amount of spinning numbers
function numOfNums(num, input) {
    let len = String(input).length
    let str = ''
    while (len) {
        str += `${num}`
        len--
    }
    return str
}



// Future date in current year
