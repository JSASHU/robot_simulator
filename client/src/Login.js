import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import cookie from 'react-cookies';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            redirect_to_simulator: false,
            user_token: cookie.load('user_token'),
            disable_submit: false,
            show_login_failure: false,
            show_register_failure: false,
            show_login_message: "",
            show_register_message: "",
        };
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loginAndRegsiter = this.loginAndRegsiter.bind(this);
        if(this.state.user_token){
            this.state.redirect_to_simulator = true;
        }
    }

    handleSubmit(isRegister) {
        let hash = btoa('' + this.state.username + ':' + this.state.password);
        if(isRegister){
            this.loginAndRegsiter(hash,true);
        }else{
            this.loginAndRegsiter(hash,false);
        }
    }

    handleChangeUsername(event) {
        this.setState({show_register_failure:false});
        this.setState({show_login_failure:false});
        this.setState({username: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({show_register_failure:false});
        this.setState({show_login_failure:false});
        this.setState({password: event.target.value});
    }

    loginAndRegsiter(data,isRegister) {
        this.setState({disable_submit:true});
        var url = (isRegister ? "https://d9lddp630g.execute-api.us-east-1.amazonaws.com/QA/robot/register" : "https://d9lddp630g.execute-api.us-east-1.amazonaws.com/QA/robot/login");
        $.ajax({
            type: 'POST',
            url: url,
            headers : {
                "Content-Type" : "application/json"
            },
            data: JSON.stringify({hash: data})
        })
        .done(function(data) {
            if(data.success && data.user_token && data.user_token.length) {
                let expires = new Date();
                expires.setDate(expires.getDate() + 10);
                cookie.save("user_token", data.user_token, {expires:expires});
                this.setState({redirect_to_simulator: true});
            }else{
                this.setState({disable_submit:false});
                if(isRegister){
                    this.setState({show_register_failure:true});
                    this.setState({show_login_failure:false});
                    this.setState({show_register_message:data.message});
                }else{
                    this.setState({show_register_failure:false});
                    this.setState({show_login_failure:true});
                    this.setState({show_login_message:data.message});
                }
            }
        }.bind(this))
        .fail(function(data) {
            this.setState({disable_submit:false});
            if(isRegister){
                this.setState({show_register_failure:true});
                this.setState({show_login_failure:false});
                this.setState({show_register_message:data.message});
            }else{
                this.setState({show_register_failure:false});
                this.setState({show_login_failure:true});
                this.setState({show_login_message:data.message});
            }
        }.bind(this));
    }

    render() {
        if(this.state.redirect_to_simulator){
            return <Redirect to="/simulator"/>
        }
        return (
                <div className="loginContainer">
                    <h3>Robot Simulator</h3>
                    <form>
                      <div>
                            <input type="text" className="userDetails userName" id="username" value={this.state.username} onChange={this.handleChangeUsername} placeholder="Enter Username"/>
                      </div>
                      <div>
                            <input type="password" className="userDetails userPassword" id="password" value={this.state.password} onChange={this.handleChangePassword} placeholder="Enter Password"/>
                      </div>
                      <div className="userAction">
                          <span className="loginInnerContainer">
                              <button type="button" className="login" disabled={this.state.disable_submit} onClick={() => this.handleSubmit(false)}>Login</button>
                          </span>

                          <span>
                              <button type="button" className="register" disabled={this.state.disable_submit} onClick={() => this.handleSubmit(true)}>Register</button>
                          </span>
                      </div>
                    </form>
                    {
                        this.state.show_login_failure ?
                            <div className="errorMessage">
                                <strong>Failed!</strong>{this.state.show_login_message}
                            </div>
                            :
                            null
                    }
                    {
                        this.state.show_register_failure ?
                            <div className="errorMessage">
                                <strong>Failed!</strong>{this.state.show_register_failure}
                            </div>
                            :
                            null
                    }

                </div>
        );
    }
}

export default Login;
