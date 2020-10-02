import { useRouter } from 'next/router';
import React from 'react';
import LoginScreen from '../components/LoginScreen/LoginScreen';
import usersService from '../components/services/usersService';
import { keepSession } from '../components/useSession';

const entrar = () => {
    const router = useRouter();
    const logar = async (values: any) => {
        values["strategy"] = "local"
        values.email = values.email.toLowerCase();
        const data:any = await usersService.login(values)
        keepSession(values.email.split("@")[0], data.token)
        router.push("/produtos")
      };

    return (
        <LoginScreen onLogin={logar} />
    );
}

export default entrar;
