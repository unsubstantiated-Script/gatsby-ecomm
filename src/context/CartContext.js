import React, { useState } from 'react';

//Dynamically queries the Shopify API
import Client from 'shopify-buy';

//This builds the client so we can query the API all in this place alone. Also connects to the GraphQL behind the scenes
const client = Client.buildClient({
  domain: `${process.env.GATSBY_SHOP_NAME}.myshopify.com`,
  storefrontAccessToken: process.env.GATSBY_ACCESS_TOKEN,
});

//Reset back to empty
const defaultState = {
  cart: {},
};

//Context wrapper so we can access state/functions across the app
const CartContext = React.createContext(defaultState);
export default CartContext;

//Here that context is being used...
export function CartContextProvider({ children }) {
  //checkout does not get wiped if page is refreshed. Bounces back and forth between local state and local storage
  const [checkout, setCheckout] = useState(
    JSON.parse(
      typeof window !== 'undefined' ? localStorage.getItem('checkout') : null
    )
  );

  //If checkout is complete...user gets a confirmation
  const [successfulOrder, setSuccessfulOrder] = useState(null);
  const checkoutId = checkout?.id;

  //Loads up any existing checkout into our local state notice the use of the client variable below
  React.useEffect(() => {
    const getCheckout = async () => {
      if (checkoutId && typeof window !== 'undefined') {
        const fetchedCheckout = await client.checkout.fetch(checkoutId);
        if (fetchedCheckout?.completedAt) {
          localStorage.removeItem('checkout');
          setCheckout(null);
          setSuccessfulOrder(fetchedCheckout);
        } else {
          setCheckout(fetchedCheckout);
          localStorage.setItem('checkout', JSON.stringify(fetchedCheckout));
        }
      }
    };

    getCheckout();
  }, [setCheckout, setSuccessfulOrder, checkoutId]);

  //Getting a product by its ID and returning its object
  async function getProductById(productId) {
    const product = await client.product.fetch(productId);
    return product;
  }

  const updateLineItem = async ({ variantId, quantity }) => {
    // if no checkout id, create a new checkout
    let newCheckout = checkout || (await client.checkout.create());

    // check to see if this variantId exists in storedCheckout
    const lineItemVariant = newCheckout.lineItems?.find(
      lineItem => lineItem.variant.id === variantId
    );

    if (lineItemVariant) {
      const newQuantity = lineItemVariant.quantity + quantity;

      if (newQuantity) {
        newCheckout = await client.checkout.updateLineItems(newCheckout.id, [
          {
            id: lineItemVariant.id,
            quantity: newQuantity,
          },
        ]);
      } else {
        newCheckout = await client.checkout.removeLineItems(newCheckout.id, [
          lineItemVariant.id,
        ]);
      }
    } else {
      newCheckout = await client.checkout.addLineItems(newCheckout.id, [
        {
          variantId,
          quantity,
        },
      ]);
    }

    setCheckout(newCheckout);
    setSuccessfulOrder(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout', JSON.stringify(newCheckout));
    }
  };

  const removeLineItem = async lineItemId => {
    const newCheckout = await client.checkout.removeLineItems(checkout.id, [
      lineItemId,
    ]);

    setCheckout(newCheckout);
  };

  const dismissSuccessfulOrder = () => {
    setSuccessfulOrder(null);
  };

  return (
    <CartContext.Provider
      value={{
        checkout,
        updateLineItem,
        removeLineItem,
        getProductById,
        successfulOrder,
        dismissSuccessfulOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
