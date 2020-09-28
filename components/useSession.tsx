import { configureMainApi } from "./services/Api";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";

export const PDZToken = "PDZT";
export const PDZUsername = "PDZU";

export const keepSession = (token:string, username:string) => {
    localStorage.setItem(PDZToken, token)
    localStorage.setItem(PDZUsername, username)
    configureMainApi(token)
}


const useSession = () => {
  const [session, setSession] = useState({});

  useEffect(() => {
    const token = localStorage.getItem(PDZToken);
    const username = localStorage.getItem(PDZUsername);
    
    if (!token) {
      router.push("/entrar")
    }

    setSession({username, token})
    console.log(session)
  
  }, []);

  const router = useRouter();
 
  return session;
};

export default useSession;
