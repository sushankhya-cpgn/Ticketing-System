import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from "react-redux"
import App from './App.jsx'
import store from '../app/store.ts';
import { ToastContainer } from 'react-toastify';



const rootElement = document.getElementById('root');
if(rootElement){
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
      <App />
      <ToastContainer/>
      </Provider>
    </StrictMode>,
  )
}

