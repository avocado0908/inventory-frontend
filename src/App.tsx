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
import { Box, ChartBarStacked, Home, Truck, Warehouse, Table, Ruler } from "lucide-react";
import { Layout } from "./components/layout/layout";
import ProductsList from "./pages/products/lists";
import ProductsCreate from "./pages/products/create";
import CategoriesList from "./pages/categories/lists";
import StockCountPage from "./pages/stockcount";
import { dataProvider } from "./providers/data";
import SuppliersList from "./pages/suppliers/lists";
import BranchesList from "./pages/branches/lists";
import BranchAssingment from "./pages/branchAssingment/lists";
import TestPage from "./pages/Test";
import UomList from "./pages/uom/lists";

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
                  name: 'stockcount',
                  list: '/stockcount',
                  meta: { label: 'Stock Count', icon: <ChartBarStacked /> }
                },
                {
                  name: 'products',
                  list: '/products',
                  create: '/products/create',
                  meta: { label: 'Products', icon: <Box />}
                },
                {
                  name: 'categories',
                  list: '/categories',
                  meta: { label: 'Categories', icon: <ChartBarStacked />}
                },
                {
                  name: 'suppliers',
                  list: '/suppliers',
                  meta: { label: 'Suppliers', icon: <Truck />}
                },
                {
                  name: 'branches',
                  list: '/branches',
                  meta: { label: 'Branches', icon: <Warehouse />}
                },
                {
                  name: 'branchAssingment',
                  list: '/branchAssingment',
                  meta: { label: 'BranchAssingment', icon: <Warehouse />}
                },
                {
                  name: 'uom',
                  list: '/uom',
                  meta: { label: 'UOM', icon: <Ruler /> }
                },
                {
                  name: 'test',
                  list: '/test',
                  meta: { label: 'Test', icon: <Table /> }
                },
            
                
              ]}
            >

              <Routes>
                <Route element = {
                  <Layout>
                    <Outlet />
                  </Layout>
                  }>
                  <Route path="/" element={<Dashboard />} />

                  <Route path="stockcount">
                    <Route index element={<StockCountPage />} />
                  </Route>

                  <Route path="products">
                    <Route index element={<ProductsList />} />
                    <Route path="create" element={<ProductsCreate />} />
                    
                  </Route>
                  <Route path="categories">
                    <Route index element={<CategoriesList />} />
                  </Route>

                  <Route path="suppliers">
                    <Route index element={<SuppliersList />} />
                  </Route>
                  
                  <Route path="branches">
                    <Route index element={<BranchesList />} />
                  </Route>
                  <Route path="branchAssingment">
                    <Route index element={<BranchAssingment />} />
                  </Route>
                  <Route path="uom">
                    <Route index element={<UomList />} />
                  </Route>
                  <Route path="test">
                    <Route index element={<TestPage />} />
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
