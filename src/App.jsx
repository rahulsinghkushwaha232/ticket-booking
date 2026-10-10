import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Booking from "./pages/Booking.jsx";
import Credits from "./pages/Credits.jsx";
import Home from "./pages/Home.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import Payment from "./pages/Payment.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/tickets" element={<MyTickets />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="*" element={
          <main className="page-shell">
            <section className="glass-panel message-panel">
              <p className="eyebrow">That page took a wrong turn</p>
              <h1>Page not found</h1>
              <p>The page you&apos;re looking for doesn&apos;t exist. Head back to the events and find your next experience.</p>
              <Link className="button button-primary" to="/">Back home</Link>
            </section>
          </main>
        } />
      </Routes>
      <footer className="site-footer">
        <span className="site-footer-brand">Made for nights worth remembering <span aria-hidden="true">✦</span> TicketHub</span>
        <small>
          Demo project. Event names are sample data and no real tickets are sold.
          {" "}<Link to="/credits">Photo credits</Link>
        </small>
      </footer>
    </>
  );
}

export default App;
