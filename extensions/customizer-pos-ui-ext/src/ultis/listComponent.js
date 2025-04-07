function lineItemsToListComponent(items, api) {
  //items is the cart.lineItems
  //api is the api object
  return items.map((item) => ({
    id: item.uuid,
    onPress: () => {
      api.cart.addLineItemProperties(item.uuid, {Engraving: 'John Doe'})
    },
    leftSide: {
      label: item.title,
      image: item.image,
      subtitle: [],
      badges: []
    },
    rightSide: {
      label: 'Warranty',
      showChevron: true,
    }
  }));
}

export { lineItemsToListComponent };
