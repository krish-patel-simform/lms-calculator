Array.prototype.isEmpty = function () {
    return this.length === 0;
}
Array.prototype.top = function () {
    return this[this.length - 1];
}

let operandStack;
let operatorStack;
let lastTokenType = null;

const precedence = {
    '+': 1,
    '-': 1,
    '/': 2,
    '*': 2,
    '%': 2,
    '√': 3,
    '^': 4,
    '(': 0,
    ')': 0,
}

const operaorOperands = {
    '+': 2,
    '-': 2,
    '*': 2,
    '/': 2,
    '^': 2,
    '%': 2,
    '√': 1,
    'log': 1,
    'ln': 1,
}

function isOperator(index) {
    return Boolean(precedence[operatorStack.at(index)])
}
function handleClosing() {

    if (operatorStack.top() === '(') {
        // check if previous token was '(' → means empty ()
        if (lastTokenType === 'openParen') {
            operandStack.push(NaN);
            return;
        }
    }

    while (!operatorStack.isEmpty() && operatorStack.top() !== '(') {
        const operator = operatorStack.pop()

        if (operaorOperands[operator] >= 2) {
            if (operandStack.length >= 3) {
                const operand2 = operandStack.pop()
                const operand1 = operandStack.pop()
                operandStack.push(evaluate(operator, operand1, operand2))
            }
            else {
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

                if (operaorOperands[operator] >= 2) {
                    if (operandStack.length >= 3) {
                        const operand2 = operandStack.pop()
                        const operand1 = operandStack.pop()
                        operandStack.push(evaluate(operator, operand1, operand2))
                    }
                    else {
                        // stop futher call 
                        operandStack.push(NaN);
                        break;
                    }
                }
                else if (operaorOperands[operator] == 1) {
                    const operand2 = operandStack.pop()
                    if (operand2 === undefined) {
                        operandStack.push(NaN);
                        break;
                    }
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
            if (lastTokenType === 'number' || lastTokenType === 'closeParen') {
                handlePrecedence('*'); // 4(4) → 4*(4)
            }
            operatorStack.push('(');
            lastTokenType = 'openParen';
            break;
        case ')':
            handleClosing()
            lastTokenType = 'closeParen'
            break;
        case '^':
            operatorStack.push('^')
            lastTokenType = 'operator';
            break;
        case '*':
        case '/':
        case '%':
            handlePrecedence(char)
            lastTokenType = 'operator';
            break;
        case '+':
        case '-':
            handlePrecedence(char)
            lastTokenType = 'operator';
            break;
        case '√':
        case 'log':
        case 'ln':
            if (lastTokenType === 'number' || lastTokenType === 'closeParen') {
                handlePrecedence('*');
            }
            operatorStack.push(char);
            lastTokenType = 'operator';
            break;
        default:
            if (lastTokenType === 'closeParen') {
                handlePrecedence('*'); // (4)5 → (4)*5
            }
            operandStack.push(Number(char));
            lastTokenType = 'number';
            break;
    }
}

export function infixEvalution(expression) {
    operatorStack = new Array()
    operandStack = new Array()
    lastTokenType = null
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

        if (operaorOperands[operator] >= 2) {
            if (operandStack.length >= 3) {
                const operand2 = operandStack.pop()
                const operand1 = operandStack.pop()
                operandStack.push(evaluate(operator, operand1, operand2))
            }
            else {
                operandStack.push(NaN)
                break;
            }
        }
        else {
            const operand2 = operandStack.pop()
            if (operand2 === undefined) {
                operandStack.push(NaN);
                break;
            }
            operandStack.push(evaluate(operator, undefined, operand2))
        }
    }
    // cehck array that did not contains NaN
    if (operandStack.some((ele) => Number.isNaN(ele))) {
        return NaN
    }
    return operandStack.top();
}

