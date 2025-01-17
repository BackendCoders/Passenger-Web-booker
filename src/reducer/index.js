/** @format */

import { combineReducers } from '@reduxjs/toolkit';
import formReducer from "../slices/formSlice";
import webbookingReducer from "../slices/webbookingSlice";

const rootReducer = combineReducers({
	forms: formReducer,
	webbookings: webbookingReducer,
});

export default rootReducer;
