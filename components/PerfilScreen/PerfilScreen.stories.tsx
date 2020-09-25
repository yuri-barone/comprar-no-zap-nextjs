import React from 'react';
import PerfilScreen from './PerfilScreen'

export default {
    component:PerfilScreen,
    title: "Login e Cadastro/Tela de perfil",
    argTypes: {
        src:{control:{type:"text"}, defaultValue:"https://upload.wikimedia.org/wikipedia/commons/1/14/Mark_Zuckerberg_F8_2018_Keynote_%28cropped_2%29.jpg"},
        name:{control:{type:"text"}, defaultValue:"Marck Zuckemberg"},
        zap:{control:{type:"text"}, defaultValue:"+5544998877665"},
        endereco:{control:{type:"text"}, defaultValue:"California States Banana"},
    },
}

export const Default = (args:any) => <PerfilScreen {...args}></PerfilScreen>;