import React, { useState, useEffect } from "react";
import {
  Screen,
  Navigator,
  Section,
  List,
  reactExtension,
  Text,
  ScrollView,
  useCartSubscription,
  useApi,
} from "@shopify/ui-extensions-react/point-of-sale";

async function fetchProductData(items, api) {
  const itemsVariantIds = items.map((item) => item.variantId);
  const res = await api.productSearch.fetchProductVariantsWithIds(
    itemsVariantIds
  );
  return res.fetchedResources;
}

function combineCartItemsWithProductData(cartItems, productData) {
  const enrichedCartItems = cartItems.map((item) => {
    const variant = productData.find(
      (variant) => variant.id === item.variantId
    );
    return {
      ...item,
      image:
        variant?.image?.length > 0
          ? variant.image
          : variant.product.featuredImage,
      options: variant?.options,
    };
  });
  // console.log("enrichedCartItems", JSON.stringify(enrichedCartItems));
  // console.log("enrichedCartItems", enrichedCartItems[0].options[0].name);
  // console.log("enrichedCartItems", enrichedCartItems[0].options[0].value);
  return enrichedCartItems;
}

function lineItemsToListComponent(items, api, setSelectedItem) {
  return items.map((item) => ({
    id: item.uuid,
    onPress: () => {
      api.navigation.navigate("Warranty Options");
    },
    leftSide: {
      label: item?.title,
      image: { source: item?.image },
      subtitle: [
        { content: item?.options?.[0]?.value, color: "TextHighlight" },
      ],
      badges: [],
    },
    rightSide: {
      label: "Warranty Options",
      showChevron: true,
    },
  }));
}

function warrantyItemsToListComponent(items, api) {
  return items.map((item) => ({
    id: item.id,
    onPress: () => {
      try {
        api.cart.addLineItem(item.id, 1);
        api.toast.show(`Warranty added to cart`);
      } catch (error) {
        console.error(error);
        api.toast.show(`Error adding warranty to cart`);
      }
    },
    leftSide: {
      label: item?.displayName,
      image: [],
      subtitle: [],
      badges: [],
    },
    rightSide: {
      label: "Add Warranty",
      showChevron: true,
    },
  }));
}

const Modal = () => {
  const api = useApi();
  const cart = useCartSubscription();
  const [productData, setProductData] = useState([]);
  const [warrantyData, setWarrantyData] = useState([]);
  const [enrichedCartItems, setEnrichedCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [selectedWarranty, setSelectedWarranty] = useState();

  const warrantyItems = [
    { variantId: 40936738914374 },
    { variantId: 40936739012678 },
    { variantId: 46185421668605 },
    { variantId: 46185421734141 },
  ];

  useEffect(() => {
    async function getProductData() {
      const productDataResponse = await fetchProductData(cart.lineItems, api);
      setProductData(productDataResponse);
    }
    getProductData();
  }, []);

  useEffect(() => {
    if (productData.length > 0) {
      const updatedCartItems = combineCartItemsWithProductData(
        cart.lineItems,
        productData
      );
      setEnrichedCartItems(updatedCartItems);
    } else {
      setEnrichedCartItems(cart.lineItems);
    }
    async function getWarrantyData() {
      const warrantyDataResponse = await fetchProductData(warrantyItems, api);
      setWarrantyData(warrantyDataResponse);
    }
    getWarrantyData();
  }, [productData]);

  const listItemsList = lineItemsToListComponent(enrichedCartItems, api);
  const warrantyItemsList = warrantyItemsToListComponent(warrantyData, api);
  console.log("warrantyData", JSON.stringify(warrantyData));
  console.log("listItemsList", JSON.stringify(listItemsList));
  console.log("warrantyItemsList", JSON.stringify(warrantyItemsList));

  return (
    <Navigator>
      <Screen name="Furniture Warranty" title="Furniture Warranty">
        <ScrollView>
          <Section title="Please select an item to add a warranty to">
            <List data={listItemsList} imageDisplayStrategy="always" />
          </Section>
        </ScrollView>
      </Screen>
      <Screen name="Warranty Options" title="Warranty Options">
        <ScrollView>
          <Section title="Warranty Options">
            <List data={warrantyItemsList} imageDisplayStrategy="never" />
          </Section>
        </ScrollView>
      </Screen>
    </Navigator>
  );
};

export default reactExtension("pos.home.modal.render", () => {
  return <Modal />;
});
