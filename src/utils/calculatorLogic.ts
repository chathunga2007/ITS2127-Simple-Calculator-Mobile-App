// Calculator helper functions and math logic

// Format number with commas (e.g. 1000000 -> 1,000,000)
export function formatNumberWithCommas(numStr: string): string {
  if (!numStr || numStr === 'Error' || numStr === 'Cannot divide by 0') return numStr;
  
  const [integerPart, decimalPart] = numStr.split('.');
  const isNegative = integerPart.startsWith('-');
  const cleanInt = isNegative ? integerPart.slice(1) : integerPart;

  const formattedInt = cleanInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (isNegative ? '-' : '') + formattedInt + (decimalPart !== undefined ? '.' + decimalPart : '');
}

// Format each number inside the expression for display
export function formatExpression(expression: string): string {
  if (!expression) return '0';
  
  return expression
    .split(' ')
    .map((token) => {
      // Check if token is a valid number
      if (/^-?\d+(\.\d*)?$/.test(token)) {
        return formatNumberWithCommas(token);
      }
      return token;
    })
    .join(' ');
}

// Fix JavaScript floating point rounding issues (e.g. 0.1 + 0.2 = 0.3)
export function roundAccurately(num: number): number {
  return parseFloat(num.toFixed(10));
}

// Calculate the result based on standard BODMAS / operator precedence
export function calculateExpression(rawExpr: string): { success: boolean; result: string; error?: string } {
  if (!rawExpr || rawExpr.trim() === '') {
    return { success: true, result: '0' };
  }

  // Remove trailing operators if user pressed equals
  let expr = rawExpr.trim();
  while (expr.endsWith('+') || expr.endsWith('−') || expr.endsWith('-') || expr.endsWith('×') || expr.endsWith('*') || expr.endsWith('÷') || expr.endsWith('/')) {
    expr = expr.slice(0, -1).trim();
  }

  if (!expr) {
    return { success: true, result: '0' };
  }

  try {
    // Replace visual symbols with standard math operators
    const normalized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    const tokens = normalized.split(' ').filter((t) => t.length > 0);
    if (tokens.length === 0) {
      return { success: true, result: '0' };
    }

    const numbers: number[] = [];
    const operators: string[] = [];

    // Separate tokens into numbers and operators
    for (const token of tokens) {
      if (['+', '-', '*', '/'].includes(token)) {
        operators.push(token);
      } else {
        const val = parseFloat(token);
        if (isNaN(val)) {
          return { success: false, result: 'Error', error: 'Invalid number' };
        }
        numbers.push(val);
      }
    }

    if (numbers.length === 0) {
      return { success: true, result: '0' };
    }

    // Step 1: Handle multiplication and division first
    const intermediateNumbers: number[] = [numbers[0]];
    const remainingOperators: string[] = [];

    for (let i = 0; i < operators.length; i++) {
      const op = operators[i];
      const nextNum = numbers[i + 1];

      if (op === '*' || op === '/') {
        const prevNum = intermediateNumbers.pop()!;
        if (op === '/' && nextNum === 0) {
          return { success: false, result: 'Cannot divide by 0', error: 'Division by zero' };
        }
        const res = op === '*' ? prevNum * nextNum : prevNum / nextNum;
        intermediateNumbers.push(roundAccurately(res));
      } else {
        remainingOperators.push(op);
        intermediateNumbers.push(nextNum);
      }
    }

    // Step 2: Handle addition and subtraction
    let finalResult = intermediateNumbers[0];
    for (let i = 0; i < remainingOperators.length; i++) {
      const op = remainingOperators[i];
      const nextNum = intermediateNumbers[i + 1];

      if (op === '+') {
        finalResult = roundAccurately(finalResult + nextNum);
      } else if (op === '-') {
        finalResult = roundAccurately(finalResult - nextNum);
      }
    }

    if (isNaN(finalResult) || !isFinite(finalResult)) {
      return { success: false, result: 'Error', error: 'Calculation error' };
    }

    return {
      success: true,
      result: finalResult.toString(),
    };
  } catch {
    return { success: false, result: 'Error', error: 'Calculation failed' };
  }
}

// Handle digit button presses (0-9, 00)
export function handleDigitPress(current: string, digit: string, isResultShowing: boolean): string {
  if (isResultShowing) {
    return digit === '00' ? '0' : digit;
  }

  if (current === '0') {
    if (digit === '0' || digit === '00') return '0';
    return digit;
  }

  // Check last token
  const tokens = current.split(' ');
  const lastToken = tokens[tokens.length - 1];

  // If typing after a single 0
  if (lastToken === '0') {
    if (digit === '0' || digit === '00') return current;
    tokens[tokens.length - 1] = digit;
    return tokens.join(' ');
  }

  // Limit max length of single number
  if (lastToken.replace(/[^0-9]/g, '').length >= 15) {
    return current;
  }

  return current + digit;
}

// Handle operator button presses (+, −, ×, ÷)
export function handleOperatorPress(
  current: string,
  operator: string,
  isResultShowing: boolean,
  lastResult: string
): string {
  // If result is currently showing, continue calculating from that result
  if (isResultShowing) {
    const base = lastResult && lastResult !== 'Error' && lastResult !== 'Cannot divide by 0' ? lastResult : '0';
    return `${base} ${operator} `;
  }

  if (!current || current === '0') {
    return `0 ${operator} `;
  }

  // If last entry was already an operator, replace it with the new one
  if (current.endsWith(' ')) {
    const parts = current.trimEnd().split(' ');
    parts[parts.length - 1] = operator;
    return parts.join(' ') + ' ';
  }

  return `${current} ${operator} `;
}

// Handle decimal point button press
export function handleDecimalPress(current: string, isResultShowing: boolean): string {
  if (isResultShowing || !current || current === '0') {
    return '0.';
  }

  const tokens = current.split(' ');
  const lastToken = tokens[tokens.length - 1];

  // If right after an operator
  if (lastToken === '') {
    return current + '0.';
  }

  // Do not allow multiple decimals in the same number
  if (lastToken.includes('.')) {
    return current;
  }

  return current + '.';
}

// Handle backspace / delete button press
export function handleBackspacePress(current: string, isResultShowing: boolean): string {
  if (isResultShowing || !current || current === '0') {
    return '0';
  }

  // If it ends with an operator like " + "
  if (current.endsWith(' ')) {
    const trimmed = current.trimEnd();
    const lastSpaceIndex = trimmed.lastIndexOf(' ');
    if (lastSpaceIndex === -1) {
      return '0';
    }
    return trimmed.substring(0, lastSpaceIndex).trimEnd();
  }

  // If only one character left
  if (current.length <= 1) {
    return '0';
  }

  return current.slice(0, -1);
}

// Handle sign toggle (±) button press
export function handleSignToggle(current: string, isResultShowing: boolean, lastResult: string): string {
  if (isResultShowing) {
    if (lastResult === '0' || lastResult === 'Error' || lastResult === 'Cannot divide by 0') return '0';
    const num = parseFloat(lastResult);
    return isNaN(num) ? '0' : (-num).toString();
  }

  const tokens = current.split(' ');
  const lastToken = tokens[tokens.length - 1];

  if (!lastToken || lastToken === '0') return current;

  // Toggle negative sign on the current number
  if (/^-?\d+(\.\d*)?$/.test(lastToken)) {
    if (lastToken.startsWith('-')) {
      tokens[tokens.length - 1] = lastToken.slice(1);
    } else {
      tokens[tokens.length - 1] = '-' + lastToken;
    }
    return tokens.join(' ');
  }

  return current;
}

// Handle percentage (%) button press
export function handlePercentagePress(current: string, isResultShowing: boolean, lastResult: string): string {
  if (isResultShowing) {
    const num = parseFloat(lastResult);
    if (isNaN(num)) return '0';
    return roundAccurately(num / 100).toString();
  }

  const tokens = current.split(' ');
  const lastToken = tokens[tokens.length - 1];

  if (!lastToken || lastToken === '0') return current;

  const num = parseFloat(lastToken);
  if (!isNaN(num)) {
    tokens[tokens.length - 1] = roundAccurately(num / 100).toString();
    return tokens.join(' ');
  }

  return current;
}
