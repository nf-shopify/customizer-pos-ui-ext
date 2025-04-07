function appendProductDetailsToCartItems(cartItems, productSearchItems) {
  const variantMap = new Map(
    productSearchItems.map(variant => [
      variant.id,
      {
        image: variant?.image?.length > 0
          ? variant.image
          : variant?.product?.featuredImage || null
      },
      {
        options: variant?.options > 0
          ? variant.options
          : null
      }
    ])
  );

  // Map over cart items to create a new array instead of mutating
  const updatedCartItems = cartItems.map(item => ({
    ...item,
    image: variantMap.get(item.variantId)?.image || null,
    options: variantMap.get(item.variantId)?.options || null
  }));

  console.log("updatedCartItems", JSON.stringify(updatedCartItems));
  return updatedCartItems;
}

export { appendProductDetailsToCartItems };
