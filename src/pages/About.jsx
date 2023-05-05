import React, { useEffect, useState } from 'react';
import { Button, TextField, Link, Box, Typography, List, ListItem } from '@mui/material';
import '../styles/Layout.css';
import Header from '../components/Header';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { backendCall } from "../utils/network";
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';



const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function About({ setLoggedIn }) {

    return (

        <>
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <List>
                    <ListItem>1. First step in this application is to add friends</ListItem>
                    <ListItem>2. You can send friend request and other user has to accept the request in order to be friends </ListItem>
                    <ListItem>3. Similarly you can accept or reject other users' friend request. </ListItem>
                    <ListItem>4. After friendship is established, You can create outing with the friend. </ListItem>
                    <ListItem>5. It'll be chaotic if both users suggests places and both picks places from the options.  </ListItem>
                    <ListItem>6. So we came up with the role based approach. There are two roles  </ListItem>
                    <ListItem>7. Option provider - This role is to provide options. This user can view feedback from other user and modify the choices.</ListItem>
                    <ListItem>8. Approver - This role is to approve the options provided by other user. If this user doesn't approve the choices made by other user. The place will not be finalised.</ListItem>
                    <ListItem>9. In order to be super fair, the roles can be switched at alternative times between friends to give fair chance for everyone.</ListItem>
                    <ListItem>Note. Strict checks are not implemented. So The application will expect correct inputs from users. For example - only valid location should be given in location input.</ListItem>
                </List>
            </Box>
        </>

    );
}
