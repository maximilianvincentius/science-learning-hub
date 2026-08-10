import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import './index.css';

const themeProvider = {
  components: {
    Modal: {
      titleFontSize: '24px'
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={themeProvider}>
      <AuthProvider>
        <RouterProvider router={App} />
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
);
