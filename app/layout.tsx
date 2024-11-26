import "bootstrap/dist/css/bootstrap.min.css";
import "globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "family-engage",
};

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
        {/* credits */}
        <div className="text-center">
          {/* <p>
                        <a href="https://jasonwatmore.com/next-js-13-app-router-mongodb-user-rego-and-login-tutorial-with-example" target="_blank">Next.js 13 + App Router + MongoDB - User Rego and Login Tutorial with Example</a>
                    </p>
                    <p>
                        <a href="https://jasonwatmore.com" target="_blank">JasonWatmore.com</a>
                    </p> */}
        </div>
      </body>
    </html>
  );
}
