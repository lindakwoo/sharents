import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Box sx={{ mx: "64px", mt: "32px" }}>
          <h1>Sharents Landing Page</h1>
          {/* <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='inventory/manufacturers'>
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
            </Route>
          </Routes> */}
        </Box>
      </main>
    </BrowserRouter>
  );
}

export default App;
