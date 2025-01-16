/** @format */

import { combineReducers } from '@reduxjs/toolkit';
import formReducer from "../slices/formSlice";

const rootReducer = combineReducers({
	forms: formReducer,
});

export default rootReducer;
