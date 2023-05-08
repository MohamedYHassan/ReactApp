import { createBrowserRouter } from "react-router-dom";
import App from './App';
import { Guest } from "./middleware/Guest";
import { Admin } from "./middleware/Admin";
import History from './pages/history/History';
import Travel from './pages/Home/Home';
import ProductList from "./pages/product/ProductList";
import ProductInfo from "./pages/product/ProductInfo";
import Login from "./Login";
import Destinations from "./pages/Destinations/Destinations";
import AddDestinations from "./pages/Destinations/AddDestinations";
import UpdateDestinations from "./pages/Destinations/UpdateDestinations";
import ManageBuses from "./pages/Manage-buses/ManageBuses";
import AddBus from "./pages/Manage-buses/AddBus";
import UpdateBus from "./pages/Manage-buses/UpdateBus";
import Travellers from "./pages/Travellers/Travellers";
import AddTravellers from "./pages/Travellers/AddTravellers";
import UpdateTravellers from "./pages/Travellers/UpdateTravellers";
import Appointements from "./pages/Appointments/ManageAppointment";
import AddAppointments from "./pages/Appointments/AddAppointments";
import UpdateAppointments from "./pages/Appointments/UpdateAppointments";
import Requests from "./pages/Requests/Requests";
import RequestHistory from "./pages/Travellers/History";
import Home from './pages/Home/Home'
import UserDestinations from "./pages/Destinations/UserDestinations";
import UserBusses from "./pages/Manage-buses/UserBusses";
import UserRequests from "./pages/Requests/UserRequests";
import NotFound from "./shared/NotFound";
import { Navigate } from "react-router-dom";
//import Dashboard from "./pages/Dashboard/Dashboard";
//import Card from "./pages/Dashboard/Card";

export const router = createBrowserRouter([
   
    {   
        element:<Guest></Guest>,
        children:[{
            path: "/",
            element: <Login />
        }
        ]
    },
    {
        path: "/dashboard",
        element: <App />,
        //Nesting Children
        children: [
            {
                path: "travel",
                element: <ProductList />,
            },
            {
                path: "product-info/:id",
                element: <ProductInfo />,
            },
            {
                path: "history",
                element: <History />,
            },
            {
                path: "Destinations",
                element: <Destinations/>
            },
            {
                path: "Home",
                element: <Home />,
            },
            {
                path: "All-Requests",
                element: <UserRequests/>
            },
            {
                path: "All-Busses",
                element: <UserBusses/>
            },
            {
                path: "All-Destinations",
                element: <UserDestinations/>
            },
            {
                path: "Destinations",
                element:<Admin/>,
                children: [
                    {
                        path:'',
                        element: <Destinations />,
                    },
                    {
                        path:'AddDestinations',
                        element: <AddDestinations />,
                    },
                    {
                        path:':id',
                        element: <UpdateDestinations />,
                    },
                ]
            },
            {
                path: "ManageBuses",
                element:<Admin/>,
                children: [
                    {
                        path:'',
                        element: <ManageBuses />
                    },
                    {
                        path:'AddBus',
                        element: <AddBus />
                    },
                    {
                        path:':id',
                        element: <UpdateBus />
                    },
                ]
                
            },
            {
                path: "Travellers",
                element:<Admin/>,
                children: [
                    {
                        path:'',
                        element: <Travellers />
                    },
                    {
                        path:'AddTravellers',
                        element: <AddTravellers />
                    },
                    {
                        path:':id',
                        element: <UpdateTravellers />
                    },
                    {
                        path: 'History/:id',
                        element: <RequestHistory/>
                    },
                ]
            },
            {
                path: "Appointements",
                element:<Admin/>,
                children: [
                    {
                        path:'',
                        element: <Appointements />
                    },
                    {
                        path:'AddAppointments',
                        element: <AddAppointments />
                    },
                    {
                        path:':id',
                        element: <UpdateAppointments />
                    },
                ]
            },
            {
                path: "Requests",
                element:<Admin/>,
                children: [
                    {
                        path:'',
                        element: <Requests />,
                    },
                ]
            },
            {
                path: "*",
                element: <NotFound/>
            },
        ],
    },
    ]);