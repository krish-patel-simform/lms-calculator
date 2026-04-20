Array.prototype.isEmpty = function () {
    return this.length === 0;
}
Array.prototype.top = function () {
    return this[this.length - 1];
}

let operandStack;
let operatorStack;

const precedence = {
    '+': 1,
    '-': 1,
    '/': 2,
    '*': 2,
    '%': 2,
    '√':3,
    '^': 4,
    '(': 0,
    ')': 0,
}

const operaorOperands = {
    '+': 2,
    '-': 2,
    '*': 2,
    '/': 2,
    '^' : 2,
    '%': 2,
    '√': 1,
    'log': 1,
    'ln':1,
}

function isOperator(index) {
    return Boolean(precedence[operatorStack.at(index)])
}


function handleClosing() {
    while (operatorStack.top() !== '(') {
        const operator = operatorStack.pop()

        if (operaorOperands[operator] >= 2) {
            if(operandStack.length > 2)
            {
                const operand2 = operandStack.pop()
                const operand1 = operandStack.pop()
                operandStack.push(evaluate(operator, operand1, operand2))
            }
            else
            {
                // how to stop futher thing 
                operandStack.push(NaN)
                break;
            }
        }
        else {
            const operand2 = operandStack.pop()
            operandStack.push(evaluate(operator, undefined, operand2))
        }

    }
    operatorStack.pop()
}

function evaluate(operator, operand1, operand2) {
    let result;
    switch (operator) {
        case '+':
            result = operand1 + operand2
            break;
        case '-':
            result = operand1 - operand2
            break;
        case '*':
            result = operand1 * operand2
            break;
        case '/':
            result = Number((operand1 / operand2).toFixed(2))
            break;
        case '%':
            result = (operand1 % operand2)
            break;
        case '^':
            result = operand1 ** operand2
            break;
        case '√':
            result = Math.sqrt(operand2);
            break;
        case 'log':
            result = Math.log10(operand2);
            break;
        case 'ln':
            result = Math.log(operand2);
            break;
    }
    return result
}

function handlePrecedence(currentOperator) {

    if (isOperator(operatorStack.length - 1)) {
        // check for precidence
        if (precedence[currentOperator] <= precedence[operatorStack.top()]) {
            while (!operatorStack.isEmpty() && precedence[operatorStack.top()] >= precedence[currentOperator]) {
        
                const operator = operatorStack.pop()
                
                if (operaorOperands[operator] >= 2 ) {
                    if(operandStack.length > 2)
                    {
                        const operand2 = operandStack.pop()
                        const operand1 = operandStack.pop()
                        operandStack.push(evaluate(operator, operand1, operand2))
                    }
                    else 
                    {
                        // stop futher call 
                        operandStack.push(NaN);
                        break;
                    }
                }
                else if(operaorOperands[operator] == 1){
                    const operand2 = operandStack.pop()
                    operandStack.push(evaluate(operator, undefined, operand2))
                }

            }
        }
    }
    operatorStack.push(currentOperator)
    
}

function handleOperation(char) {
    switch (char) {
        case '(':
            operatorStack.push('(')
            break;
        case ')':
            handleClosing()
            break;
        case '^':
            operatorStack.push('^')
            break;
        case '*':
        case '/':
        case '%':
            handlePrecedence(char)
            break;
        case '+':
        case '-':
            handlePrecedence(char)
            break;
        case '√':
            operatorStack.push(char)
            break;
        case 'log':
            operatorStack.push(char);
            break;
        case 'ln':
            operatorStack.push(char)
            break;
        default:
            operandStack.push(Number(char))
    }
}

export function infixEvalution(expression) {
    operatorStack = new Array()
    operandStack = new Array()
    operandStack.push(0)

    let numberString = '';
    const charRegex = /^[a-zA-Z]+$/;
    let charString = '';

    for (let i = 0; i < expression.length; i++) {
        
        if (!Number.isNaN(Number(expression[i])) || expression[i] === '.') {
            numberString += expression[i];
            if ((i < expression.length && Number.isNaN(Number(expression[i + 1])) && expression[i + 1] !== '.') || i === expression.length - 1) {
                handleOperation(numberString)
                numberString = '';
            }
        }
        else {
            if (charRegex.test(expression[i])) {
                //append it 
                charString += expression[i];
            }
            else {
                if (charString) {
                    // push to operator
                    handleOperation(charString)
                    charString = '';
                }
                handleOperation(expression[i])
            }
        }
    }
    
    while (!operatorStack.isEmpty()) {
        const operator = operatorStack.pop()
       
        if(operaorOperands[operator] >= 2)
        {
            if(operandStack.length >2)
            {
                const operand2 = operandStack.pop()
                const operand1 = operandStack.pop()
                operandStack.push(evaluate(operator, operand1, operand2))
            }
            else
            {
                operandStack.push(NaN)
                break;
            }
        }
        else
        {
            const operand2 = operandStack.pop()
            operandStack.push(evaluate(operator, undefined, operand2))
        }
    }
    // cehck array that did not contains NaN
    if(operandStack.some((ele)=> Number.isNaN(ele)))
    {
        return NaN
    }
    return operandStack.top();
}


