import NavBar from "./components/NavBar"
import Events from "./pages/Events";
import Offers from "./pages/Offers"
import Coupons from "./pages/Coupons";
import { Routes, Route } from 'react-router-dom';
import { PageProvider } from "./utils/NavContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./utils/AuthContext";
import { LocationProvider } from "./utils/LocationContext";
import MainBar from "./components/MainBar";
import Me from "./pages/Me";

function App() {

  const queryClient = new QueryClient();

  return (
    <>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <LocationProvider>
    <PageProvider>
    <MainBar></MainBar>
    <NavBar></NavBar>
    <div className="h-screen ">
    <Routes>
    <Route path="/" element={<Offers className="w-full h-full bg-base-black" />} />
    <Route path="/Offers" element={<Offers className="w-full h-full bg-base-black" />} />
    <Route path="/Events" element={<Events className="w-full h-full bg-base-black" />} />
    <Route path="/Coupons" element={<Coupons className="w-full h-full bg-base-black" />} />
    <Route path="/Me" element={<Me className="w-full h-full bg-base-black" />} />
    </Routes>
    </div>
    </PageProvider>
    </LocationProvider>
    </AuthProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
