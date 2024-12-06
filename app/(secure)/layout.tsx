import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "_helpers/server";
import { Alert, Nav } from "_components";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Server-side authentication check
  if (!auth.isAuthenticated()) {
    const currentPath = headers().get("x-invoke-path") || "/";
    const returnUrl = encodeURIComponent(currentPath);
    redirect(`/account/login?returnUrl=${returnUrl}`);
  }

  return (
    <div className="bg-light">
      <Nav />
      <Alert />
      <div className="p-4">
        <div
          style={{
            minHeight: "100vh",
          }}
          className="container d-flex flex-column justify-content-center align-items-center"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
