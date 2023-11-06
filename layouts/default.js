import { StatsProvider } from "../context/stats";
import { TokenProvider } from "../context/token";

export default function DefaultLayout({ children }) {
    return <TokenProvider>{children}</TokenProvider>;
}
