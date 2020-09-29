import { useRouter } from 'next/router';
import React from 'react';
import usersService from '../components/services/usersService';
import SignUpScreen from '../components/SignUpScreen/SignUpScreen';
import { keepSession } from '../components/useSession';

const cadastro = () => {
    return (
        <SignUpScreen />
    );
}

export default cadastro;
