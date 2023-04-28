import React, { useEffect, useRef, useState } from 'react';
import { Button, TextField, Link, Box, Alert, Divider, Typography, Stack } from '@mui/material';
import '../styles/Layout.css';
import '../styles/Game.css';
import Header from '../components/Header';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { backendCall } from "../utils/network";

import img0 from "../images/hangman-0.jpg";
import img1 from "../images/hangman-1.jpg";
import img2 from "../images/hangman-2.jpg";
import img3 from "../images/hangman-3.jpg";
import img4 from "../images/hangman-4.jpg";
import img5 from "../images/hangman-5.jpg";
import img6 from "../images/hangman-6.jpg";
import { fontWeight, padding } from '@xstyled/styled-components';
import { DataGrid } from '@mui/x-data-grid';



export default function Login() {

    const [errorMesage, setErrorMessage] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [gameType, setGameType] = useState('');
    const [originalWord, setOriginalWord] = useState('');
    const [guessWord, setGuessWord] = useState('');
    const [curWrong, setCurWrong] = useState(0);
    const [gameState, setGameState] = useState(5);
    const [selectedAlphabets, setSelectedAlphabets] = useState([]);

    const [leaderboardData, setLeaderboardData] = useState([]);

    const [timerMin, setTimerMin] = useState(0);
    const [timerSec, setTimerSec] = useState(0);

    const [curKeyPress, setCurKeyPress] = useState(null);

    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');

    let interval = useRef(null);
    let timerTotalSec = useRef(0);

    const maxWrong = 6;
    const imageList = [img0, img1, img2, img3, img4, img5, img6];
    const alphabets = "abcdefghijklmnopqrstuvwxyz";

    const [topicList, setTopicList] = useState([]);

    const columns = [
        { field: 'rank', headerName: 'Rank', flex: 1, headerClassName: 'list-header' },
        { field: 'username', headerName: 'Username', flex: 2, headerClassName: 'list-header' },
        { field: 'score', headerName: 'Score', flex: 1, headerClassName: 'list-header' },
        { field: 'totalWins', headerName: 'Games Won', flex: 1, headerClassName: 'list-header' },
        { field: 'totalLosses', headerName: 'Games Lost', flex: 1, headerClassName: 'list-header' },
    ]

    const hanldeSnackbarClose = () => {
        setIsSnackbarOpen(false)
    }

    // const getGameWord = async () => {
    //     let originalWord = 'sachin';
    //     let guessWord = originalWord.split('').map(() => ('_')).join('');

    //     setOriginalWord(originalWord);
    //     setGuessWord(guessWord);
    // }

    const sendGameStatus = async (data) => {
        let response = await backendCall.post('/user/game', data, {
            headers: {
                'token': token
            }
        });
    }

    useEffect(() => {

        const getLeaderboardGame = async () => {
            let response = await backendCall.get('/gameStatus', {
                headers: {
                    'token': token
                }
            });
            let data = response.data;
            data = data.map((row, ind) => {
                let score = 10 * row.totalWins - 2 * row.totalLosses;
                if (score < 0) {
                    score = 0;
                }
                row.score = score;
                return row;
            });
            data = data.sort((row1, row2) => (row2.score - row1.score));
            data = data.map((row, ind) => {
                row.rank = ind + 1;
                row.id = ind + 1;
                return row;
            });
            setLeaderboardData(data);
        }

        let userToken = localStorage.getItem('token');
        let username = localStorage.getItem('username');

        setToken(userToken);

        window.addEventListener('keypress', (event) => {
            setCurKeyPress(event.key);
        })

        getLeaderboardGame();

        let shareId = window.sessionStorage.getItem('shareId');
        if (shareId != null && shareId != '') {
            console.log('shareId : ',shareId);
            getSharedWord(shareId);
            window.sessionStorage.clear('shareId')
        }

    }, []);


    const getSharedWord = (shareId)=>{
        let sharedWord = 'Shared'
        let originalWord = sharedWord.toLowerCase();
        let guessWord = originalWord.split('').map(() => ('_')).join('');

        setOriginalWord(originalWord);
        setGuessWord(guessWord);
        setGameType('play');
        setGameState(0);
    }

    useEffect(() => {
        let isLetter = /[a-zA-Z]+$/.test(curKeyPress);
        if (isLetter && gameType == 'play' && gameState == 0) {
            let curLetter = curKeyPress.toLowerCase();
            let ind = alphabets.indexOf(curLetter);
            handleLetterClick(curLetter, ind);
        }
    }, [curKeyPress])

    const checkGameState = (curGuessWord = guessWord, newWrong = curWrong) => {
        if (newWrong === maxWrong) {
            clearInterval(interval.current);
            setGameState(2);
        }
        if (!curGuessWord.includes('_')) {
            clearInterval(interval.current);
            setGameState(1);
        }
    }


    const handleLetterClick = (letter, ind) => {
        if (selectedAlphabets[ind]) {
            return;
        }
        if (originalWord.includes(letter)) {
            let curGuessWord = originalWord.split('').map((curLetter, ind) => {
                if (curLetter === letter) {
                    return letter;
                } else {
                    return guessWord.charAt(ind);
                }
            }).join('');
            setGuessWord(curGuessWord);
            checkGameState(curGuessWord, curWrong);
        } else {
            let newWrongCount = curWrong + 1;
            setCurWrong(newWrongCount);
            checkGameState(guessWord, newWrongCount);
        }
        let curSelectedArr = [...selectedAlphabets];
        curSelectedArr[ind] = true;
        setSelectedAlphabets(curSelectedArr);

    }

    useEffect(() => {
        if (gameState == 0) {
            setCurWrong(0);
            let alphabetsSelected = [];
            for (let ind = 0; ind < 26; ++ind) {
                alphabetsSelected.push(false);
            }
            setSelectedAlphabets(alphabetsSelected);
            setTimer();
        } else if (gameState === 3) {
            getWordTopic();
        } else if (gameState === 1) {
            sendGameStatus({
                gameStatus: "won",
                timeTaken: timerTotalSec.current,
                wrongAttempts: curWrong
            });
        } else if (gameState === 2) {
            sendGameStatus({
                gameStatus: "lost",
                timeTaken: timerTotalSec.current,
                wrongAttempts: curWrong
            });
        }

    }, [gameState]);

    const setTimer = () => {
        timerTotalSec.current = 180;
        let remSec = timerTotalSec.current;
        let min = Math.trunc(remSec / 60);
        let sec = remSec % 60;
        if (sec < 10) {
            sec = '0' + sec;
        }
        setTimerMin(min);
        setTimerSec(sec);
        interval.current = setInterval(() => {
            let remSec = timerTotalSec.current;
            if (remSec <= 0) {
                setGameState(2);
                clearInterval(interval.current);
                return;
            }
            --remSec;
            let min = Math.trunc(remSec / 60);
            let sec = remSec % 60;
            if (sec < 10) {
                sec = '0' + sec;
            }
            setTimerMin(min);
            setTimerSec(sec);
            timerTotalSec.current = remSec;
        }, 1000);
    }

    const getWordTopic = async () => {
        let response = await backendCall.get('/word/gettopic', {
            headers: {
                'token': token
            }
        });
        setTopicList(response.data.topicList);
    }

    // useEffect(() => {
    //     if (gameType === 'play') {
            
    //     }
    // }, [gameType]);

    const handleResetGame = () => {
        clearInterval(interval.current);
        setGameType('');
    }

    const handleTopicSelect = async (topic) => {
        let url = `/word/gettopicword?topic=${topic}`;
        let response = await backendCall.get(url, {
            headers: {
                'token': token
            },
            data: {
                topic: topic
            }
        });

        let originalWord = response.data.word.word.toLowerCase();
        let guessWord = originalWord.split('').map(() => ('_')).join('');

        setOriginalWord(originalWord);
        setGuessWord(guessWord);
        setGameState(0);
    }

    const handleRandomWord = async () => {
        let response = await backendCall.get('/word/getaword', {
            headers: {
                'token': token
            }
        });
        let originalWord = response.data.word.toLowerCase();
        let guessWord = originalWord.split('').map(() => ('_')).join('');

        setOriginalWord(originalWord);
        setGuessWord(guessWord);
        setGameState(0);

    }


    return (
        <>
            <Header />
            <Box className="container">
                <Box className="game-container">
                    {
                        gameType === '' &&
                        <Box className="btn-container">
                            <Button variant='contained' className='game-btn' onClick={() => { setGameState(3);setGameType('play') }}>Play the Game</Button>
                            <Typography>or</Typography>
                            <Button variant='contained' className='game-btn' onClick={() => { setGameType('share') }}>Share the Game</Button>
                        </Box>
                    }
                    {
                        gameType === 'play' &&
                        <>
                            {
                                gameState === 0 &&
                                <>
                                    <Typography className='timer'>{timerMin}:{timerSec}</Typography>
                                    <img src={imageList[curWrong]} className="hangman-img" alt={'Image Not Found'} />
                                    <Typography className='wrong-guess-text'>Number of wrong guesses : {curWrong}</Typography>


                                    <Box className="guess-word-container">
                                        {
                                            guessWord.split('').map((letter, ind) => (
                                                <Typography className='guess-word-letter' key={ind}>{letter}</Typography>
                                            ))
                                        }
                                    </Box>
                                    <Box className="alphabet-container">
                                        {
                                            alphabets.split('').map((letter, ind) => (
                                                <Typography key={letter} className={selectedAlphabets[ind] ? 'alphabet-btn--selected' : 'alphabet-btn'} onClick={() => { handleLetterClick(letter, ind) }} >{letter}</Typography>
                                            ))
                                        }
                                    </Box>
                                </>
                            }
                            {
                                gameState === 3 &&
                                <Box className="topic-list-container">
                                    <Typography sx={{
                                        fontSize: "20px",
                                        fontWeight: "bold"
                                    }}>Select a Topic</Typography>
                                    <Stack direction="row" gap={4} flexWrap="wrap">
                                        {
                                            topicList.map((topic) => (
                                                <Button key={topic} onClick={() => { handleTopicSelect(topic) }}>{topic}</Button>
                                            ))
                                        }
                                    </Stack>
                                    <Stack direction="row" gap={4} flexWrap="wrap">
                                        <Button variant='contained' onClick={() => { handleRandomWord() }}>Get a random word</Button>
                                        <Button variant='contained' onClick={() => { handleResetGame() }}>Reset</Button>
                                    </Stack>

                                </Box>

                            }
                            {
                                gameState === 1 &&
                                <Box className="status-container">
                                    <Typography variant='h3' sx={{
                                        color: "green",
                                        margin: "20px 0px"
                                    }}>Congrats! You won!</Typography>
                                    <Button variant='contained' onClick={() => { handleResetGame() }}>Reset</Button>
                                </Box>


                            }
                            {
                                gameState === 2 &&
                                <Box className="status-container">
                                    <Typography variant='h3' sx={{
                                        color: "red",
                                        margin: "15px 0px"
                                    }}> You lost!</Typography>
                                    <Typography variant='h4' sx={{
                                        margin: "10px 0px"
                                    }}>Correct word is : {originalWord}</Typography>
                                    <Button variant='contained' onClick={() => { handleResetGame() }}>Reset</Button>
                                </Box>
                            }



                        </>
                    }
                    {
                        gameType === 'share' &&
                        <Box className="share-container">
                            <TextField label="Give a word"></TextField>
                            {

                            }
                            <Stack gap={2} direction="row">
                                <Button variant='contained' onClick={() => { }}>Generate Link</Button>
                                <Button variant='contained' onClick={() => { handleResetGame() }}>Reset</Button>
                            </Stack>

                        </Box>
                    }
                </Box>
                <Divider orientation='vertical' />
                <Box className="board-container">
                    <Typography className='board-title'>Leaderboard</Typography>
                    {
                        leaderboardData.length > 0 &&
                        <DataGrid
                            className='user-board'
                            rows={leaderboardData}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[10, 25, 50]}
                            checkboxSelection={false}
                            disableRowSelectionOnClick
                            disableColumnMenu={true}
                        />
                    }
                </Box>
            </Box>
            <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={hanldeSnackbarClose}>
                <Alert severity="error" onClose={hanldeSnackbarClose}>{errorMesage}</Alert>
            </Snackbar>
        </>

    );
}
