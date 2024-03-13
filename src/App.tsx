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
    <Routes>
    <Route path="/Offers" element={<Offers className="" />} />
    <Route path="/Events" element={<Events className="" />} />
    <Route path="/Coupons" element={<Coupons className="" />} />
    <Route path="/Me" element={<Me />} />
    </Routes>
    </PageProvider>
    </LocationProvider>
    </AuthProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
