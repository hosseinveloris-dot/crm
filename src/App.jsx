import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/router/AppRouter";
import { DataProvider } from "@/store/DataProvider";
import { ToastProvider } from "@/components/ui/Toast";
export default function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </DataProvider>
    </ToastProvider>
  );
}
