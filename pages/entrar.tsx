import React from 'react';
import LoginScreen from '../components/LoginScreen/LoginScreen';
import { configureMainApi } from '../components/services/Api';
import usersService from '../components/services/usersService';
import { keepSession } from '../components/useSession';

const entrar = () => {
    const logar = async (values: any) => {
        values["strategy"] = "local"
        const data:any = await usersService.login(values)
        keepSession(values.email.split("@")[0], data.token)
      };

    return (
        <LoginScreen onLogin={logar} />
    );
}

export default entrar;
