import { StatsProvider } from "../context/stats";
import { TokenProvider } from "../context/token";

export default function VerificationLayout({ children }) {
    return <TokenProvider>{children}</TokenProvider>;
}
