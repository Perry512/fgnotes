import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { ErrorBoundary } from "react-error-boundary"

import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ErrorBoundary fallback={<div> <p> Something went wrong, please refresh the page </p></div>}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      </ErrorBoundary>
  </StrictMode>
);