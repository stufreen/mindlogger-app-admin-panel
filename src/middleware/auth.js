import * as types from '../actions/actionTypes';

export default store => next => action => {
    if ((action.type === types.SIGN_IN || action.type === types.SIGN_UP) && action.status === 'COMPLETE') {
      localStorage.setItem('auth', JSON.stringify(action.response.authToken));
    }

    if(action.type === types.SIGN_OUT) {
      localStorage.removeItem('auth');
    }

    if(action.type === types.UPDATE_SELF) {
      localStorage.setItem('auth', JSON.stringify(action.data))
    }
    return next(action);
}