import React from 'react';
import MyCart from '../components/MyCart/MyCart';

export type carrinhoDeComprasProps = {
    cartProducts: Array<any>
}

const carrinhoDeCompras = ({cartProducts}:carrinhoDeComprasProps) => {
    return (
        <MyCart cartProducts={cartProducts}></MyCart>
    );
}

export default carrinhoDeCompras;
