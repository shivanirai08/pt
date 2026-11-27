import { PortfolioProvider } from "./context/PortfolioContext";
import Site from "./site/Site";

export default function Page() {
  return (
    <PortfolioProvider>
      <Site />
    </PortfolioProvider>
  );
}
