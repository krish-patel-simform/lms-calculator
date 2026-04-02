Array.prototype.isEmpty = function () {
    return this.length === 0;
}
Array.prototype.top = function () {
    return this[this.length - 1];
}

let operandStack;
let operatorStack;

const precidence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '*': 2,
    '%': 2,
    '^': 3,
    '(': 0,
    ')': 0
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
    return Boolean(precidence[operatorStack.at(index)])
}


function handleClosing() {
    while (operatorStack.top() !== '(') {
        const operator = operatorStack.pop()

        const operand2 = operandStack.pop()
        if (operaorOperands[operator] >= 2) {
            const operand1 = operandStack.pop()
            operandStack.push(evaluate(operator, operand1, operand2))
        }
        else {
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

function handlePrecidence(currentOperator) {

    if (isOperator(operatorStack.length - 1)) {

        // check for precidence
        if (precidence[currentOperator] <= precidence[operatorStack.top()]) {
            while (!operatorStack.isEmpty() && precidence[operatorStack.top()] >= precidence[currentOperator]) {
        
                const operator = operatorStack.pop()
                const operand2 = operandStack.pop()
        
                if (operaorOperands[operator] >= 2) {
                    const operand1 = operandStack.pop()
                    operandStack.push(evaluate(operator, operand1, operand2))
                }
                else {
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
            handlePrecidence(char)
            break;
        case '+':
        case '-':
            handlePrecidence(char)
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
            console.log("after Pushing :", operandStack)
    }
}

export function infixEvalution(expression) {
    operatorStack = new Array()
    operandStack = new Array()
    operandStack.push(0)
    console.log(expression.length)

    let numberString = '';
    const charRegex = /^[a-zA-Z]+$/;
    let charString = '';

    for (let i = 0; i < expression.length; i++) {
        
        if (!Number.isNaN(Number(expression[i])) || expression[i] === '.') {
            numberString += expression[i];
            if ((i < expression.length && Number.isNaN(Number(expression[i + 1])) && expression[i + 1] !== '.') || i === expression.length - 1) {
                console.log("before handle:", numberString)
                handleOperation(numberString)
                numberString = '';
            }
        }
        else {
            if (charRegex.test(expression[i])) {
                //append it 
                console.log("regex called", expression[i])
                charString += expression[i];
            }
            else {
                if (charString) {
                    // push to operator
                    handleOperation(charString)
                    charString = '';
                }
                // check if function is there so first push it then push operator 

                console.log("operator found:", expression[i])
                handleOperation(expression[i])
            }
        }
    }

    // console.log(operatorStack)
    // console.log(operandStack)
    //check if operatorStack is Empty
    // console.log("Stack is Empty:",operatorStack.isEmpty())
    
    while (!operatorStack.isEmpty()) {
        console.log("operatorStack is EMpty:", operatorStack.isEmpty())
        const operator = operatorStack.pop()

        const operand2 = operandStack.pop()
        // const operand1 = operandStack.pop()
        
        
        // console.log(operator, operand1, operand2)
        // operandStack.push(evaluate(operator, operand1, operand2))
        if(operaorOperands[operator] >= 2)
        {
            const operand1 = operandStack.pop()
            operandStack.push(evaluate(operator, operand1, operand2))
        }
        else
        {
            operandStack.push(evaluate(operator, undefined, operand2))
        }
    }

    console.log("Answer:",operandStack.top())
    return operandStack.top();
}

// infixEvalution("5+3")
// infixEvalution("5+3*2")
// infixEvalution("((5*2+3)+(2-3+5))")
// infixEvalution("-5")
// infixEvalution("((5*2+3)+(2-3*5))")

// infixEvalution("(1/2)")
// infixEvalution("2.5+2.5")

//* case to be handle
//! -89+89 ?
//^ handle . case (might be handled)
//! (1/2)
//! handle unary with binary 

