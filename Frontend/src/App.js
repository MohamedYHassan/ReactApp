import Header from './shared/Header';
import Footer from './shared/Footer';
import Aside from './shared/Aside';
import './style/App.css';
import './style/Home.css'
import { Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getAuthUser } from './helper/Storage';

function App() {
  // const auth = getAuthUser()
  // if (auth) {
  //   Navigate("/Home")
  // }
  // else {
  //   Navigate("/login")
  // }
  return (
    <>
      <Header />
      <div className='Home'>
        <Aside />
        <Outlet/>
      </div>
      <Footer />
    </>
  );
}

export default App;
