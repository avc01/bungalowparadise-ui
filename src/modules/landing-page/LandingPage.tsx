// import LandingHeaderPage from "./LandingHeaderPage";
import LandingBodyPage from "./LandingBodyPage";
import LandingFooterPage from "./LandingFooterPage";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <LandingHeaderPage /> */}
        <LandingBodyPage />
        <LandingFooterPage />
      </div>
    </div>
  );
}
