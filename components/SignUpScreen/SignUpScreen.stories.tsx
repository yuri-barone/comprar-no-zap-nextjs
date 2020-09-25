import React from 'react';
import SignUpScreen from './SignUpScreen';

export default {
    title: "Login e Cadastro/Tela de cadastro",
    component: SignUpScreen,
    agrTypes:{

    },
}

export const Default = (args:any) => <SignUpScreen {...args}></SignUpScreen>