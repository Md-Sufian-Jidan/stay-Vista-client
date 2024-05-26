import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import RoomDetails from '../pages/RoomDetails/RoomDetails'
import PrivateRoute from '../routes/PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Statistic from '../pages/Dashboard/Common/Statistic'
import AddRoom from '../pages/Dashboard/Host/AddRoom'
import MyListings from '../pages/Dashboard/Host/MyListings'
import Profile from '../pages/Dashboard/Common/Profile'
import ManageUsers from '../pages/Dashboard/admin/ManageUsers'
import AdminRoute from './AdminRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: <PrivateRoute><RoomDetails /></PrivateRoute>,
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        path: '/dashboard',
        element: <PrivateRoute><Statistic /></PrivateRoute>
      },
      {
        path: 'add-room',
        element: <PrivateRoute><AddRoom /></PrivateRoute>
      },
      {
        path: 'my-listings',
        element: <PrivateRoute><MyListings /></PrivateRoute>
      },
      {
        path: 'profile',
        element: <PrivateRoute><Profile /></PrivateRoute>
      },
      {
        path: 'manage-users',
        element: <PrivateRoute>
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        </PrivateRoute>
      }
    ]
  }
])
