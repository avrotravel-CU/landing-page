import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import usePageTitle from "./hooks/usePageTitle";
import Home from "./pages/Home";
import TourPackages from "./pages/TourPackages";
import Experiences from "./pages/Experiences";
import Payments from "./pages/Payments";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentDeclined from "./pages/PaymentDeclined";
import Contact from "./pages/Contact";
import Plan from "./pages/Plan";
import Privacy from "./pages/Privacy";

export default function App() {
  usePageTitle();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tour-packages" element={<TourPackages />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-declined" element={<PaymentDeclined />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <Footer />
    </div>
  );
}
