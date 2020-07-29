import Cookies from 'js-cookie';


//set cookie with 2 days expiration time
export const setCookie = (key, value) => {
    if (window !== 'undefined') {
        Cookies.set(key, value, {
            expires: 2
        })
    }
}

//get cookie
export const getCookie = (key) => {
    if (window !== 'undefined') {
        return Cookies.get(key);
    }
}

// remove cookie
export const removeCookie = (key) => {
    if (window !== 'undefined') {
        Cookies.remove(key)
    }
}


//set data in localStorage
export const setLocalStorage = (key, value) => {
    if (window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

//get data from localStorage
export const getLocalStorage = (key) => {
    if (window !== 'undefined') {
        return JSON.parse(localStorage.getItem(key));
    }
}

//remove data from localStorage
export const removeLocalStorage = (key) => {
    if (window !== 'undefined') {
        localStorage.removeItem(key);
    }
}


//authenticate method which stores token and username in session and localstorage 
export const storeAuthDetails = (response) => {
    // console.log('AUTHENTICATE HELPER METHOD CALLED');
    const { token, user } = response.data;
    setCookie('token', token);
    setLocalStorage('user', user);
}

//check for authentication
export const isAuth = () => {
    // console.log('ISAUTH HELPER METHOD CALLED');
    const checkCookie = getCookie('token');
    if (checkCookie) {
        const checkLocalStorage = getLocalStorage('user');
        if (checkLocalStorage) {
          return getLocalStorage('user');
        }

        return false;
    }

    return false;
}


//signout fuction
export const signout = (next) => {
    removeCookie('token');
    removeLocalStorage('user');
    next();
}