let currentInput = '';
let operation = '';
let result = '0';

const operationDisplay = document.getElementById('operation');
const resultDisplay = document.getElementById('result');

function updateDisplay() {
    operationDisplay.textContent = operation || '';
    resultDisplay.textContent = result;
}

function appendNumber(num) {
    if (currentInput === '0' && num === '0') return;
    currentInput += num;
    operation += num;
    result = currentInput;
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '' && operation === '' && op === '-') {
        currentInput = '-';
        operation = '-';
        result = '-';
        updateDisplay();
        return;
    }

    if (currentInput === '') return;
    
    const lastChar = operation.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        operation = operation.slice(0, -1) + op;
    } else {
        operation += op;
    }
    
    currentInput = '';
    result = '0';
    updateDisplay();
}

function appendDecimal() {
    if (currentInput === '') {
        currentInput = '0.';
        operation += '0.';
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
        operation += '.';
    }
    result = currentInput;
    updateDisplay();
}

function deleteChar() {
    if (operation === '') return;
    
    const lastChar = operation.slice(-1);
    operation = operation.slice(0, -1);
    
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentInput = getLastNumber(operation);
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    
    result = currentInput || '0';
    updateDisplay();
}

function getLastNumber(str) {
    const matches = str.match(/[0-9.]+$/);
    return matches ? matches[0] : '';
}

function clearDisplay() {
    currentInput = '';
    operation = '';
    result = '0';
    updateDisplay();
}

function calculate() {
    if (operation === '') return;
    
    try {
        const sanitizedOperation = operation.replace(/×/g, '*').replace(/÷/g, '/');
        
        const lastChar = sanitizedOperation.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            return;
        }
        
        const calculatedResult = evaluateExpression(sanitizedOperation);
        
        if (calculatedResult === Infinity || calculatedResult === -Infinity) {
            result = 'Error: División por 0';
            operation = '';
            currentInput = '';
        } else if (isNaN(calculatedResult)) {
            result = 'Error';
            operation = '';
            currentInput = '';
        } else {
            const roundedResult = Math.round(calculatedResult * 1000000000) / 1000000000;
            result = roundedResult.toString();
            operation = '';
            currentInput = result;
        }
        
        updateDisplay();
    } catch (error) {
        result = 'Error';
        operation = '';
        currentInput = '';
        updateDisplay();
    }
}

function evaluateExpression(expr) {
    const tokens = expr.match(/[+\-]?[0-9.]+|[+\-*/]/g);
    if (!tokens) return 0;

    const values = [];
    const ops = [];

    const precedence = {'+': 1, '-': 1, '*': 2, '/': 2};

    const applyOperation = (op, b, a) => {
        switch(op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
        }
    };

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (!isNaN(token)) {
            values.push(parseFloat(token));
        } else if (['+', '-', '*', '/'].includes(token)) {
            while (ops.length > 0 && precedence[ops[ops.length - 1]] >= precedence[token]) {
                const op = ops.pop();
                const b = values.pop();
                const a = values.pop();
                values.push(applyOperation(op, b, a));
            }
            ops.push(token);
        }
    }

    while (ops.length > 0) {
        const op = ops.pop();
        const b = values.pop();
        const a = values.pop();
        values.push(applyOperation(op, b, a));
    }

    return values[0];
}

updateDisplay();