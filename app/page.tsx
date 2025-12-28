'use client';

import { useState } from 'react';

interface HistoryItem {
  expression: string;
  result: string;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentExpression, setCurrentExpression] = useState('');

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setCurrentExpression('');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setCurrentExpression(`${inputValue} ${getOperationSymbol(nextOperation)}`);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      setCurrentExpression(`${newValue} ${getOperationSymbol(nextOperation)}`);
    } else {
      setCurrentExpression(`${display} ${getOperationSymbol(nextOperation)}`);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const getOperationSymbol = (op: string): string => {
    switch (op) {
      case '+':
        return '+';
      case '-':
        return '−';
      case '*':
        return '×';
      case '/':
        return '÷';
      default:
        return op;
    }
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const expression = `${previousValue} ${getOperationSymbol(operation)} ${inputValue}`;
      
      // 履歴に追加
      setHistory(prev => [...prev, { expression, result: String(newValue) }]);
      
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
      setCurrentExpression('');
    }
  };
//check comment
  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl p-6">
          {/* 計算履歴 */}
          {history.length > 0 && (
            <div className="mb-4 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">計算履歴</h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 rounded"
                >
                  クリア
                </button>
              </div>
              <div className="space-y-2">
                {history.slice().reverse().map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-700 rounded-lg p-3 text-sm shadow-sm"
                  >
                    <div className="text-slate-500 dark:text-slate-400 font-mono">
                      {item.expression} =
                    </div>
                    <div className="text-slate-800 dark:text-slate-100 font-semibold text-right font-mono">
                      {item.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 現在の式表示 */}
          {currentExpression && (
            <div className="mb-2 text-slate-500 dark:text-slate-400 text-lg font-mono text-right">
              {currentExpression}
            </div>
          )}

          {/* ディスプレイ */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-950 dark:to-slate-800 rounded-2xl p-6 mb-6 min-h-[120px] flex items-center justify-end shadow-inner">
            <div className="text-white text-5xl font-mono font-light overflow-x-auto w-full text-right">
              {display}
            </div>
          </div>

          {/* ボタングリッド */}
          <div className="grid grid-cols-4 gap-3">
            {/* クリアボタン */}
            <button
              onClick={clear}
              className="col-span-2 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              C
            </button>

            {/* 演算子ボタン */}
            <button
              onClick={() => performOperation('/')}
              className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              ÷
            </button>
            <button
              onClick={() => performOperation('*')}
              className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              ×
            </button>

            {/* 数字ボタン */}
            <button
              onClick={() => inputNumber('7')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              7
            </button>
            <button
              onClick={() => inputNumber('8')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              8
            </button>
            <button
              onClick={() => inputNumber('9')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              9
            </button>
            <button
              onClick={() => performOperation('-')}
              className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              −
            </button>

            <button
              onClick={() => inputNumber('4')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              4
            </button>
            <button
              onClick={() => inputNumber('5')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              5
            </button>
            <button
              onClick={() => inputNumber('6')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              6
            </button>
            <button
              onClick={() => performOperation('+')}
              className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              +
            </button>

            <button
              onClick={() => inputNumber('1')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              1
            </button>
            <button
              onClick={() => inputNumber('2')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              2
            </button>
            <button
              onClick={() => inputNumber('3')}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              3
            </button>
            <button
              onClick={handleEquals}
              className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-2xl font-semibold rounded-xl h-16 row-span-2 transition-all duration-150 shadow-lg active:shadow-md"
            >
              =
            </button>

            <button
              onClick={() => inputNumber('0')}
              className="col-span-2 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400 text-slate-800 dark:text-white text-2xl font-semibold rounded-xl h-16 transition-all duration-150 shadow-lg active:shadow-md"
            >
              .
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
