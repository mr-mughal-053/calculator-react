import { useEffect, useRef, useState } from 'react';
import './Calculator.css';

type Operator = '+' | '-' | '*' | '/';

interface Pending {
  value: number;
  op: Operator;
}

const MAX_LEN = 12;

function sanitize(n: number) {
  return String(Number.isFinite(n) ? +n.toPrecision(MAX_LEN) : '∞');
}

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [pending, setPending] = useState<Pending | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ---------------- helpers ---------------- */
  const put = (d: string) =>
    setDisplay(prev => (prev === '0' ? d : prev + d).slice(0, MAX_LEN));

  const dot = () =>
    setDisplay(prev => (prev.includes('.') ? prev : prev + '.'));

  const clear = () => {
    setDisplay('0');
    setPending(null);
  };

  const op = (o: Operator) => {
    setPending({ value: parseFloat(display), op: o });
    setDisplay('0');
  };

  const equals = () => {
    if (!pending) return;
    const curr = parseFloat(display);
    const { value, op } = pending;
    const math: Record<Operator, number> = {
      '+': value + curr,
      '-': value - curr,
      '*': value * curr,
      '/': curr === 0 ? Infinity : value / curr,
    };
    setDisplay(sanitize(math[op]));
    setPending(null);
  };

  /* ---------------- keyboard ---------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!wrapperRef.current?.contains(document.activeElement)) return;

      if (/\d/.test(e.key)) put(e.key);
      else if (['+', '-', '*', '/'].includes(e.key)) op(e.key as Operator);
      else if (e.key === 'Enter' || e.key === '=') equals();
      else if (e.key === '.') dot();
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clear();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const Btn = ({
    children,
    onClick,
    span = 1,
  }: {
    children: string;
    onClick: () => void;
    span?: 1 | 2 | 3;
  }) => (
    <button
      className={`btn ${span === 3 ? 'span-3' : span === 2 ? 'span-2' : ''}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div className="calc" ref={wrapperRef}>
      <output className="display" aria-live="polite">
        {display}
      </output>

      <div className="keys">
        <Btn span={3} onClick={clear}>
          AC
        </Btn>
        <Btn onClick={() => op('/')}>/</Btn>

        {[7, 8, 9].map(n => (
          <Btn key={n} onClick={() => put(String(n))}>
            {String(n)}
          </Btn>
        ))}
        <Btn onClick={() => op('*')}>*</Btn>

        {[4, 5, 6].map(n => (
          <Btn key={n} onClick={() => put(String(n))}>
            {String(n)}
          </Btn>
        ))}
        <Btn onClick={() => op('-')}>-</Btn>

        {[1, 2, 3].map(n => (
          <Btn key={n} onClick={() => put(String(n))}>
            {String(n)}
          </Btn>
        ))}
        <Btn onClick={() => op('+')}>+</Btn>

        <Btn span={2} onClick={() => put('0')}>
          0
        </Btn>
        <Btn onClick={dot}>.</Btn>
        <Btn onClick={equals}>=</Btn>
      </div>
    </div>
  );
};

export default Calculator;
