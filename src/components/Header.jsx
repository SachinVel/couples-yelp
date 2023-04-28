import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import TagIcon from '@mui/icons-material/Tag';
import '../styles/Layout.css';

export default function Header() {

  return (
      <Box className="header-container">
        <Typography sx={{
            fontSize : "25px",
            fontWeight : "bold"
        }}>Hangman</Typography>
      </Box>
  );
}
