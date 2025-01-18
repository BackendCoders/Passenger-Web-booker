
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Privateroute = () => {
    const isAuth = useSelector((state) => state.auth.isAuth);
    const token = localStorage.getItem('token');

    console.log('isAuth:', isAuth, 'token:', token); // Debug log

    return isAuth && token ? <Outlet /> : <Navigate to="/" />;
};

export default Privateroute;
