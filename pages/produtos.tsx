import React from 'react';
import ProductRegister from '../components/ProductRegister/ProductRegister';
import productsService from '../components/services/productsService';
import useSession from '../components/useSession';

const produtos = () => {
    const session = useSession()
    const salvarProduto = (values: any) => {
        productsService.save(values)

      };
    return (
        <ProductRegister onSave={salvarProduto}></ProductRegister>
    );
}

export default produtos;
