import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import './index.css';

const store = configureStore({
	reducer: rootReducer,
})

ReactDOM.createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
		 <Provider store={store}>
			<App />
		 </Provider>
		</BrowserRouter>
	</StrictMode>
);
