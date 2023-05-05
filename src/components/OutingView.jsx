import { useEffect, useRef, useState } from 'react';
import '../styles/Layout.css';
import '../styles/OutingView.css';
import { Alert, Box, Button, InputLabel, MenuItem, Pagination, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';
import axios from 'axios';
import { backendCall } from '../utils/network';

const OutingView = ({ outingId, setOutingId, token }) => {

    const [step1, setStep1] = useState(null);
    const [step2, setStep2] = useState(null);
    const [isStep1Finalized, setStep1Finalized] = useState(false);
    const [isStep2Finalized, setStep2Finalized] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [providerComment, setProviderComment] = useState('');
    const [approverComment, setApproverComment] = useState('');
    const [basicDetails, setBasicDetails] = useState('');
    const [isDataFetched, setDataFetched] = useState('');
    const [curStepNum, setCurStepNum] = useState(1);

    let searchResult = useRef(null);

    let origOutingData = useRef(null);


    const [message, setMessage] = useState('');
    const [snackType, setSnackType] = useState('success');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const [totalFinalize, setTotalFinalize] = useState(false);

    const [restaurantList, setRestaurantList] = useState([]);
    const [selectedRestaurant, setSelectedRestaurent] = useState(null);

    const [locationStr, setLocationStr] = useState('');
    const [price, setPrice] = useState('');
    const [cusine, setCusine] = useState('');

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 4,
        page: 0,
        totalPageSize: 5
    });

    const handlePageChange = (event, newPageNum) => {
        let newPaginationModel = {
            page: newPageNum - 1,
            pageSize: 4,
            totalPageSize: 5
        }
        setPaginationModel(newPaginationModel);
        let res = [...searchResult.current];
        if (res.length >= (newPageNum * 4)) {
            let startInd = (newPageNum - 1) * 4;
            let endInd = (newPageNum) * 4;
            let newList = res.slice(startInd, endInd);
            setRestaurantList(newList);
        }

    }

    const [searchVal, setSearchVal] = useState('');

    const hanldeSnackbarClose = () => {
        setIsSnackbarOpen(false)
    }

    useEffect(() => {
        const getOutingDetail = async () => {
            let response = await backendCall.get('/outing/getOutingById?outingId=' + outingId, {
                headers: {
                    'token': token
                }
            });

            if (response.data && response.data.outings) {
                let data = response.data.outings[0];

                // let response = {
                //     role: 1, // role of current user
                //     isFinalized: false,
                //     date: 123455,
                //     friend: { username: 'John', userId: 1 },
                //     step1: {
                //         isFinalized: true,
                //         data: {
                //             location: 'new york',
                //             price: '1',
                //             cusine: 'Thai'
                //         }
                //     },
                //     step2: {
                //         isFinalized: false,
                //         data: {
                //             id: 1,
                //             name: 'ABC restaurant',
                //             location: 'Hello'
                //         }
                //     },
                //     providerComment: '',
                //     approverComment: ''
                // }

                origOutingData.current = data;

                setStep1(data.step1.data);
                setStep2(data.step2.data);
                setStep1Finalized(data.step1.isFinalized);
                setStep2Finalized(data.step2.isFinalized);
                setUserRole(data.role);
                setApproverComment(data.approverComment);
                setProviderComment(data.providerComment);
                setDataFetched(true);
                setTotalFinalize(data.isFinalized);
                if (data.step1 && Object.keys(data.step1.data).length>0) {
                    setLocationStr(data.step1.data.location);
                    setPrice(data.step1.data.price);
                    setCusine(data.step1.data.cusine);
                }

                if (data.step2 && Object.keys(data.step2.data).length>0) {
                    setSelectedRestaurent(data.step2.data);
                }

                setBasicDetails({
                    friendUsername: data.friend.username,
                    date: dayjs(data.date).format("MMM DD YYYY"),
                    isFinalized: data.isFinalized ? "Yes" : "No"
                });
            }


        }

        getOutingDetail();

        console.log('outingId : ', outingId);

    }, [outingId]);

    const isStep1InputDisabled = () => {
        return userRole == 2 || isStep1Finalized;
    }

    const handleApproverCommentSave = () => {
        let newOutingData = {
            ...origOutingData.current,
            approverComment: approverComment,
        }
        saveOutingData(newOutingData);
    }

    const handleProviderCommentSave = () => {
        let newOutingData = {
            ...origOutingData.current,
            providerComment: providerComment
        }
        saveOutingData(newOutingData);
    }

    const handleStep1Approve = () => {
        let curstep1 = origOutingData.current.step1;
        let data = curstep1.data;
        console.log('step1 : ',curstep1);
        if( data.location==null || data.location=='' || data.price==null || data.price=='' || data.cusine==null || data.cusine=='' ){
            setSnackType('error');
            setMessage('Some fields are empty. So cannot approve');
            setIsSnackbarOpen(true);
            return;
        }
        curstep1.isFinalized = true;
        let newOutingData = {
            ...origOutingData.current,
            step1: curstep1
        }
        setStep1Finalized(true)
        saveOutingData(newOutingData);
    }

    const handleStep2Approve = () => {
        let curstep2 = origOutingData.current.step2;
        if( restaurantList==null ){
            setSnackType('error');
            setMessage('Some fields are empty. So cannot approve');
            setIsSnackbarOpen(true);
            return
        }
        curstep2.isFinalized = true;
        let newOutingData = {
            ...origOutingData.current,
            step2: curstep2,
            isFinalized: true
        }
        setStep2Finalized(true);
        setTotalFinalize(true);
        saveOutingData(newOutingData);
    }

    const handleStepChange = (stepNum) => {
        if (stepNum == 2 && !isStep1Finalized) {
            setSnackType('error');
            setMessage('Step 2 can be accessed after finalizing step 1');
            setIsSnackbarOpen(true);
            return;
        }
        setCurStepNum(stepNum);
    }

    const handleSearch = async () => {

        let params = "limit=20";
        params += "&location=" + locationStr;
        params += "&term=" + searchVal;
        params += "&price=" + price;
        params += "&categories=" + cusine;

        let response = await backendCall.get('/outing/getRestaurants?' + params, {
            headers: {
                'token': token
            }
        });

        searchResult.current = response.data;
        let copy = [...searchResult.current];
        let restaurantList = copy.slice(0, 4);
        setRestaurantList(restaurantList);

    }

    const handleRestaurentSelect = (id) => {
        let resList = [...searchResult.current];
        let selRes = resList.filter((restaurent) => (restaurent.id === id))[0];
        setSelectedRestaurent(selRes);
    }

    const saveOutingData = async (outingData) => {
        //TODO API to store outing details data
        console.log('outingData : ', outingData);
        let data = {
            outingId : outingId,
            data : outingData
        }
        let response = await backendCall.post('/outing/updateOuting', data, {
            headers: {
                'token': token
            }
        });

        console.log('update response : ',response);

        origOutingData.current = outingData;

    }

    const handleSaveStep1 = () => {
        let curstep1 = origOutingData.current.step1;
        curstep1.data = {};
        curstep1.data.location = locationStr;
        curstep1.data.price = price;
        curstep1.data.cusine = cusine;
        let newOutingData = {
            step1: curstep1,
            ...origOutingData.current
        }
        saveOutingData(newOutingData);
    }

    const handleSaveStep2 = () => {
        let curstep2 = origOutingData.current.step2;
        curstep2.data = selectedRestaurant;
        let newOutingData = {
            step2: curstep2,
            ...origOutingData.current
        }
        saveOutingData(newOutingData);
    }


    return (
        <>
            {
                isDataFetched &&
                <Box className="outing-view-container">
                    <Stack direction="row" justifyContent="left">
                        <Button variant='contained' onClick={() => { setOutingId(null) }}> <ChevronLeftIcon /> &nbsp; Back</Button>
                    </Stack>
                    <Box className="outing-details-container">
                        {totalFinalize && <Typography>This outing has been finalized!</Typography>}
                        <Stack direction="row" justifyContent="center" gap={3}>
                            <Typography><b>Friend : </b> {basicDetails.friendUsername}</Typography>
                            <Typography><b>Date : </b> {basicDetails.date}</Typography>
                            <Typography><b>Is Finalized : </b> {basicDetails.isFinalized}</Typography>
                            <Typography><b>Your role : </b> {userRole == 1 ? 'Option Provider' : 'Approver'}</Typography>
                        </Stack>
                        <Stack direction="row">
                            <Box className={isStep1Finalized ? "step-header step-header--completed" : 'step-header'} onClick={() => { handleStepChange(1) }}>
                                <CheckCircleIcon />
                                <Typography>Step 1</Typography>
                            </Box>
                            <Box className={isStep2Finalized ? "step-header step-header--completed" : 'step-header'} onClick={() => { handleStepChange(2) }}>
                                <CheckCircleIcon />
                                <Typography>Step 2</Typography>
                            </Box>
                        </Stack>
                        <Box className="step-container">
                            {
                                curStepNum == 1 &&
                                <>
                                    <Typography sx={{
                                        fontWeight: "bold",
                                        margin: "10px",
                                        fontSize: "20px"
                                    }}>Step 1 : Deciding on filter conditions {isStep1Finalized ? '(Finalized)' : ''}</Typography>
                                    <Box>
                                        <InputLabel>Location : </InputLabel>
                                        <TextField value={locationStr} disabled={isStep1InputDisabled()} onChange={(event) => { setLocationStr(event.target.value) }} />
                                    </Box>
                                    <Box>
                                        <InputLabel>Price : </InputLabel>
                                        <Select value={price} disabled={isStep1InputDisabled()} onChange={(event) => { setPrice(event.target.value) }} sx={{ width: "100px" }} >
                                            <MenuItem value="1">$</MenuItem>
                                            <MenuItem value="2">$$</MenuItem>
                                            <MenuItem value="3">$$$</MenuItem>
                                            <MenuItem value="4">$$$$</MenuItem>
                                        </Select>
                                    </Box>
                                    <Box>
                                        <InputLabel>Cusine : </InputLabel>
                                        <TextField value={cusine} disabled={isStep1InputDisabled()} onChange={(event) => { setCusine(event.target.value) }} />
                                    </Box>
                                    <br></br>
                                    {
                                        !isStep1Finalized && userRole == 1 &&
                                        <Button variant='contained' onClick={() => (handleSaveStep1())}>Save Options</Button>
                                    }
                                    {
                                        !isStep1Finalized && userRole == 2 &&
                                        <Button variant='contained' onClick={() => { handleStep1Approve() }}>Approve</Button>
                                    }
                                </>
                            }
                            {
                                curStepNum == 2 &&
                                <>
                                    <Typography sx={{
                                        fontWeight: "bold",
                                        margin: "10px",
                                        fontSize: "20px"
                                    }}>Step 2 : Deciding on exact restaurant {isStep2Finalized ? '(Finalized)' : ''}</Typography>
                                    {
                                        !isStep2Finalized && userRole == 1 &&
                                        <Box className="search-container">
                                            <Stack gap={2} direction="row" justifyContent="center" alignItems="center">
                                                <TextField label="restaurant name or type" value={searchVal} onChange={(event) => { setSearchVal(event.target.value) }} />
                                                <Button variant='contained' onClick={() => { handleSearch() }} sx={{
                                                    height: "40px"
                                                }}>Search</Button>
                                                <Pagination
                                                    color="primary"
                                                    variant="outlined"
                                                    shape="rounded"
                                                    count={paginationModel.totalPageSize}
                                                    page={paginationModel.page + 1}
                                                    onChange={handlePageChange}
                                                />
                                            </Stack>
                                            <br></br>
                                            <Box className="grid-container">
                                                {
                                                    restaurantList.length !== 0 &&
                                                    restaurantList.map((restaurant) => {
                                                        return (
                                                            <Box key={restaurant.id} className="grid-item">
                                                                <Typography><b>Restaurent Name : </b>{restaurant.name}</Typography>
                                                                <Typography><b>Restaurent Location : </b>{restaurant.location}</Typography>
                                                                <Typography><b>Restaurent Phone : </b>{restaurant.phone}</Typography>
                                                                <Button variant='contained' onClick={() => { handleRestaurentSelect(restaurant.id) }}>Select</Button>
                                                            </Box>
                                                        )

                                                    })
                                                }
                                            </Box>
                                        </Box>
                                    }
                                    <br></br>
                                    <Typography> Selected Restaurant is : </Typography>
                                    <br></br>
                                    {
                                        selectedRestaurant != null &&
                                        <Stack justifyContent="center" direction="row" alignItems="center">
                                            <Box id={selectedRestaurant.id} className="selected-grid" >
                                                <Typography><b>Restaurent Name : </b>{selectedRestaurant.name}</Typography>
                                                <Typography><b>Restaurent Location : </b>{selectedRestaurant.location}</Typography>
                                                <Typography><b>Restaurent Phone : </b>{selectedRestaurant.phone}</Typography>
                                            </Box>
                                        </Stack>
                                    }
                                    <br></br>
                                    {
                                        !isStep2Finalized && userRole == 1 &&
                                        <Button variant='contained' onClick={() => (handleSaveStep2())}>Save Options</Button>
                                    }
                                    {
                                        !isStep2Finalized && userRole == 2 &&
                                        <Button variant='contained' onClick={() => { handleStep2Approve() }}>Approve</Button>
                                    }

                                </>
                            }
                        </Box>
                        <Box className="comment-container">
                            <Box className="specific-comment">
                                <InputLabel>Option Provider Comment</InputLabel>
                                <TextField
                                    multiline={true}
                                    sx={{
                                        width: "250px"
                                    }}
                                    value={providerComment}
                                    disabled={userRole == 2}
                                    rows={3}
                                    onChange={(event) => setProviderComment(event.target.value)}
                                />
                                {
                                    userRole == 1 &&
                                    <Button variant='contained' onClick={() => { handleProviderCommentSave() }}>Save Comment</Button>
                                }
                            </Box>
                            <Box className="specific-comment">
                                <InputLabel>Approver Comment</InputLabel>
                                <TextField
                                    multiline={true}
                                    value={approverComment}
                                    disabled={userRole == 1}
                                    sx={{
                                        width: "250px"
                                    }}
                                    rows={3}
                                    onChange={(event) => setApproverComment(event.target.value)}
                                />
                                {
                                    userRole == 2 &&
                                    <Button variant='contained' onClick={() => { handleApproverCommentSave() }}>Save Comment</Button>
                                }

                            </Box>
                        </Box>

                    </Box>

                </Box>
            }
            <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={hanldeSnackbarClose}>
                <Alert severity={snackType} onClose={hanldeSnackbarClose}>{message}</Alert>
            </Snackbar>
        </>


    )
};

export default OutingView;
