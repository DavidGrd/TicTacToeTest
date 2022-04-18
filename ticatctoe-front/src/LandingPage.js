import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Game from "./Components/Game"
import {Route,Routes, Navigate} from "react-router-dom"

const LandingPage = () => {

    const [name,setName] = useState("")

    return (
        <>
            <h1>Choose your nickname</h1>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <div>
                    <TextField
                    required
                    id="outlined-required"
                    label="Required"
                    value={name}
                    />
                </div>
            </Box>

        </>
    )
};

export default LandingPage;