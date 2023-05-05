import React, { useEffect, useRef, useState } from 'react';
import { Button, TextField, Link, Box, Alert, Divider, Typography, Stack, Select, Dialog, DialogTitle, MenuItem, InputLabel, FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import '../styles/Layout.css';
import '../styles/Outing.css';

import Snackbar from '@mui/material/Snackbar';
import { useLocation, useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import OutingView from '../components/OutingView';
import { backendCall } from '../utils/network';

export default function Home() {

    const [message, setMessage] = useState('');
    const [snackType, setSnackType] = useState('success');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [outingList, setOutingList] = useState([]);
    const [selectedOutingId, setSelectedOutingId] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriendId, setSelectedFriendId] = useState('');
    const [outingDate, setOutingDate] = useState(dayjs(new Date()))
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [outingId, setOutingId] = useState(null);
    const [userRole, setUserRole] = useState("1");
    const [friendRole, setFriendRole] = useState("2");
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState('');

    const handleViewOuting = (outingId) => {
        setOutingId(outingId);
    }

    const outingColumns = [
        { field: 'friend', headerName: 'Friend', flex: 2, headerClassName: 'list-header' },
        {
            field: 'date', headerName: 'Date', flex: 1, headerClassName: 'list-header',
        },
        {
            field: 'isFinalized', headerName: 'Is Finalized', flex: 1, headerClassName: 'list-header',
            valueFormatter: row =>
                row.isFinalized ? 'Yes' : 'No',
        },
        {
            field: "action",
            headerClassName: 'list-header',
            headerName: "Action",
            flex: 1,
            sortable: false,
            renderCell: ({ row }) =>
                <Stack direction="row" gap={2} >
                    <Button variant='contained' onClick={() => handleViewOuting(row.id)}>
                        View
                    </Button>
                </Stack>

        },

    ]

    const hanldeSnackbarClose = () => {
        setIsSnackbarOpen(false);
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

    function DataGridOutingTitle() {
        return (
            <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                <Typography variant="h5">Your Outing List</Typography>
            </Box>
        )
    }

    const getUserOutings = async (userToken=token) => {

        let response = await backendCall.get('/outing/getAllOutings', {
            headers: {
                'token': userToken
            }
        });

        console.log('response : ',response);
        if( response.data && response.data.outings ){
            let newData = response.data.outings.map((outing)=>{
                let res = {};
                res.id = outing.id;
                res.friend = outing.friend.username;
                res.isFinalized = outing.isFinalized;
                res.date = dayjs(+outing.date).format("MM/DD/YYYY");
                return res;
            })
            setOutingList(newData);
        }
    }

    useEffect(() => {
        

        const getFriendsList = async (userToken) => {
            let response = await backendCall.get('/user/getFriends', {
                headers: {
                    'token': userToken
                }
            });

            let data = response.data;

            let friends = data.friends.map((friend) => {
                friend.id = friend._id;
                return friend;
            })
            setFriends(friends);
        }

        let state = location.state;
        if (state !== null && state.isLoggedIn) {
            handleAlreadyLogin();
        } else if (state !== null && state.isLoginSuccessful) {
            handleLoginSuccessful();
        }

        let userToken = localStorage.getItem('token');

        setToken(userToken);

        getUserOutings(userToken);
        getFriendsList(userToken);

        navigate(location.pathname, {});
    }, []);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    }

    const handleAddOuting = async () => {
        if( selectedFriendId==null || selectedFriendId=='' || outingDate==null || userRole==null || friendRole==null ){
            setSnackType('error');
            setMessage('Some fields are empty');
            setIsSnackbarOpen(true);
            return;
        }
        let outingData = {
            friendId : selectedFriendId,
            date : (outingDate.unix()*1000)+'',
            userRole : userRole,
            friendRole : friendRole
        }

        let response = await backendCall.post('/outing/createOuting', outingData, {
            headers: {
                'token': token
            }
        });

        await getUserOutings();

        setSnackType('success');
        setMessage('Outing created successfully');
        setIsSnackbarOpen(true);
        
        setIsDialogOpen(false);
        
        
    }

    const handleUserRoleChange = (event, newRole) => {
        console.log('newRole : ', newRole);
        if (newRole == null) {
            return;
        }
        setUserRole(newRole);
        let OtherRole = newRole == 1 ? 2 : 1;
        OtherRole = OtherRole + "";
        setFriendRole(OtherRole);
    }

    const handleFriendRoleChange = (event, newRole) => {
        console.log('newRole : ', newRole);
        if (newRole == null) {
            return;
        }
        setFriendRole(newRole);
        let OtherRole = newRole == 1 ? 2 : 1;
        OtherRole = OtherRole + "";
        setUserRole(OtherRole);
    }

    return (
        <Box className="outing-container">
            {
                friends.length !== 0 && outingId == null && <Stack gap={2} direction="row" justifyContent="center">
                    <Button variant='contained' onClick={() => { setIsDialogOpen(true) }}><AddCircleIcon /> &nbsp;&nbsp;Outing</Button>
                </Stack>
            }

            {
                outingId == null &&
                <DataGrid
                    className='outing-list'
                    rows={outingList}
                    columns={outingColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    components={{ Toolbar: DataGridOutingTitle }}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    disableColumnMenu={true}
                />
            }

            {
                outingId != null &&
                <OutingView outingId={outingId} setOutingId={setOutingId} token={token}/>
            }


            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                sx={{
                    padding: "20px"
                }}
            >
                <DialogTitle>Add new outing</DialogTitle>
                <Box sx={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    width: "400px"
                }}>
                    <FormControl fullWidth sx={{
                        display: "flex",
                        gap: "30px",

                    }}>
                        <InputLabel id="friend-label">Friend</InputLabel>
                        <Select
                            label="Friend"
                            value={selectedFriendId}
                            onChange={(event) => { setSelectedFriendId(event.target.value) }}
                        >
                            {
                                friends.map((friend) => {
                                    return (< MenuItem key={friend.id} value={friend.id}>{friend.username}</MenuItem>);
                                })

                            }
                        </Select>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Outing Date" minDate={dayjs(new Date())} value={outingDate} onChange={(value) => { setOutingDate(value) }} />
                        </LocalizationProvider>

                        <Box>
                            <Typography>Your role </Typography>
                            <ToggleButtonGroup
                                value={userRole}
                                exclusive
                                onChange={handleUserRoleChange}
                            >
                                <ToggleButton value="1" >
                                    <Typography>Option Provider</Typography>
                                </ToggleButton>
                                <ToggleButton value="2" >
                                    <Typography>Approver</Typography>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box>
                            <Typography>Friend role </Typography>
                            <ToggleButtonGroup
                                value={friendRole}
                                exclusive
                                onChange={handleFriendRoleChange}
                            >
                                <ToggleButton value="1" >
                                    <Typography>Option Provider</Typography>
                                </ToggleButton>
                                <ToggleButton value="2" >
                                    <Typography>Approver</Typography>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Stack direction="row" gap={5} justifyContent="center">
                            <Button variant='contained' sx={{ width: "170px" }} onClick={() => { handleAddOuting() }}>Create Outing</Button>
                            <Button variant='contained' sx={{ backgroundColor: "grey", width: "170px" }} onClick={() => { handleDialogClose() }}>Cancel</Button>
                        </Stack>
                    </FormControl>

                </Box>

            </Dialog>
            <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={hanldeSnackbarClose}>
                <Alert severity={snackType} onClose={hanldeSnackbarClose}>{message}</Alert>
            </Snackbar>
        </Box >

    );
}
