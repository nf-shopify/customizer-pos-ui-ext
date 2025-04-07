import React, { useState, useEffect } from "react";

import {
  Text,
  Screen,
  Section,
  List,
  useCartSubscription,
  useApi,
  ScrollView,
  Navigator,
  reactExtension,
  useApi
} from "@shopify/ui-extensions-react/point-of-sale";

async function retrieveLineItemArrays(items, api) {
  const returnedProductSearchAPI =
    await api.productSearch.fetchProductVariantsWithIds(
      items.map((item) => item.variantId)
    );
  return returnedProductSearchAPI.fetchedResources;
}

function addImageURLsToLineItems(cartItems, productSearchItems) {
  //let modifiedCartItems = cartItems
  let modifiedCartItems = JSON.parse(JSON.stringify(cartItems));

  modifiedCartItems.forEach((item) => {
    productSearchItems.forEach((variant) => {
      if (item.variantId === variant.id) {
        if (variant?.image?.length > 0) item.image = product.image;
        else item.image = variant.product.featuredImage;
      }
    });
  });
  return modifiedCartItems;
}

function lineItemsToListComponent(items, api) {
  return items.map((item) => ({
    id: item.uuid,
    onPress: () => {
      api.toast.show(`testing`);
    },
    leftSide: {
      label: item.title,
      image: { source: item.image },
      subtitle: [],
      badges: [],
    },
    rightSide: {
      label: "Customize",
      showChevron: true,
    },
  }));
}

const Modal = () => {
  const api = useApi();
  const cart = useCartSubscription();
  const [productItems, setProductItems] = useState([]);
  const [enhancedCartItems, setEnhancedCartItems] = useState([]);

  useEffect(() => {
    // Define async function inside useEffect
    async function fetchData() {
      const items = await retrieveLineItemArrays(cart.lineItems, api);
      setProductItems(items);
    }
    // Execute the async function
    fetchData();
  }, [cart.lineItems, api]); // Dependencies array

  useEffect(() => {
    if (productItems.length > 0 && cart.lineItems.length > 0) {
      const updatedCartItemsURL = addImageURLsToLineItems(
        cart.lineItems,
        productItems
      );
      setEnhancedCartItems(updatedCartItemsURL);
    } else {
      setEnhancedCartItems(cart.lineItems);
    }
  }, [productItems, cart.lineItems]);

  //const listData = lineItemsToListComponent(cart.lineItems, api);
  const listData = lineItemsToListComponent(enhancedCartItems, api);

  return (
    <Navigator>
      <Screen name="HelloWorld" title="Hello World!">
        <ScrollView>
          <Text>Welcome to the extension V4!</Text>
          <Section title="Select an item to customize">
            <List data={listData} imageDisplayStrategy="automatic" />
          </Section>
        </ScrollView>
      </Screen>
    </Navigator>
  );
};

export default reactExtension("pos.home.modal.render", () => <Modal />);
