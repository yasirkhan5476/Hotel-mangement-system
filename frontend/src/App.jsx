import { Route, Routes } from 'react-router-dom'
import Login from './Login.jsx'
import Signin from './Signin'
import Forgotpassword from './Forgotpassword.jsx'

import Adminuserdetail from './Adminpanel/Adminuserdetail.jsx'
import Admindashboard from './Adminpanel/Admindashboard.jsx'
import Adminuser from './Adminpanel/Adminuser.jsx'
import Adminaddroom from './Adminpanel/Adminaddroom.jsx'
import Adminviewroom from './Adminpanel/Adminviewroom.jsx'
import Admineditroom from './Adminpanel/Admineditroom.jsx'
import Booking from './Guestpanel/Booking.jsx'
import Billing from './Guestpanel/Billing.jsx'
import Confirmation from './Guestpanel/Confrimation.jsx'
import Invoicepage from './Guestpanel/Invoicepage.jsx'
import Adminbookrooms from './Adminpanel/Adminbookrooms.jsx'
import Adminbillingpage from './Adminpanel/Adminbillingpage.jsx'
import Feedbacks from './Guestpanel/Feedbacks.jsx'
import AdminFeedback from './Adminpanel/Adminfeedback.jsx'


function App() {
 

  return (
    <>
    
      <Routes>
         {/* guest panel */}
       <Route path='/' element={<Booking/>}/>
       <Route path='/billing' element={<Billing/>}/>
       <Route path='/confirm' element={<Confirmation/>}/>
       <Route path='/invoice' element={<Invoicepage/>}/>
       <Route path='/feedbacks/:id' element={<Feedbacks/>}/>
       {/* Admin panel */}
       <Route path="/login" element={<Login/>} />
       <Route path="/signin" element={<Signin/>} />
       <Route path="/forgotpassword/:email" element={<Forgotpassword />} />
       <Route path='/admindashboard' element={<Admindashboard/>}/>
       <Route path="/adminuser" element={<Adminuser/>}/>
       <Route path='/adminuserdetails/:id' element={<Adminuserdetail/>}/>
       <Route path='/addroom' element={<Adminaddroom/>}/>
       <Route path="/viewrooms" element={<Adminviewroom/>}/>
       <Route path="/editroom/:id" element={<Admineditroom/>}/>
       <Route path="/bookrooms" element={<Adminbookrooms/>}/>
       <Route path="/billingpage" element={<Adminbillingpage/>}/>
       <Route path='/adminfeedbacks' element={<AdminFeedback/>}/>
       
       

      </Routes>
  
    </>
  )
}

export default App
