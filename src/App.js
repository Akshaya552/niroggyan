import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import DoctorSpecific from "./components/DoctorSpecific";
import NotFound from "./components/NotFound";
import { SpecializationProvider } from "./context/SpecializationContext";

const App = () => {
  return (
    <BrowserRouter>
      <SpecializationProvider>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/doctor/:id" element={<DoctorSpecific />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SpecializationProvider>
    </BrowserRouter>
  );
};

export default App;
