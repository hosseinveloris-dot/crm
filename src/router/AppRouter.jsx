import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Customers } from "@/pages/Customers";
import { CustomerForm } from "@/pages/CustomerForm";
import { FollowUps } from "@/pages/FollowUps";
import { Deliveries } from "@/pages/Deliveries";
import { Repairs } from "@/pages/Repairs";
import { Marketing } from "@/pages/Marketing";
import { Support } from "@/pages/Support";
import { Reports } from "@/pages/Reports";
import { NotFound } from "@/pages/NotFound";
export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/follow-ups" element={<FollowUps />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/repairs" element={<Repairs />} />
        <Route path="/marketing" element={<Navigate to="/marketing/kiln" replace />} />
        <Route path="/marketing/:channel" element={<Marketing />} />
        <Route path="/support" element={<Support />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/new" element={<CustomerForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
