import React, { useEffect, useState } from 'react';
import { Button, TextField, Link } from '@mui/material';
import '../styles/Layout.css';
import Header from '../components/Header';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { backendCall } from "../utils/network";



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Login() {

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMesage, setErrorMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
   

  const onUsernameChange = (event) => {
    setUserName(event.target.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const login = async (event) => {
    event.preventDefault();

    

    await backendCall.post('/user/login', {
      username: username,
      password: password,
    }).then((res) => {
      window.localStorage.setItem('token', res.data.token);
      window.localStorage.setItexm('username', res.data.username);
      window.location = '/game';
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMessage(err.response.data.error);
        setIsSnackbarOpen(true);
      }
    });
  }

  const hanldeSnackbarClose = () =>{
    setIsSnackbarOpen(false)
  }

  useEffect(()=>{
    let userToken = localStorage.getItem('token');
    if( userToken!=null && userToken!='' ){
      window.location = '/game';
    }
  },[])

  return (
    <>
      <Header />
      <div style={{ marginTop: '150px' }}>
        <div>
          <h2>Login</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={username}
            onChange={onUsernameChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={username === '' || password === ''}
            onClick={login}
          >
            Login
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link href="/register">
            Register
          </Link>
        </div>
      </div>
      <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={hanldeSnackbarClose}>
        <Alert severity="error" onClose={hanldeSnackbarClose}>{errorMesage}</Alert>
      </Snackbar>
    </>

  );
}
