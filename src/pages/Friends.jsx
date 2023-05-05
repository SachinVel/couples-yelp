import React, { useEffect, useRef, useState } from 'react';
import { Button, TextField, Link, Box, Alert, Divider, Typography, Stack, Dialog, DialogTitle } from '@mui/material';
import '../styles/Layout.css';
import '../styles/Friends.css';
import Header from '../components/Header';
import { backendCall } from "../utils/network";

import Snackbar from '@mui/material/Snackbar';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { DataGrid } from '@mui/x-data-grid';

export default function Friends() {

    const [message, setMessage] = useState('');
    const [snackType, setSnackType] = useState('success');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const location = useLocation();
    const [friends, setFriends] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [isAddFriendPopupOpen, setIsAddFriendPopupOpen] = useState(false);
    const [addUsername, setAddUsername] = useState('');
    const [token, setToken] = useState('');



    const hanldeSnackbarClose = () => {
        setIsSnackbarOpen(false)
    }

    const handleAlreadyLogin = () => {
        setSnackType('success');
        setMessage('You are already logged in.');
        setIsSnackbarOpen(true);
    }

    const handleLoginSuccessful = () => {
        setSnackType('success');
        setMessage('You logged in successfully.');
        setIsSnackbarOpen(true);
    }

    const friendColumns = [
        { field: 'username', headerName: 'Username', flex: 1, headerClassName: 'list-header' },
    ]

    const receivedColumns = [
        { field: 'username', headerName: 'Username', flex: 1, headerClassName: 'list-header' },
        {
            field: "action",
            headerClassName: 'list-header',
            headerName: "Action",
            flex: 1,
            renderCell: ({ row }) =>
                <Stack direction="row" gap={2} >
                    <Button color="success" variant='contained' onClick={() => handleFriendRequestAccept(row.username)}>
                        Accept
                    </Button>
                    <Button color="error" variant='contained' onClick={() => handleFriendRequestReject(row.username)}>
                        Reject
                    </Button>
                </Stack>

        },
    ]

    const sentColumns = [
        { field: 'username', headerName: 'Username', flex: 1, headerClassName: 'list-header' },
        { field: 'status', headerName: 'Status', flex: 1, headerClassName: 'list-header' },
    ]

    const handleFriendRequestAccept = async (username) => {
        let data = {
            username: username,
            status: "accept"
        }
        let response = await backendCall.post('/user/updateFriendRequest', data, {
            headers: {
                'token': token
            }
        });
        setSnackType('error');
        setMessage('Friend request has been accepted.');
        setIsSnackbarOpen(true);
        getFriendsStatus();
    }

    const handleFriendRequestReject = async (username) => {
        let data = {
            username: username,
            status: "reject"
        }
        let response = await backendCall.post('/user/updateFriendRequest', data, {
            headers: {
                'token': token
            }
        });
        setSnackType('error');
        setMessage('Friend request has been rejected.');
        setIsSnackbarOpen(true);
        getFriendsStatus();
    }

    const getFriendsStatus = async (userToken = token) => {

        let response = await backendCall.get('/user/getFriends', {
            headers: {
                'token': userToken
            }
        });

        console.log('response : ', response);
        let data = response.data;

        let friends = data.friends.map((friend) => {
            friend.id = friend._id;
            return friend;
        })
        let receivedRequest = data.receivedRequest.map((friend) => {

            friend.id = friend._id;
            let isFriendList = friends.filter((f) => f.id == friend.id).length > 0;
            if (isFriendList) {
                return null
            } else {
                return friend;
            }
        })
        receivedRequest = receivedRequest.filter((f)=>f!=null);
        let sentRequest = data.sentRequest.map((friend) => {
            friend.id = friend._id;
            friend.status = 'pending';
            let isFriendList = friends.filter((f) => f.id == friend.id).length > 0;
            if (isFriendList) {
                return null
            } else {
                return friend;
            }
        });
        sentRequest = sentRequest.filter((f)=>f!=null);
        setFriends(friends);
        setReceivedRequests(receivedRequest);
        setSentRequests(sentRequest);

    }

    useEffect(() => {

        let state = location.state;
        if (state !== null && state.isLoggedIn) {
            handleAlreadyLogin();
        } else if (state !== null && state.isLoginSuccessful) {
            handleLoginSuccessful();
        }

        let userToken = localStorage.getItem('token');

        setToken(userToken);

        getFriendsStatus(userToken)

    }, []);

    function DataGridFriendTitle() {
        return (
            <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h5">Friends</Typography>
            </Box>
        )
    }

    function DataGridRequestTitle() {
        return (
            <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h5">Friends whom you sent request</Typography>
            </Box>
        )
    }

    function DataGridInviteTitle() {
        return (
            <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h5">Friends who invited you</Typography>
            </Box>
        )
    }



    const handleDialogClose = () => {
        setIsAddFriendPopupOpen(false);
    }

    const handleAddUser = async () => {
        console.log("username : ", addUsername);
        let data = {
            username: addUsername
        }
        let response = await backendCall.post('/user/addFriend', data, {
            headers: {
                'token': token
            }
        });

        await getFriendsStatus();
        setSnackType('success');
        setMessage('Friend request has been sent.');
        setIsSnackbarOpen(true);
        setIsAddFriendPopupOpen(false);

    }


    return (
        <Box className="friends-container">
            <Stack direction="row" justifyContent="center" alignContent="center" className='friend-btn-container'>
                <Button variant="contained" onClick={() => { setIsAddFriendPopupOpen(true) }}>Add Friend</Button>
            </Stack>
            <Box className="table-container">
                <DataGrid
                    className='friends-board'
                    rows={friends}
                    columns={friendColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    components={{ Toolbar: DataGridFriendTitle }}
                    pageSizeOptions={[10, 25, 50]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    disableColumnMenu={true}
                />
            </Box>
            <Box className="table-container">
                <DataGrid
                    className='friends-board'
                    rows={sentRequests}
                    columns={sentColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    components={{ Toolbar: DataGridRequestTitle }}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    disableColumnMenu={true}
                />
            </Box>
            <Box className="table-container">
                <DataGrid
                    className='friends-board'
                    rows={receivedRequests}
                    columns={receivedColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    checkboxSelection={false}
                    components={{ Toolbar: DataGridInviteTitle }}
                    disableRowSelectionOnClick
                    disableColumnMenu={true}
                />
            </Box>

            <Dialog
                open={isAddFriendPopupOpen}
                onClose={handleDialogClose}
                sx={{
                    padding: "20px"
                }}
            >
                <DialogTitle>Add new friend</DialogTitle>
                <Box sx={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    width: "400px"
                }}>
                    <TextField label="Username" sx={{ width: "300px" }} value={addUsername} onChange={(event) => { setAddUsername(event.target.value) }}></TextField>
                    <Stack direction="row" gap={5} justifyContent="center">
                        <Button variant='contained' sx={{ width: "150px" }} onClick={() => { handleAddUser() }}>Add Friend</Button>
                        <Button variant='contained' sx={{ backgroundColor: "grey", width: "150px" }} onClick={() => { handleDialogClose() }}>Cancel</Button>
                    </Stack>

                </Box>

            </Dialog>

            <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={hanldeSnackbarClose}>
                <Alert severity={snackType} onClose={hanldeSnackbarClose}>{message}</Alert>
            </Snackbar>
        </Box>

    );
}
