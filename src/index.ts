import { infixEvalution } from './stack.ts'

// Dom Manipulations
const keyPad = document.querySelector<HTMLDivElement>('.calculator-operation__buttons')!

const screen = document.querySelector<HTMLInputElement>('#screen')!

const historyContainer = document.querySelector<HTMLDivElement>('.history__content')!

const historyIcon = document.querySelector<HTMLImageElement>('#history-icon')!

const container = document.querySelector<HTMLDivElement>('.container')!;


historyIcon.addEventListener('click',()=>{
    
    container.classList.toggle('show-history');
})

class Calculator {

    constructor()
    {
        showAllHistory()
    }

    getNumberForOperation():number {
        let ind = screen.value.length - 1;
        let value = '';
        // until we did not get non digit
        while (ind >= 0 && !Object.is(Number(screen.value.at(ind)), NaN) || screen.value.at(ind) === '.') {
            value = screen.value.at(ind) + value;
            screen.value = screen.value.slice(0, -1);

            ind--;

        }
        return Number(value)
    }

    equals() {
        try {
            const result = infixEvalution(screen.value);
            console.log("index.js called")
            
            // here result come so add to local storage
            if(!Number.isNaN(result) && result != null)
            {
                saveHistoy(screen.value,result.toString())
                screen.value =  result.toString();
            }
            
        } catch (error) {
            console.log(error)
            screen.value = ""
            screen.setAttribute('placeholder',"Error") 
        }
    }

    clearScreen() {
        screen.value = ""
        screen.setAttribute('placeholder',"0") 
    }

    eraseLast() {
        screen.value = screen.value.slice(0, -1)
    }

    factorial() {
        const result = this.getNumberForOperation();
        let fact = 1;
        for (let i = 1; i <= result; i++) {
            fact *= i
        }
        return fact;
    }

    square() {
        const result = this.getNumberForOperation()
        if(result)
            screen.value += Math.pow(result, 2);
        else
            screen.setAttribute('placeholder',"Error")
    }

    powerOf10() {
        const result = this.getNumberForOperation();
        if(result)
            screen.value += Math.pow(10, result);
        else
            screen.setAttribute('placeholder',"Error")
    }

    ceil()
    {
        const result = this.getNumberForOperation();
        if(result)
            screen.value += Math.ceil(result);
        else
            screen.setAttribute('placeholder',"Error")

    }
}

const calculator = new Calculator()

//*onClick event

keyPad.addEventListener('click', (e:PointerEvent) => {

    const target = e.target as HTMLElement;

    if(!target)
        return


    const button = target.closest<HTMLButtonElement>('.btn')
    if (!button) return;

    const type = button.dataset.value
    if(type)
    {
        console.log("click event called")
        handleEvent(type)
    }
    e.stopPropagation();
})


//* attach key event
document.addEventListener('keydown',(e)=>{

    if(e.key === 'Enter')
    {
        handleEvent('equals')
    }
})

//^ utility function

function handleEvent(value:string) {

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
            screen.value = screen.value.slice(0, -1) +  +calculator.factorial()
            // screen.value +=  +calculator.factorial()
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

function saveHistoy(expression:string,result:string)
{
    const history = JSON.parse(localStorage.getItem('history')?? "[]") ;

    if(history.length > 15)
        history.shift();

    // save result
    history.push({expression,result})

    // show to screen
    updateHistory(expression,result)


    localStorage.setItem('history',JSON.stringify(history))
}

function updateHistory(expression:string,result:string)
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
    const history = JSON.parse(localStorage.getItem('history') ?? "[]");
    
    for(const {expression,result} of history)
    {
        updateHistory(expression,result)
    }
}