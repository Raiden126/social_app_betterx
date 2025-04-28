import Cookies from 'js-cookie';

export const isAuthenticated = () => {
    const token = Cookies.get('accessToken');
    return !!token;
}