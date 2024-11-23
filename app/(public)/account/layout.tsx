import { redirect } from "next/navigation";

import { auth } from "_helpers/server";
import { Alert } from "_components";

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
  // if logged in redirect to home page
  if (auth.isAuthenticated()) {
    redirect("/");
  }

  return (
    <>
      <Alert />
      <div className="w-100 min-vh-100 bg-light d-flex flex-column justify-content-center align-items-center">
        {/* <h1 className="text-dark fw-bolder mb-3">Family Engage</h1> */}
        {children}
      </div>
    </>
  );
}
