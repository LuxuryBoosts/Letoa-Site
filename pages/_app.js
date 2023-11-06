import { useEffect } from "react";
import AOS from "aos";
import DefaultLayout from "../layouts/default";
import { QueryClient, QueryClientProvider } from "react-query";
// import "../css/root.css";

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => {
    const getLayout =
        Component.getLayout ||
        ((page) => <DefaultLayout>{page}</DefaultLayout>);

    useEffect(() => {
        AOS.init({
            once: false,
            disable: "phone",
            duration: 600,
            easing: "ease-out-sine",
        });
    });
    
    return (
        <>
            <QueryClientProvider client={queryClient}>
                {getLayout(<Component {...pageProps} />)}
            </QueryClientProvider>
        </>
    );
};

export default MyApp;
