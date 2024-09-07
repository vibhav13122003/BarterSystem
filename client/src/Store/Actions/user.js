// import * as api from '../../Api/user';
import { userActions } from '../Reducers/user';

export const fetchs = () => {
    return async dispatch => {
        try {
            const data = []
            // const { data } = await api.gets();
            dispatch(
                userActions.FETCH_S(data)
            );
        } catch (error) {
            
        }
    }
}

export const login = (response) => {
    return async dispatch => {
        try {
            localStorage.setItem('auth_token', JSON.stringify(response.token));
            localStorage.setItem('role', JSON.stringify(response.user.role));
            localStorage.setItem('user', JSON.stringify(response.user));
            dispatch(userActions.CHANGE_LOGIN(true));
            dispatch(userActions.UPDATE_USER(response.user));
        } catch (error) {
            
        }
    }
}

export const signup = (response) => {
    return async dispatch => {
        try {
            localStorage.setItem('auth_token', JSON.stringify(response.token));
            localStorage.setItem('role', JSON.stringify(response.user.role));
            localStorage.setItem('user', JSON.stringify(response.user));
            dispatch(userActions.CHANGE_LOGIN(true));
            dispatch(userActions.UPDATE_USER(response.user));
        } catch (error) {
            
        }
    }
}


export const signout = () => {
    return async dispatch => {
        try {
            localStorage.removeItem("-app-user");
            dispatch(userActions.CHANGE_LOGIN(false));
        } catch (error) {
            
        }
    }
}

export const isSignin = () => {
    
    
    return async dispatch => {
        localStorage.getItem('auth_token') ? dispatch(userActions.CHANGE_LOGIN(true)) : dispatch(userActions.CHANGE_LOGIN(false));
        localStorage.getItem('user') && dispatch(userActions.UPDATE_USER(JSON.parse(localStorage.getItem('user'))));
    }
}

export const updateFav = (id, isAdding) => {
    return async dispatch => {
        if (isAdding) {
            dispatch(userActions.ADD_FAV(id));
        } else {
            dispatch(userActions.REMOVE_FAV(id));
        }
    }
}

export const addAllProducts = (products) => {
    return async dispatch => {
        dispatch(userActions.ADD_ALL_PRODUCTS(products))
    }
}



export const deleteSingleProduct = (product) => {
    return async dispatch => {

        dispatch(userActions.DELETE_PRODUCT(product._id))
    }
}


export const editSingleProduct = (product) => {
    return async dispatch => {

        dispatch(userActions.EDIT_PRODUCT(product))
    }
}


export const changeDealStatus = (status) => {
    return async dispatch => {

        dispatch(userActions.CHANGE_DEAL_STATUS(status))
    }
}


