import React from 'react';
import ImageUpload from './ImageUpload';

export default {
    title:"Avatar Personalizado",
    component: ImageUpload,
    argTypes:{
        rounded: {control:{type:"boolean"}, defaultValue:"true"}
    },
}

export const Default = (args:any) => <ImageUpload {...args}></ImageUpload>