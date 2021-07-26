
import React from 'react';
import BaseMap from '../components/BaseMap';
import ESRIMap from '../components/ESRIMap';
import { Auth } from 'aws-amplify';
import awsConfig from '../amplify-config';
import '../css/ride.css';
import { Link } from 'react-router-dom';


class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: null,
      idToken: null,
      requestRideEnabled: false,
      apistatus:false,
      updates: [
        'Welcome! Click the map to set your pickup location.'
      ]

    };
  }

  async componentDidMount() {
    const session = await Auth.currentSession();
    this.setState({ authToken: session.accessToken.jwtToken });
    this.setState({ idToken: session.idToken.jwtToken });
  }

  /**
   * Determines if the API is enabled
   *
   * @return {Boolean} true if API is configured
   */
  hasApi() {
    const api = awsConfig.API.endpoints.filter(v => v.endpoint !== '');                                                   
    return (typeof api !== 'undefined');
  }

  
  async onClick() {
    if (!this.state.pin) {
      console.error('No pin present - skipping');
      return true;
    }

    const updates = [ 'Requesting Unicorn' ];
    try {
      this.setState({
        requestRideEnabled: false,
        updates
      });
     
      updates.push([ `Your unicorn, Giddy will be with you at latitude ${this.state.pin.latitude} and ${this.state.pin.longitude}` ]);
      this.setState({ updates });

      
      setTimeout(() => {
        console.log('Ride Complete');
        const updateList = this.state.updates;
        updateList.push([ `giddy has arrived` ]);
        this.setState({
          updates: updateList,
          requestRideEnabled: false,
          apistatus: true,
          pin: null
        });
      }, 3 * 1000);
    } catch (err) {
      console.error(err);
      updates.push([ 'Error finding unicorn' ]);
      this.setState({ updates });
    }
  }

  /**
   * Called when the mapClick happens
   * @param {Point} position the position of the map pin
   */
  onMapClick(position) {
    console.log(`onMapClick(${JSON.stringify(position)})`);
    this.setState({ pin: position, requestRideEnabled: true });
  }

  render() {
    const hasApi = this.hasApi();

    // If API is not configured, but auth is, then output the
    // token.
    if (!hasApi) {
      return (
        <div>
          <BaseMap/>
          <div className="configMessage">
            <div className="backdrop"></div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Successfully Authenticated!</h3>
              </div>
              <div className="panel-body">
                <p>This page is not functional yet because there is no API configured.</p>
                <p>Here is your user's identity token:</p>
                <p className="idToken">{this.state.idToken}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If the API is configured, then display the "requestUnicorn"
    // button.  If data is available (i.e. unicorn is requested),
    // then display the additional patterns (unicorn on map).
    const updateList = this.state.updates.map(
      (v, i) => <li key={i}>{v}</li>
    );
    return (
      
      <div>
        
        <div className="info panel panel-default">
        <Link style={{ color: 'black' }} to={'/profile'} ><b>{"BACK TO PROFILE"}</b></Link>
        
          <div className="panel-heading">
            <button id="request" className="btn btn-primary" disabled={!this.state.requestRideEnabled} onClick={() => this.onClick()}>Request</button>
          </div>
          
          <div className="panel-body">
            <ol id="updates">{updateList}</ol>
            {this.state.apistatus?<a href="https://3zqob10i5l.execute-api.us-east-1.amazonaws.com/Prod">click here to know the status</a>:''}
            
          </div>
         
        </div>
        <div id="main">
          <ESRIMap onMapClick={(position) => { this.onMapClick(position); }}/>
        </div>
      </div>
      
    );
  }
}

export default MainApp;
