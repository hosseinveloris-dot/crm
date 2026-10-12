import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { deliveries as seedDeliveries } from "@/data/deliveries";
import { customers as seedCustomers } from "@/data/customers";
import { followUps as seedFollowUps } from "@/data/followUps";
import { marketingLeads as seedLeads } from "@/data/marketing";
import { repairs as seedRepairs } from "@/data/repairs";
import { tickets as seedTickets } from "@/data/support";
import { uid } from "@/lib/utils";
const DataContext = createContext(null);
/**
 * Session-wide, in-memory data store.
 *
 * It is seeded from the mock data files and shared across routes, so anything
 * created in the UI stays visible while the app is open. Swapping this for a
 * real API later only requires changing this provider.
 */
export function DataProvider({ children }) {
  const [data, setData] = useState(() => ({
    customers: seedCustomers,
    followUps: seedFollowUps,
    deliveries: seedDeliveries,
    repairs: seedRepairs,
    leads: seedLeads,
    tickets: seedTickets,
  }));
  const prepend = useCallback((key, draft) => {
    setData((prev) => ({
      ...prev,
      [key]: [{ ...draft, id: uid(key) }, ...prev[key]],
    }));
  }, []);
  const update = useCallback((key, id, patch) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }, []);
  const value = useMemo(
    () => ({
      ...data,
      addCustomer: (draft) => prepend("customers", draft),
      addFollowUp: (draft) => prepend("followUps", draft),
      addDelivery: (draft) => prepend("deliveries", draft),
      addRepair: (draft) => prepend("repairs", draft),
      addLead: (draft) => prepend("leads", draft),
      addTicket: (draft) => prepend("tickets", draft),
      updateFollowUp: (id, patch) => update("followUps", id, patch),
      updateDelivery: (id, patch) => update("deliveries", id, patch),
      updateRepair: (id, patch) => update("repairs", id, patch),
      updateLead: (id, patch) => update("leads", id, patch),
      updateTicket: (id, patch) => update("tickets", id, patch),
    }),
    [data, prepend, update],
  );
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside <DataProvider>");
  return context;
}
