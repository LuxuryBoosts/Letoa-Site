import { FingerprintProvider } from "../context/fingerprint";
import { TokenProvider } from "../context/token";
import { UserProvider } from "../context/user";

export default function RegisterLayout({ children }) {
    return (
        <TokenProvider>
            <FingerprintProvider>{children}</FingerprintProvider>
        </TokenProvider>
    );
}
