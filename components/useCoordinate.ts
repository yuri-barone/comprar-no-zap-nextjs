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
  useEffect(() => {
    const success = (pos:any) => {
      const crd = pos.coords;
      setPosition(crd);
      setLoading(false);
    };
    navigator.geolocation.getCurrentPosition(success);
  }, []);
  return { position, loading };
};

export default useCoordinate;
