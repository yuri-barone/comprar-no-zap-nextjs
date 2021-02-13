import { useState, useEffect } from 'react';
import {
  addDays, differenceInSeconds, setHours, setMinutes, setSeconds,
} from 'date-fns';

const useChrono = ():string => {
  const [remaining, setRemaining] = useState<string>('');

  const calcRemainingTime = () => {
    let tomorrow = addDays(new Date(), 1);
    tomorrow = setHours(tomorrow, 0);
    tomorrow = setMinutes(tomorrow, 0);
    tomorrow = setSeconds(tomorrow, 0);

    const seconds = differenceInSeconds(tomorrow, new Date());
    const formated = new Date(seconds * 1000).toISOString().substr(11, 8);
    setRemaining(formated);
  };

  useEffect(() => {
    const interval = setInterval(calcRemainingTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return remaining;
};

export default useChrono;
