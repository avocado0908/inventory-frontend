import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/dashboard";
import { Box, Home } from "lucide-react";
import { Layout } from "./components/layout/layout";
import ProductsList from "./pages/products/lists";
import ProductsCreate from "./pages/products/create";
import { dataProvider } from "./providers/data";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "aujTwN-5219Ca-EWEUgt",
              }}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: { label: 'Home', icon: <Home /> }
                },
                {
                  name: 'products',
                  list: '/products',
                  create: '/products/create',
                  meta: { label: 'Products', icon: <Box />}
                }
              ]}
            >

              <Routes>
                <Route element = {
                  <Layout>
                    <Outlet />
                  </Layout>
                  }>
                  <Route path="/" element={<Dashboard />} />

                  <Route path="products">
                    <Route index element={<ProductsList />} />
                    <Route path="create" element={<ProductsCreate />} />
                  </Route>
                </Route>  
              </Routes>

              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
