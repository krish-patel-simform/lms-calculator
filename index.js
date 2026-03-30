import {infixEvalution} from './stack.js'
 
// Dom Manipulations
const keyPad = document.querySelector('.calculator-operation__buttons')
 
const screen = document.getElementById('screen')
console.log(screen)
 
 
//* attack and onClick event
 
keyPad.addEventListener('click',(e)=>{
 
    const value = e.target.dataset.value;
   
    switch(value)
    {
        case "equals-":
            equals();
            break;
        case "clear":
            clearScreen()
            break;  
        case "erase":
            eraseLast();
            break;
        case "factorial":
            screen.value = screen.value.slice(0,-1) +  +factorial(screen.value.at(-1))
            break;
        case 'sqrt':
            sqrt();
            break;
        case 'log':
            log();
            break;
        case 'square':
            square();
            break;
        case 'powerOf10':
            powerOf10();
            break;
        default:
            screen.value += value;
    }
    console.log(value);
 
    // call the infix Evalurion
 
    e.stopPropagation();
},true)
 
//^ utility function
 
function getNumberForOperation()
{
    let ind = screen.value.length - 1;
    let value = '';
    console.log("called")
    // until we did not get non digit
    while(ind >= 0 && Number(screen.value.at(ind))!== NaN)
    {
        // console.log("before",screen.value)
        value = screen.value.at(-1) + value;
        // console.log("after",screen.value)
        screen.value = screen.value.slice(0,-1);
        // console.log("VAlue:",value)
        ind--;
    }
    return value
}
 
 
function equals()
{
    const result = infixEvalution(screen.value);
    console.log("result:" + result)
    screen.value = result;
}
 
function clearScreen()
{
    screen.value = ""
}
 
function eraseLast()
{
    screen.value = screen.value.slice(0,-1)
}
 
function factorial(n)
{
    let fact = 1;
    for(let i=1;i<=n;i++)
    {
        fact *= i
    }
    console.log("fact:s" + fact)
    return fact;
}
 
function sqrt()
{
    // let ind = screen.value.length - 1;
    // let value = '';
    // console.log("called")
    // // until we did not get non digit
    // while(ind >= 0 && Number(screen.value.at(ind)))
    // {
    //     // console.log("before",screen.value)
    //     value = screen.value.at(-1) + value;
    //     // console.log("after",screen.value)
    //     screen.value = screen.value.slice(0,-1);
    //     // console.log("VAlue:",value)
    //     ind--;
    // }
    // find the value
    const result = getNumberForOperation();
    screen.value += Math.sqrt(result)
}
 
function square()
{
    const result = getNumberForOperation()
    screen.value += Math.pow(result,2);
}
 
function log()
{
    const result = getNumberForOperation();
    screen.value += Math.log10(result)
}
 
function powerOf10()
{
    const result = getNumberForOperation();
    screen.value += Math.pow(10,result);
}