import { Suspense } from "react";
import InvitationClient from "../../components/invitation-client";

export default function InvitationPage() {
  return (
    <Suspense fallback={null}>
      <InvitationClient mode="invite" />
    </Suspense>
  );
}
