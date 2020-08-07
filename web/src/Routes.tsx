import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { NavMenu } from './shared/NavMenu';


export const Routes: React.FC = () => {
  return(
    <BrowserRouter>
    <div className="main-app-layout">
      <div className="sidebar">
          <NavMenu />
      </div>
        
      <div className="main">
          <div className="top-row px-4">
              <a href="https://github.com/Mroberts91" target="_blank" rel="noopener noreferrer" className="ml-md-auto">My GitHub</a>
          </div>
          <div className="content px-4">
            <Switch>
              <Route exact path="/" component={ Home } />
              <Route exact path="/register" component={ Register } />
              <Route exact path="/login" component={ Login } />
            </Switch>
          </div>
      </div>
    </div>
    </BrowserRouter>
  )
}
