import { Suspense } from "react";
import InvitationClient from "../components/invitation-client";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <InvitationClient mode="welcome" />
    </Suspense>
  );
}
