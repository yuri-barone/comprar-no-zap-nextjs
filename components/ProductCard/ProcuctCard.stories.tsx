import React from "react";
import ProductCard from "./ProductCard";

export default {
  title: "Produto/Product Card",
  component: ProductCard,
  argTypes: {
    src: { control: { type: "text" }, defaultValue: "https://i.pinimg.com/originals/11/a5/5a/11a55a964c278eec04d849c5d312bfee.jpg" },
    name: { control: { type: "text" }, defaultValue: "Titulo do Lanche" },
    descricao: {
      control: { type: "text" },
      defaultValue: "Descrição do produto",
    },
    valor: { control: { type: "text" }, defaultValue: "R$00,00" },
  },
};

export const Default = (args: any) => <ProductCard {...args}></ProductCard>;
