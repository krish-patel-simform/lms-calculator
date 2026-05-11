export { };
declare global {
    interface Array<T> {
        isEmpty(): boolean;
        top(): T | undefined;
    }
}

Array.prototype.isEmpty = function () {
    return this.length === 0;
};
Array.prototype.top = function () {
    return this[this.length - 1];
};

const precedence = {
    "+": 1,
    "-": 1,
    "/": 2,
    "*": 2,
    "%": 2,
    "√": 3,
    log: 3,
    ln: 3,
    'u-':3,
    "^": 4,
    "(": 0,
    ")": 0,
} as const;

const operaorOperands = {
    "+": 2,
    "-": 2,
    "*": 2,
    "/": 2,
    "^": 2,
    "%": 2,
    "√": 1,
    "log": 1,
    "ln": 1,
    'u-':1
} as const;

type RealOperatorType = keyof typeof operaorOperands;

type BinaryOperator = "+" | "-" | "*" | "/" | "%" | "^";
type UnaryOperator = "√" | "log" | "ln" | 'u-';
type OperatorType = BinaryOperator | UnaryOperator | "(" | ")";

let operandStack: number[];
let operatorStack: OperatorType[];
let lastTokenType: "openParen" | "closeParen" | "operator" | "number" | null =
    null;

function isRealOperator(op: OperatorType): op is RealOperatorType {
    return op in operaorOperands;
}

function isUnaryOperator(op: OperatorType): op is UnaryOperator {
    return op === "√" || op === "ln" || op === "log" || op === 'u-';
}

function isBinaryOperator(op: OperatorType): op is BinaryOperator {
    return (
        op === "+" ||
        op === "-" ||
        op === "*" ||
        op === "/" ||
        op === "%" ||
        op === "^"
    );
}

function isOperator(index: number): boolean {
    const op = operatorStack.at(index);
    if (!op) return false;

    return Boolean(precedence[op as keyof typeof precedence]);
}

function handleClosing() {
    if (operatorStack.top() === "(" && lastTokenType === "openParen") {
        // check if previous token was '(' → means empty ()
        operandStack.push(NaN);
        throw new Error("Invalid Expression")
    }

    while (!operatorStack.isEmpty() && operatorStack.top() !== "(") {
        const operator = operatorStack.pop();
        if (!operator || !isRealOperator(operator)) continue;

        if (isRealOperator(operator) && operaorOperands[operator] >= 2) {
            if (operandStack.length >= 2 && isBinaryOperator(operator)) {
                const operand2 = operandStack.pop();
                const operand1 = operandStack.pop();

                // throw an error
                if (operand1 == undefined || operand2 == undefined)
                    throw new Error("Operand 1 or Operand 2 is required for binary operator");

                operandStack.push(evaluate(operator, operand1, operand2));
            } else {
                // operandStack.push(NaN);
                throw new Error("Operand 1 or Operand 2 is required for binary operator")
                // break;
            }
        } else {
            const operand2 = operandStack.pop();
            if (operand2 == undefined) {
                throw new Error("One Operand is required for unary operator")
            }
            // operandStack.push(evaluate(operator, undefined, operand2))
            if (isUnaryOperator(operator)) {
                operandStack.push(evaluate(operator, operand2));
            }
        }
    }
    operatorStack.pop();
}

function evaluate(
    operator: BinaryOperator,
    operand1: number,
    operand2: number,
): number;
function evaluate(operator: UnaryOperator, operand1: number): number;
function evaluate(operator: BinaryOperator | UnaryOperator, operand1: number, operand2?: number) {
    let result;

    if (isBinaryOperator(operator) && operand2 != undefined) {
        switch (operator) {
            case "+":
                result = operand1 + operand2;
                break;
            case "-":
                result = operand1 - operand2;
                break;
            case "*":
                result = operand1 * operand2;
                break;
            case "/":
                result = Number((operand1 / operand2).toFixed(2));
                break;
            case "%":
                result = operand1 % operand2;
                break;
            case "^":
                result = operand1 ** operand2;
                break;
        }
    } else {
        switch (operator) {
            case "√":
                result = Math.sqrt(operand1);
                break;
            case "log":
                result = Math.log10(operand1);
                break;
            case "ln":
                result = Math.log(operand1);
                break;
            case 'u-':
                result = -operand1
                break;
        }
    }
    return result;
}

function handlePrecedence(currentOperator: OperatorType) {
    if (isOperator(operatorStack.length - 1)) {
        // check for precidence
        const topOp = operatorStack.top();
        if (topOp != undefined) {
            if (precedence[currentOperator] <= precedence[topOp]) {
                while (
                    !operatorStack.isEmpty() &&
                    precedence[topOp] >= precedence[currentOperator]
                ) {
                    const operator = operatorStack.pop();
                    if (!operator) break;

                    if (isRealOperator(operator) && operaorOperands[operator] >= 2) {
                        if (operandStack.length >= 2 && isBinaryOperator(operator)) {
                            const operand2 = operandStack.pop();
                            const operand1 = operandStack.pop();

                            if (operand1 == undefined || operand2 == undefined)
                                throw new Error("Operand 1 or Operand 2 is required for binary operator");

                            operandStack.push(evaluate(operator, operand1, operand2));
                        } else {
                            // stop futher call
                            operandStack.push(NaN);
                            break;
                        }
                    } else if (
                        isRealOperator(operator) &&
                        operaorOperands[operator] == 1 &&
                        isUnaryOperator(operator)
                    ) {
                        const operand2 = operandStack.pop();
                        if (operand2 == undefined) {
                            throw new Error("One Operand is required for unary operator")
                        }
                        operandStack.push(evaluate(operator, operand2));
                    }
                }
            }
        }
    }
    operatorStack.push(currentOperator);
}

function handleOperation(char: string) {
    // console.log("char is comint to handleOperation",char)
    switch (char) {
        case "(":
            if (lastTokenType === "number" || lastTokenType === "closeParen") {
                handlePrecedence("*"); // 4(4) → 4*(4)
            }
            operatorStack.push("(");
            lastTokenType = "openParen";
            break;
        case ")":
            handleClosing();
            lastTokenType = "closeParen";
            break;
        case "^":
            operatorStack.push("^");
            lastTokenType = "operator";
            break;
        case "*":
        case "/":
        case "%":
            handlePrecedence(char);
            lastTokenType = "operator";
            break;
        case "+":
        case "-":
                        // unary
            if(lastTokenType == 'operator' || lastTokenType == 'openParen' || lastTokenType == null)
            {
                // convert unary to binary
                if(char === '+')
                    return;

                if(char === '-')
                {   
                    operatorStack.push('u-')
                    lastTokenType = 'operator'
                    return;
                }

            }
            handlePrecedence(char);
            lastTokenType = "operator";
            break;
        case "√":
        case "log":
        case "ln":
            if (lastTokenType === "number" || lastTokenType === "closeParen") {
                handlePrecedence("*");
            }
            
            operatorStack.push(char);
            lastTokenType = "operator";
            break;
        default:
            if (lastTokenType === "closeParen") {
                handlePrecedence("*"); // (4)5 → (4)*5
            }
            operandStack.push(Number(char));
            lastTokenType = "number";
            break;
    }
    // console.log("After handle operation operandStack:",operandStack)
    // console.log("After handle operation operatorStack:",operatorStack)
}

export function infixEvalution(expression: string) {
    operatorStack = new Array();
    operandStack = new Array();
    lastTokenType = null;
    // operandStack.push(0);

    let numberString = "";
    const charRegex = /^[a-zA-Z]+$/;
    let charString = "";

    // console.log("Start Evaluating...")

    for (let i = 0; i < expression.length; i++) {
        if (!Number.isNaN(Number(expression[i])) || expression[i] === ".") {
            numberString += expression[i];
            if (
                (
                    // i < expression.length &&
                    Number.isNaN(Number(expression[i + 1])) &&
                    expression[i + 1] !== ".") ||
                i === expression.length - 1
            ) {
                if(charString)
                {
                    handleOperation(charString)
                    charString = ''
                }
                handleOperation(numberString);
                numberString = "";
            }
        } else {
            const char = expression[i];
            if (char != undefined) {
                if (charRegex.test(char)) {
                    //append it
                    charString += char;
                    console.log(charString)
                } else {
                    if (charString) {
                        // push to operatorUnaryOperator
                        handleOperation(charString);
                        // console.log("final charString:" + charString)
                        charString = "";
                    }
                    handleOperation(char);
                }
            }
        }
    }

    while (!operatorStack.isEmpty()) {
        const operator = operatorStack.pop();

        if(!operator || !isRealOperator(operator))
            throw new Error("Invalid Expression")

        if (operaorOperands[operator] >= 2) {
            if (operandStack.length >= 2 && isBinaryOperator(operator)) {
                const operand2 = operandStack.pop();
                const operand1 = operandStack.pop();

                if (operand1 == undefined || operand2 == undefined)
                    throw new Error("Operand 1 or Operand 2 is required for binary operator");
                
                operandStack.push(evaluate(operator, operand1, operand2));
            } else {
                operandStack.push(NaN);
                break;
            }
        } else {
            const operand2 = operandStack.pop();
            if (operand2 == undefined) {
                throw new Error("One Operand is required for unary operator")
            }

            if (isUnaryOperator(operator)) {
                operandStack.push(evaluate(operator, operand2));
            }
        }
    }
    // cehck array that did not contains NaN
    const result = operandStack.top()

    if(result == undefined)
        throw new Error("Invalid Expression")

    if (operandStack.some((ele) => Number.isNaN(ele))) {
        throw new Error("Invalid Expression");
    }
    return result;
}
