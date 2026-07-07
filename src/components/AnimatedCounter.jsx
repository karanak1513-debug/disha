import React, { useEffect, useState } from "react";

export default function AnimatedCounter({ value, duration = 1000, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value) || 0;
    
    if (endValue === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}
