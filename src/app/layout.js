import React from 'react';
import Header from './component/Header';
import App from './main/App';
import Map from './map/Map';

const Layout = ({ children }) => {
  return (
    <html lang="ko">
      <body>
        <Header />
        <App />
       <Map />
        {children}
      </body>
    </html>
  );
};

export default Layout;
