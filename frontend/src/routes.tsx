import { createBrowserRouter } from "react-router";
import { Layout } from "./layouts/Layout";
import { RootLayout } from "./layouts/RootLayout";

const myRoutes = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        Component: Layout,
        children: [
          {
            index: true,
            lazy: async () => {
              const { Home } = await import("./pages/Home");
              return { Component: Home };
            },
          },
          {
            path: "catalogo",
            lazy: async () => {
              const { Catalog } = await import("./pages/Catalog");
              return { Component: Catalog };
            },
          },
          {
            path: "produto/:sku",
            lazy: async () => {
              const { ProductDetail } = await import("./pages/ProductDetail");
              return { Component: ProductDetail };
            },
          },
          {
            path: "checkout",
            lazy: async () => {
              const { Checkout } = await import("./pages/Checkout");
              return { Component: Checkout };
            },
          },
          {
            path: "*",
            lazy: async () => {
              const { NotFound } = await import("./pages/NotFound");
              return { Component: NotFound };
            },
          },
        ],
      },
    ],
  },
]);

export default myRoutes;
