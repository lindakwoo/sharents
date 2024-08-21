import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from './components/Navbar';
import Login from './components/forms/Login';
import Home from "./components/homepage/Home";
import Landing from "./components/Landing";
import MilestoneExpandedView from "./components/milestones/MilestoneExpandedView";
import MediaExpandedView from "./components/media/MediaExpandedView";
import EventExpandedView from "./components/events/EventExpandedView";
import MemberLanding from "./components/MemberLanding";
import WishlistPage from "./components/events/WishlistPage";
import MilestonesPage from "./components/milestones/MilestonesPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>

        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/member_landing' element={<MemberLanding />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/milestones' element={<MilestonesPage />} />
          <Route path='/milestones/:id' element={<MilestoneExpandedView />} />
          <Route path='/media/:id' element={<MediaExpandedView />} />
          <Route path='/events/:id' element={<EventExpandedView />} />
          <Route path='/wishlists/:id' element={<WishlistPage />} />
          {/* <Route path='inventory/manufacturers'>
              <Route index element={<Manufacturers />} />
              <Route path='create' element={<CreateManufacturerForm />} />
            </Route>
            <Route path='inventory/automobiles'>
              <Route index element={<Automobiles />} />
              <Route path='create' element={<CreateAutomobileForm />} />
            </Route>
            <Route path='inventory/models'>
              <Route index element={<Models />} />
              <Route path='create' element={<CreateModelForm />} />
            </Route>
            <Route path='services/technicians'>
              <Route index element={<Technicians />} />
              <Route path='create' element={<CreateTechnicianForm />} />
            </Route>
            <Route path='services/appointments'>
              <Route index element={<Appointments />} />
              <Route path='create' element={<CreateAppointmentForm />} />
              <Route path='history' element={<Appointments isHistoryPage={true} />} />
            </Route>

            <Route path='sales/people'>
              <Route index element={<ListSalesPerson />} />
              <Route path='create' element={<AddSalesPerson />} />
            </Route>

            <Route path='sales/customers'>
              <Route index element={<ListCustomer />} />
              <Route path='create' element={<AddCustomer />} />
            </Route>

            <Route path='sales/records'>
              <Route index element={<ListSaleHistory />} />
              <Route path='create' element={<CreateSalesRecord />} />
            </Route> */}
        </Routes>

      </main>
    </BrowserRouter>
  );
}

export default App;
