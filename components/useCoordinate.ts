import { useEffect, useState } from 'react';

type Coordinates = {
  accuracy: number,
  altitude: number,
  altitudeAccuracy: number,
  heading: number,
  latitude: number,
  longitude: number,
  speed: number,
};

const useCoordinate = () => {
  const [position, setPosition] = useState<Coordinates | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    const success = (pos:any) => {
      const crd = pos.coords;
      setPosition(crd);
      setLoading(false);
    };
    navigator.geolocation.getCurrentPosition(success);

    const checkIsAllowed = async () => {
      const asd = await navigator.permissions.query({ name: 'geolocation' });
      if (asd.state === 'granted') {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    };
    checkIsAllowed();
  }, []);

  return { position, loading, allowed: isAllowed };
};

export default useCoordinate;
