import { useState } from 'react';

function useCount(startValue, minValue = null, maxValue = null) {
  const [count, setCount] = useState(startValue ?? null);

  const next = () => setCount((prev) => {
    const nextValue = Number.isNaN(parseInt(count, 10)) ? 0 : prev + 1;
    if (maxValue === null) return nextValue;
    return nextValue > maxValue ? prev : nextValue;
  });

  const previous = () => setCount((prev) => {
    const previousValue = Number.isNaN(parseInt(count, 10)) ? 0 : prev - 1;
    if (minValue === null) return previousValue;
    return previousValue < minValue ? prev : previousValue;
  });

  return {
    count, next, previous, setCount,
  };
}

export default useCount;
