

import React from 'react'
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { Auth } from 'aws-amplify';

import '../css/main.css';

import MUIDataTable from 'mui-datatables'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { createTheme } from '@material-ui/core/styles'

import { Link } from 'react-router-dom';
const AWS = require('aws-sdk');


AWS.config.update({ region: 'us-east-1', 'accessKeyId': 'AKIAXJPGEEDHGTRSHOKC', 'secretAccessKey': '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' });
var cognito = new AWS.CognitoIdentityServiceProvider();

const tableTheme = (createTheme) ({
  overrides: {
    MUIDataTableHeadCell: {
      root: {
     
        color: '#000',
        paddingTop: '3px',
        fontWeight: 'bolder',
        paddingBottom: '3px',
      },
    },
    MUIDataTableBodyCell: {
      root: {
      
        paddingTop: '3px',
        backgroundColor: '#FFF',
        paddingBottom: '3px',
      },
    },
  },
  })

const options = {
  filter: true,
  search: true,
  sort:true,
  viewColumns: true,
  print: true,
  download: true,
  filterType: 'dropdown',
  responsive: 'stacked',
  resizableColumns: true,
  rowsPerPageOptions: [5, 10, 15],
  rowsPerPage: 5,
  selectableRows: 'none',
}

const columns = [
  
    {
      name: 'Username',
      label: 'Username',
      options: {
        filter: true,
      },
    },
    {
      name: 'UserStatus',
      label: 'UserStatus',
      options: {
        filter: true,
      },
    },
   
    {
    name: 'UserLastModifiedDate',
      options: {
        filter: true,
        sort: true,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (<p>{value.toDateString()}</p>)
        }
      }
    },
    {
      name: 'UserCreateDate',
        options: {
          filter: true,
          sort: true,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {    
            return (<p>{value.toDateString()}</p>)
          }
        }
      },
      {
        name: 'Enabled',
          options: {
            filter: true,
            sort: true,
            empty: true,
            customBodyRender: (value, tableMeta, updateValue) => {    
              return (<p>{value.toString()}</p>)
            }
          }
        }
    
  
]
class Profile extends React.Component {
    constructor(props) {
        super(props);
        console.log("props")
        console.log(props)
        this.state = {
            user: {
                attributes: {
                    email: 'me@example.com',
                    phone_number: '+1123456789'
                }
            },
            date: new Date(),
            userdata:[]
        }
    }
    

     list = async () => {
          
      console.log("list user method")
      const params = {
        UserPoolId: 'us-east-1_NBUlVCEwF',
        AttributesToGet: [],
        Filter: '',
        Limit: 10,
    };
    

    cognito.listUsers(params, (err, data) => {
      if (err) {
          console.log(err);
          
      }
      else {
          console.log("data", data);
          this.setState({
          
          userdata:data.Users
          });
          
      }
  }) 
        
    }
    componentDidMount() {
        this.list()
        Auth.currentAuthenticatedUser().then(user => {
            console.log('Cognito User', user);
            this.setState({user, image_key: 'profile-' + user.attributes.sub + '.jpg'});
        });;
        

    }

    async onImageLoad(url) {
        console.error('onImageLoad is not yet implemented');
    }

    render() {
      return (
      <div className="page-unicorns">
        <header className="site-header">
          <div>
            
         
    		<table align="center">
    		<tbody>
             <tr>
             <td>E-mail:</td>
             <td>{this.state.user.attributes.email}</td>
             </tr>
              <tr>
             <td>Phone No:</td>
             <td>{this.state.user.attributes.phone_number}</td>
             </tr>
             <tr>
             <td>Time:</td>
             <td>{this.state.date.toLocaleTimeString()}</td>
             </tr>
             </tbody>
            </table>
            <br></br>
            <Link style={{ align: 'left'}} to={'/register'}><b>{" CREATE NEW USER"}</b></Link>
            <br></br>
            <br></br>
            <React.Fragment>
            <MuiThemeProvider theme={tableTheme}>
         <MUIDataTable
              id='externalTable'
              data={this.state.userdata}
              // data={[{name:'hello',email:'hai'},{name:'ok',email:'he'}]}
              data-testid='externalTable'
              columns={columns}
              options={options}
        />
        </MuiThemeProvider>
      </React.Fragment>
    	</div>
          <SiteNav/>
        </header>
        
        <SiteFooter/>
        
     
      
      </div>
     
    );
  }
 
}

export default Profile;
