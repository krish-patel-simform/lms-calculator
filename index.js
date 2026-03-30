import { infixEvalution } from './stack.js'

// Dom Manipulations
const keyPad = document.querySelector('.calculator-operation__buttons')

const screen = document.getElementById('screen')
console.log(screen)


class Calculator {

    getNumberForOperation() {
        let ind = screen.value.length - 1;
        let value = '';
        console.log("called")
        // until we did not get non digit
        while (ind >= 0 && !Object.is(Number(screen.value.at(ind)), NaN)) {
            console.log("before", screen.value)
            value = screen.value.at(ind) + value;
            screen.value = screen.value.slice(0, -1);
            console.log("after", screen.value)
            console.log("VAlue:", value)
            ind--;
        }
        return value
    }


    equals() {
        const result = infixEvalution(screen.value);
        console.log("result:" + result);
        console.log("type of result:",typeof result)
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
        console.log("fact:s" + fact)
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

    console.log(e)


    const regex = /^[\d+\-/*().]+$/;
    console.log(regex.test(e.key))
    if(regex.test(e.key))
    {
        console.log("regex is true")
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
    // const value = button.dataset.value;

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
        case 'sqrt':
            calculator.sqrt();
            break;
        case 'log':
            calculator.log();
            break;
        case 'square':
            calculator.square();
            break;
        case 'powerOf10':
            calculator.powerOf10();
            break;
        default:
            screen.value += value;
    }
    console.log(value);
}


//^ pending task ?
// (1/2)
//e
//key event handle
//.
// mod and [x]