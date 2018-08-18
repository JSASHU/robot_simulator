import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import cookie from 'react-cookies';

class Simulator extends Component {

  constructor() {
      super();
      this.state = {
        xCord : 0,
        yCord : 0,
        facing : "NORTH",
        placeCommand : false,
        redirect_to_login : false,
        user_token: cookie.load('user_token')
      };
      this.xCordChange = this.xCordChange.bind(this);
      this.yCordChange = this.yCordChange.bind(this);
      this.facingChange = this.facingChange.bind(this);
      this.place = this.place.bind(this);
      this.move = this.move.bind(this);
      this.rotateLeft = this.rotateLeft.bind(this);
      this.rotateRight = this.rotateRight.bind(this);
      this.report = this.report.bind(this);
      this.offline = this.offline.bind(this);
      this.command = this.command.bind(this);
      this.renderFunction = this.renderFunction.bind(this);
      this.executeQueue = this.executeQueue.bind(this);
      this.logs = this.logs.bind(this);
      this.logout = this.logout.bind(this);

      if(!this.state.user_token){
          this.state.redirect_to_login = true;
      }
  }

  xCordChange(event) {
      this.setState({xCord: event.target.value});
  }

  yCordChange(event) {
      this.setState({yCord: event.target.value});
  }

  facingChange(event) {
      this.setState({facing: event.target.value});
  }

  place() {
      var query = "?cmd=PLACE&x="+this.state.xCord
      +"&y="+this.state.yCord+"&facing="+this.state.facing;
      this.command(query);
  }

  move() {
      var query = "?cmd=MOVE";
      this.command(query);
  }

  rotateLeft() {
      var query = "?cmd=LEFT";
      this.command(query);  
  }

  rotateRight() {
      var query = "?cmd=RIGHT";
      this.command(query);
  }

  report() {
      var query = "?cmd=REPORT";
      this.command(query);
  }

  offline() {
      var query = "?cmd=OFFLINE";
      this.logs("Robot Is Offline");
      this.command(query);
      setTimeout(() => {
          this.logs("Robot Is Online");
          this.executeQueue()
      }, 5000);
  }

  command(data){
    var url = "https://d9lddp630g.execute-api.us-east-1.amazonaws.com/QA/robot/execute-command"+data;
    $.ajax({
        type: 'GET',
        headers : {
          "user_token" : cookie.load('user_token')
        },
        url: url
    })
    .done(function(data) {
      if(data.placement){
        this.setState({placeCommand: data.placement});
        this.renderFunction(data);
        var log = data.message +" "+data.x+" "+data.y+" "+data.facing;
        this.logs(log);
      }else{
        this.logs(data.message);
      }
    }.bind(this))
    .fail(function(data) {
      this.logs("Here Fail :: ");
    }.bind(this));
  }

  executeQueue(){
    $.ajax({
        type: 'GET',
        headers : {
          "user_token" : cookie.load('user_token')
        },
        url: 'https://d9lddp630g.execute-api.us-east-1.amazonaws.com/QA/robot/execute-queue'
    })
    .done(function(data) {
      if(data.placement){
        this.setState({placeCommand: data.placement});
        this.renderFunction(data);
      }else{
        this.logs(data.message);
      }
    }.bind(this))
    .fail(function(data) {
      this.logs("Here Fail :: ",data.message);
    }.bind(this));
  }

  renderFunction(data) {
      var robotElement = this.refs.robot;
      if (this.state.placeCommand) {
          robotElement.classList.add('placed');
      } else {
          robotElement.classList.remove('placed');
      }
      robotElement.setAttribute('data-direction', data.facing.toLowerCase());
      robotElement.setAttribute('style', `bottom: ${data.y * 16}%; left: ${data.x * 16}%`);
  }

  logs(str){
      const logWindow = this.refs.log;
      const element = document.createElement('p');
      element.appendChild(document.createTextNode(str));
      if (logWindow.childNodes.length === 0) {
          logWindow.appendChild(element);
      } else {
          logWindow.insertBefore(element, logWindow.childNodes[0]);
      }
  }
  
  logout(){
    cookie.save("user_token", "");
    window.location.reload();
  }

  render() {
    if(this.state.redirect_to_login){
        return <Redirect to="/login"/>
    }
    return (
      <div className="wrap">
        <div className="field">
          <button type="button" className="login" onClick={this.logout}>Logout</button>
          <h1>Table</h1>
          <div className="table">
            <div className="robot" ref="robot">This side up</div>
          </div>
        </div>
        <div className="controls">
          <h1>Controls</h1>
          <div className="control-group main">
            <label>X Coordinate</label>
            <input className="placeX" type="number" defaultValue={0} onChange={this.xCordChange} />
            <label>Y Coordinate</label>
            <input className="placeY" type="number" defaultValue={0} onChange={this.yCordChange} />
            <label>Direction Facing</label>
            <select className="placeDirection" onChange={this.facingChange}>
              <option value="NORTH" selected="selected">North</option>
              <option value="SOUTH">South</option>
              <option value="EAST">East</option>
              <option value="WEST">West</option>
            </select>
            <button className="place" onClick={this.place}>Place</button>
            <button className="place" onClick={this.offline}>Make Offline</button>
          </div>
          <div className="control-group flex">
            <button className="move" onClick={this.move}>Move</button>
            <button className="rotateLeft" onClick={this.rotateLeft}>Rotate Left</button>
            <button className="rotateRight" onClick={this.rotateRight}>Rotate Right</button>
            <button className="report" onClick={this.report}>Report</button>
          </div>
          <div className="log" ref='log' />
        </div>
      </div>
    );
  }
}
 
export default Simulator;
