/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import likesService, { Response } from '../services/likesService';

type LikeAction = {
  likeProduct: (productId:number) => Promise<Response>,
  dislikeProduct: (productId:number) => Promise<Response>,
  likeStore: (storeId:number) => Promise<Response>,
  dislikeStore: (storeId:number) => Promise<Response>,
};

const useLikeActions = ():LikeAction => {
  const likeProduct = async (productId:number) => likesService.giveLike({ productId });
  const likeStore = async (storeId:number) => likesService.giveLike({ storeId });
  const dislikeProduct = async (productId:number) => likesService.deleteLike({ productId: `${productId}` });
  const dislikeStore = async (storeId:number) => likesService.deleteLike({ storeId: `${storeId}` });
  return {
    likeProduct,
    likeStore,
    dislikeProduct,
    dislikeStore,
  };
};

export default useLikeActions;
