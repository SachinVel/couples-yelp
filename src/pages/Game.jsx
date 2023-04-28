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
import { padding } from '@xstyled/styled-components';
import { DataGrid } from '@mui/x-data-grid';



export default function Login() {

    const [errorMesage, setErrorMessage] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [gameType, setGameType] = useState('');
    const [originalWord, setOriginalWord] = useState('');
    const [guessWord, setGuessWord] = useState('');
    const [curWrong, setCurWrong] = useState(0);
    const [gameState, setGameState] = useState(0);
    const [selectedAlphabets, setSelectedAlphabets] = useState([]);

    const [timerMin, setTimerMin] = useState(0);
    const [timerSec, setTimerSec] = useState(0);

    const [curKeyPress, setCurKeyPress] = useState(null);

    let interval = useRef(null);
    let timerTotalSec = useRef(0);

    const maxWrong = 6;
    const imageList = [img0, img1, img2, img3, img4, img5, img6];
    const alphabets = "abcdefghijklmnopqrstuvwxyz";

    const sampleData = [
        { username: 'John', score: 70, gamesWon: 2, gamesLost: 1, rank: 1, id: 1 },
        { username: 'Alex', score: 50, gamesWon: 2, gamesLost: 1, rank: 2, id: 2 }
    ];

    const columns = [
        { field: 'rank', headerName: 'Rank', flex: 1, headerClassName: 'list-header' },
        { field: 'username', headerName: 'Username', flex: 2, headerClassName: 'list-header' },
        { field: 'score', headerName: 'Score', flex: 1, headerClassName: 'list-header' },
        { field: 'gamesWon', headerName: 'Games Won', flex: 1, headerClassName: 'list-header' },
        { field: 'gamesLost', headerName: 'Games Lost', flex: 1, headerClassName: 'list-header' },
    ]

    const hanldeSnackbarClose = () => {
        setIsSnackbarOpen(false)
    }

    const getGameWord = async () => {
        let originalWord = 'sachin';
        let guessWord = originalWord.split('').map(() => ('_')).join('');

        setOriginalWord(originalWord);
        setGuessWord(guessWord);
    }

    useEffect(() => {


        window.addEventListener('keypress', (event) => {
            setCurKeyPress(event.key);
        })

    }, []);

    useEffect(() => {
        let isLetter = /[a-zA-Z]+$/.test(curKeyPress);
        if (isLetter && gameType == 'play' && gameState == 0) {
            let curLetter = curKeyPress.toLowerCase();
            let ind = alphabets.indexOf(curLetter);
            console.log('ind : ', ind);
            handleLetterClick(curLetter, ind);
        }
    }, [curKeyPress])

    const checkGameState = (curGuessWord = guessWord, newWrong = curWrong) => {
        if (newWrong === maxWrong) {
            setGameState(2);
            clearInterval(interval.current);
        }
        if (!curGuessWord.includes('_')) {
            setGameState(1);
            clearInterval(interval.current);
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
        console.log('gameState change : ', gameState);
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

    useEffect(() => {
        if (gameType === 'play') {
            setGameState(0);
            setCurWrong(0);
            let alphabetsSelected = [];
            for (let ind = 0; ind < 26; ++ind) {
                alphabetsSelected.push(false);
            }
            setSelectedAlphabets(alphabetsSelected);
            getGameWord();
            setTimer();
        }
    }, [gameType]);

    const handleResetGame = () => {
        clearInterval(interval.current);
        setGameType('');
    }


    return (
        <>
            <Header />
            <Box className="container">
                <Box className="game-container">
                    {
                        gameType === '' &&
                        <Box className="btn-container">
                            <Button variant='contained' className='game-btn' onClick={() => { setGameType('play') }}>Play the Game</Button>
                            <Typography>or</Typography>
                            <Button variant='contained' className='game-btn' onClick={() => { setGameType('share') }}>Share the Game</Button>
                        </Box>
                    }
                    {
                        gameType === 'play' &&
                        <>
                            <Typography className='timer'>{timerMin}:{timerSec}</Typography>
                            <img src={imageList[curWrong]} className="hangman-img" alt={'Image Not Found'} />
                            <Typography className='wrong-guess-text'>Number of wrong guesses : {curWrong}</Typography>
                            {
                                gameState === 0 &&
                                <>
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
                                gameState === 1 &&
                                <Typography variant='h3' sx={{
                                    color: "green",
                                    margin: "20px 0px"
                                }}>Congrats! You won!</Typography>
                            }
                            {
                                gameState === 2 &&
                                <>
                                    <Typography variant='h3' sx={{
                                        color: "red",
                                        margin: "15px 0px"
                                    }}> You lost!</Typography>
                                    <Typography variant='h4' sx={{
                                        margin: "10px 0px"
                                    }}>Correct word is : {originalWord}</Typography>
                                </>
                            }

                            <Button variant='contained' onClick={() => { handleResetGame() }}>Reset</Button>

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
                    <DataGrid
                        className='user-board'
                        rows={sampleData}
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
                </Box>
            </Box>
            <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={hanldeSnackbarClose}>
                <Alert severity="error" onClose={hanldeSnackbarClose}>{errorMesage}</Alert>
            </Snackbar>
        </>

    );
}
