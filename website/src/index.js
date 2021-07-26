
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Home, FAQ, Investors, MainApp, Unicorns, Profile } from './pages';
import { SignIn, SignUp } from './auth';
import 'normalize.css';
import Amplify from 'aws-amplify';
import awsConfig from './amplify-config';

Amplify.configure(awsConfig);

const isAuthenticated = () => Amplify.Auth.user !== null;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
    isAuthenticated() === true
      ? <Component {...props} />
      : <Redirect to='/signin' />
  )} />
)

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/faq" component={FAQ} />
          <Route path="/investors" component={Investors} />
          <Route path="/unicorns" component={Unicorns} />
          <Route path="/register" component={SignUp} />
	        <Route path="/signin" component={SignIn} />
          <Route path="/profile" component={Profile} />
          <PrivateRoute path="/app" component={MainApp} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
