/** @format */

import { combineReducers } from '@reduxjs/toolkit';
import formReducer from "../slices/formSlice";
import webbookingReducer from "../slices/webbookingSlice";
import authReducer from "../slices/authSlice"

const rootReducer = combineReducers({
	forms: formReducer,
	webbookings: webbookingReducer,
	auth: authReducer,
});

export default rootReducer;
