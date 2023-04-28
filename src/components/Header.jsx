import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import TagIcon from '@mui/icons-material/Tag';
import '../styles/Layout.css';

export default function Header() {

  const [isLogin, setIsLogin] = useState(false);

  const logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
    window.location = '/login';
  }

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      setIsLogin(true);
    }
  }, []);

  return (
    <Box className="header-container">
      <Typography sx={{
        fontSize: "25px",
        fontWeight: "bold"
      }}>Hangman</Typography>
      {
        isLogin &&
        <Stack gap={2} direction="row" sx={{
          position : "absolute",
          right : "20px"
        }}>
          <Button variant="contained" onClick={() => { logout() }}>
            Logout
          </Button>
        </Stack>

      }

    </Box>
  );
}
