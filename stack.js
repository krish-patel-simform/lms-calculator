Array.prototype.isEmpty = function () {
    return this.length === 0;
}
Array.prototype.top = function () {
    return this[this.length - 1];
}

// const stack = []
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


function isOperator(index) {
    return Boolean(precidence[operatorStack.at(index)])
}


function handleClosing() {
    while (operatorStack.top() !== '(') {
        const operator = operatorStack.pop()

        const operand2 = operandStack.pop()
        const operand1 = operandStack.pop()

        operandStack.push(evaluate(operator, operand1, operand2))
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
    }
    return result
}

function handlePrecidence(currentOperator) {
    //if top is operator
    // console.log("Inside an Handle Precidnce : is Operator", isOperator(operatorStack.length-1))
    if (isOperator(operatorStack.length - 1)) {
        // check for precidence
        // console.log("operator Top : ",operatorStack.top())
        if (precidence[currentOperator] < precidence[operatorStack.top()]) {
            while (!operatorStack.isEmpty() && precidence[operatorStack.top()] >= precidence[currentOperator]) {
                // pop from the operator stack and then twice pop from operand stack

                const operator = operatorStack.pop()
                const operand2 = operandStack.pop()
                const operand1 = operandStack.pop()

                // eveluate it and push it
                operandStack.push(evaluate(operator, operand1, operand2))

            }
        }
    }
    // console.log("going to push")
    operatorStack.push(currentOperator)
    // console.log(operatorStack)
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
        default:
            //here operand come so just append to the result
            operandStack.push(Number(char))
        // prefixExpression += char
    }
}

export function infixEvalution(expression) {
    operatorStack = new Array()
    operandStack = new Array()
    operandStack.push(0)

    let numberString = '';
    // for(const char of expression)
    // console.log("called : ",expression)
    for (let i = 0; i < expression.length; i++) {
        // console.log("i",i,expression[i]);

        // console.log("condition:",!precidence[expression[i]])
        // 
        // if (expression[i] === '(' || expression[i] === ')') {
        //     handleOperation(expression[i])
        // }
        // else if (!precidence[expression[i]]) {
        //     numberString += expression[i];
        //     if ((i < expression.length && precidence[expression[i + 1]]) || i === expression.length - 1) {
        //         // console.log(numberString)
        //         handleOperation(numberString)
        //         numberString = '';
        //     }
        // }
        // else {
        //     // console.log(expression[i])
        //     handleOperation(expression[i])
        // }

        if(!Number.isNaN(Number(expression[i])) || expression[i] === '.')
        {
            numberString += expression[i];
            if((i< expression.length && Number.isNaN(Number(expression[i+1])) && expression[i+1] !== '.') || i === expression.length - 1)
            {
                console.log("before handle:",numberString)
                handleOperation(numberString)
                numberString = '';
            }
        }
        else
        {
            handleOperation(expression[i])
        }
    }

    //check if operatorStack is Empty
    // console.log("Stack is Empty:",operatorStack.isEmpty())
    while (!operatorStack.isEmpty()) {
        // console.log("operatorStack is EMpty:",operatorStack.isEmpty())
        const operator = operatorStack.pop()

        const operand2 = operandStack.pop()
        const operand1 = operandStack.pop()

        operandStack.push(evaluate(operator, operand1, operand2))
    }

    console.log(operandStack.top())
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