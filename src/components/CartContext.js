import React from 'react';

export const CartContext = React.createContext(null);

export default function useCartContext() {
  const cartContext = React.useContext(CartContext);
  if (cartContext === null) {
    throw new Error('useCartContext must be used inside a ContextProvider.');
  }
  return cartContext;
}
