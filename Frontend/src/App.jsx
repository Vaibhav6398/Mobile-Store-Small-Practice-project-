
import './App.css'
import { Route, Routes,Navigate } from 'react-router-dom'
import Admin from './Pages/admin'
import Products from './Pages/products'
import AuthPage from './Pages/AuthPage'
import Home from './Pages/Home'
import ProtectedRoute from './MiddleWare/ProtectedRoute'
import AdminRoute from './MiddleWare/AdminRoute'
// import Editform from './Components/ProfileForm'

function App() {
 

  return (
    <Routes>
      {/* <Route path='/editform' element={<Editform/>}/> */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminRoute><Admin /></AdminRoute></ProtectedRoute>} />
      <Route path='/products' element={<Products/>}/>
      <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
    </Routes>
  )
}

export default App
