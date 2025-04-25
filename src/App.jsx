import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DashboardLayout from './Components/DashboardLayout'
import Register from './Components/Register'
import { LogIn } from 'lucide-react'
import Login from './Components/Login'
import AddNewPatient from './Components/AddNewPatient'
import AllPatients from './Components/AllPatients'
import PatientDetails from './Components/PatientDetails'
import AddMedicine from './Components/AddMedicine'
// import SendPrescription from './Components/SendPrescription'


function App() {
  // const [count, setCount] = useState(0)
  function IsLoggedIn({ children }) {
    const isLoggedIn = JSON.parse(localStorage.getItem("LoggedIn") || "false");
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  }
  
  function RedirectToDashboard({ children }) {
    const isLoggedIn = JSON.parse(localStorage.getItem("LoggedIn") || "false");
    return isLoggedIn ? <Navigate to="/login" replace /> : children;
  }
  
  return (
    <>
      <Routes>
        <Route path='/login' element={<RedirectToDashboard><Login /></RedirectToDashboard>} />
        <Route path='/register' element={<RedirectToDashboard><Register /></RedirectToDashboard>} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<IsLoggedIn><AllPatients /></IsLoggedIn>} />
          {/* <Route path='/patients' element={<IsLoggedIn><AllPatients /></IsLoggedIn>} /> */}
          <Route path='/addnew' element={<IsLoggedIn><AddNewPatient /></IsLoggedIn>} />
          <Route path='/medicine/add' element={<IsLoggedIn><AddMedicine /></IsLoggedIn>} />
          <Route path='/patients/:id' element={<IsLoggedIn><PatientDetails /></IsLoggedIn>} />
          {/* <Route path='/prescription' element={<IsLoggedIn><SendPrescription /></IsLoggedIn>} /> */}

        </Route>
      </Routes>
    </>
  )
}

export default App
