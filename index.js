import { infixEvalution } from './stack.js'

// Dom Manipulations
const keyPad = document.querySelector('.calculator-operation__buttons')

const screen = document.getElementById('screen')

const historyContainer = document.querySelector('.history__content')
const historyIcon = document.getElementById('history-icon')

const calculatorOpeEle = document.querySelector('.calculator-operation')
const historyEle = document.querySelector('.history')

if(document.documentElement.clientWidth <= 700)
{
    historyEle.classList.add('hidden')
}

historyIcon.addEventListener('click',()=>{
    

    calculatorOpeEle.classList.toggle('hidden')
    historyEle.classList.toggle('hidden')
})

class Calculator {

    constructor()
    {
        showAllHistory()
    }

    getNumberForOperation() {
        let ind = screen.value.length - 1;
        let value = '';
        // until we did not get non digit
        while (ind >= 0 && !Object.is(Number(screen.value.at(ind)), NaN) || screen.value.at(ind) === '.') {
            value = screen.value.at(ind) + value;
            screen.value = screen.value.slice(0, -1);

            ind--;

        }
        return value
    }

    equals() {
        const result = infixEvalution(screen.value);

        
        // here result come so add to local storage
        if(!Number.isNaN(result))
        {
            saveHistoy(screen.value,result)
        }
        screen.value = Number.isNaN(result) ? "Error" : result;
    }

    clearScreen() {
        screen.value = ""
    }

    eraseLast() {
        screen.value = screen.value.slice(0, -1)
    }

    factorial(n) {
        let fact = 1;
        for (let i = 1; i <= n; i++) {
            fact *= i
        }
        return fact;
    }

    sqrt() {
        const result = this.getNumberForOperation();
        screen.value += Math.sqrt(result)
    }

    square() {
        const result = this.getNumberForOperation()
        screen.value += Math.pow(result, 2);
    }

    log() {
        const result = this.getNumberForOperation();
        screen.value += Math.log10(result)
    }

    powerOf10() {
        const result = this.getNumberForOperation();
        screen.value += Math.pow(10, result);
    }

    ceil()
    {
        const result = this.getNumberForOperation();
        screen.value += Math.ceil(result);
    }
}

const calculator = new Calculator()

//* attack and onClick event

keyPad.addEventListener('click', (e) => {

    const button = e.target.closest('.btn')
    if (!button) return;

    handleEvent(button.dataset.value)

    e.stopPropagation();
})


//* attach key event
document.addEventListener('keydown',(e)=>{

    const regex = /^[\d+\-/*().]+$/;

    if(regex.test(e.key))
    {
        handleEvent(e.key)
    }
    else if(e.key === 'Backspace')
    {
        handleEvent('erase')
    }
    else if(e.key === 'c' || e.key === 'C')
    {
        handleEvent('clear')
    }
    else if(e.key === 'Enter')
    {
        handleEvent('equals')
    }
})

//^ utility function

function handleEvent(value) {

    switch (value) {
        case "equals":
            calculator.equals();
            break;
        case "clear":
            calculator.clearScreen();
            break;
        case "erase":
            calculator.eraseLast();
            break;
        case "factorial":
            screen.value = screen.value.slice(0, -1) + +calculator.factorial(screen.value.at(-1))
            break;
        case 'square':
            calculator.square();
            break;
        case 'powerOf10':
            calculator.powerOf10();
            break;
        case 'ceil':
            calculator.ceil();
            break;
        default:
            screen.value += value;
    }
}

function saveHistoy(expression,result)
{
    const history = JSON.parse(localStorage.getItem('history')) || [];

    if(history.length > 15)
        history.shift();

    // save result
    history.push({expression,result})

    // show to screen
    updateHistory(expression,result)


    localStorage.setItem('history',JSON.stringify(history))
}

function updateHistory(expression,result)
{
    const div = document.createElement('div')
    
    const expressionEle = document.createElement('p');
    const resultEle = document.createElement('p');

    expressionEle.innerText = expression;
    resultEle.innerText = result

    div.append(expressionEle);
    div.append(resultEle);

    historyContainer.prepend(div)
}

function showAllHistory()
{
    const history = JSON.parse(localStorage.getItem('history'));
    if(history)
    {
        for(const {expression,result} of history)
        {
            updateHistory(expression,result)
        }
    }
}