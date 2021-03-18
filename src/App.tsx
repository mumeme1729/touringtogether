import React from 'react';
import './App.css';
import Home from './features/home/Home';
import {
  BrowserRouter as Router, 
  Route,
} from "react-router-dom";
import UserProfile from './features/user/UserProfile';
import Header from './features/home/Header';
import SearchList from './features/home/SearchList';
import PlanDetail from './features/plan/PlanDetail';
import Notification from './features/notification/Notification';
import TimeLine from './features/home/TimeLine';

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Route exact path="/" component={Home}/>
        <Route  path="/profile/:id" component={UserProfile}/> 
        <Route  path="/search" component={SearchList}/>
        <Route  path="/plandetail/:id/:id" component={PlanDetail}/>
        <Route path="/notification" component={Notification}/>
        <Route path="/timeline"component={TimeLine}/>
      </Router>
    </div>
  );
}

export default App;
