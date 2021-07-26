
import React from 'react';
import { Auth } from 'aws-amplify';
import DynamicImage from '../components/DynamicImage';
import { withRouter } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import { Link } from 'react-router-dom';

import '../css/app.css';

/**
 * Sign-in Page
 */
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      email: '',
      password: '',
      code: '',
      userObject: null
    };
  }

  async onSubmitForm(e) {
    e.preventDefault();
    try {
        const userObject = await Auth.signIn(
            this.state.email.replace(/[@.]/g, '|'),
            this.state.password
        );
        console.log('userObject', userObject);
        if (userObject.challengeName) {
            this.setState({ userObject, stage: 1 });
        } else {
          
            const session = await Auth.currentSession();
            console.log('Cognito User Identity Token:', session.getIdToken().getJwtToken());
            this.setState({ stage: 0, email: '', password: '', code: '' });
            this.props.history.replace('/app');
        }
    } catch (err) {
        alert(err.message);
        console.error('Auth.signIn(): ', err);
    }
}

async onSubmitVerification(e) {
    e.preventDefault();
    try {
        const data = await Auth.confirmSignIn(
        this.state.userObject,
        this.state.code
        );
        console.log('Cognito User Data:', data);
        const session = await Auth.currentSession();
        // console.log('Cognito User Access Token:', session.getAccessToken().getJwtToken());
        console.log('Cognito User Identity Token:', session.getIdToken().getJwtToken());
        // console.log('Cognito User Refresh Token', session.getRefreshToken().getToken());
        this.setState({ stage: 0, email: '', password: '', code: '' });
        this.props.history.replace('/app');
    } catch (err) {
        alert(err.message);
        console.error('Auth.confirmSignIn(): ', err);
    }
}

  onEmailChanged(e) {
    this.setState({ email: e.target.value.toLowerCase() });
  }

  onPasswordChanged(e) {
    this.setState({ password: e.target.value });
  }

  onCodeChanged(e) {
    this.setState({ code: e.target.value });
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  renderSignIn() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidPassword = this.state.password.length > 1;

    return (
      <div className="app">
        <header>
          <DynamicImage src="logo.png"/>
        </header>
        <section className="form-wrap">
          <h1>Sign in</h1>
          <SiteNav/>
          <form id="registrationForm" onSubmit={(e) => this.onSubmitForm(e)}>
            <input className={isValidEmail?'valid':'invalid'} type="email" placeholder="Email" value={this.state.email} onChange={(e) => this.onEmailChanged(e)}/>
            <input className={isValidPassword?'valid':'invalid'} type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.onPasswordChanged(e)}/>
            <input disabled={!(isValidEmail && isValidPassword)} type="submit" value="Let's Ryde"/>
          </form>
        </section>
      </div>
    );
  }

  renderConfirm() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidCode = this.state.code.length === 6;

    return (
      <div className="app">
        <header>
          <DynamicImage src="logo.png"/>
        </header>
        <section className="form-wrap">
          <h1>Enter MFA Code</h1>
          <form id="verifyForm" onSubmit={(e) => this.onSubmitVerification(e)}>
            <input className={isValidEmail?'valid':'invalid'} type="email" placeholder="Email" value={this.state.email}/>
            <input className={isValidCode?'valid':'invalid'} type="text" placeholder="Verification Code" value={this.state.code} onChange={(e) => this.onCodeChanged(e)}/>
            <input disabled={!(isValidCode&&isValidEmail)} type="submit" value="Verify"/>
          </form>
        </section>
      </div>
    );
  }

  render() {
    switch (this.state.stage) {
      case 0:
      default:
        return this.renderSignIn();
      case 1:
        return this.renderConfirm();
    }
  }
}

export default withRouter(SignIn);
