// app/candidate-applications/page.jsx
import { makeStore } from "@/store";
import { Providers } from "../../providers";
import CandidateApplicationsContent from "@/components/csr/CandidateApplicationsContent";

export default async function CandidateApplicationsPage() {
  const store = makeStore();
  let initialReduxState = {};

  // Check authentication status

  initialReduxState = store.getState();

  return (
    <Providers initialReduxState={initialReduxState}>
      <CandidateApplicationsContent
      />
    </Providers>
  );
}