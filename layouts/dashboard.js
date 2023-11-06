import { FingerprintProvider } from "../context/fingerprint";
import { TokenProvider } from "../context/token";

export default function DashboardLayout({ children }) {
    return <TokenProvider>{children}</TokenProvider>;
}
