import React, { useState, useEffect, useCallback, useRef } from 'react'
import { calculateWinner} from "../helper";
import Board from "./Board";
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';

const URL = 'wss://3t0hp0ybrb.execute-api.us-east-1.amazonaws.com/production';

const Game = (names) => {
    const socket = useRef(null);
    const [status, setStatus] = useState([Array(9).fill(null)]);
    const [stepNumber,setStepNumber] = useState(0);
    const [xIsNext, setXisNext] = useState(true);
    const winner = calculateWinner(status[stepNumber]);
    const [players,setPlayers] = useState([])
    const xO = xIsNext ? "X" : "O";
    const [isConnectedGame,setIsConnectedGame] = useState(false)

    const onSocketOpen = useCallback(() => {
        setIsConnectedGame(true);
        socket.current.send(JSON.stringify({ action: 'connectGame' }));
      }, []);

    const onSocketClose = useCallback(() => {
        setPlayers([]); 
        setIsConnectedGame(false);
        setStatus([Array(9).fill(null)]);
        setStepNumber(0)
      }, []);

    const onDisconnect = useCallback(() => {
        if (isConnectedGame) {
          socket.current.close();
        }
      }, [isConnectedGame]);
    
    const onConnect = useCallback(() => {
        socket.current = new WebSocket(URL);
        socket.current.addEventListener('open', onSocketOpen);
        socket.current.addEventListener('close', onSocketClose);
        socket.current.addEventListener('message', (event) => {
          onSocketStatus(event.data);
        });
    }, []);

    const onSocketStatus = useCallback((dataStr) => {
        const data = JSON.parse(dataStr);
        if(data.status){
            console.log("test")
            setStatus(data.status);
        }else if(data.players){
            setPlayers(data.players)
        }else if(data.stepNumber){
            setStepNumber(data.stepNumber)
        }
    }, []);

    const handleClick = (i) => {
        if(isConnectedGame){
            const historyPoint = status.slice(0, stepNumber + 1);
            const current = historyPoint[stepNumber];
            const squares = [...current];
            
            if (winner || squares[i]) return;

            squares[i] = xO;
            setStatus([...historyPoint, squares]);
            setStepNumber(historyPoint.length);
            setXisNext(!xIsNext);
            socket.current.send(JSON.stringify({ action: 'played', status,stepNumber }));
        }
    };

    useEffect(() => {
        
      }, [status[stepNumber]])


    const restart = () =>
        setStepNumber(0)
    

    return (
        <>  <div style={{display:'flex', flexDirection:'column', marginLeft:'10vh'}}>
                <h1>TicTacToe</h1>
                <div style={{display:'flex', flexDirection:'column', marginLeft:'5vh', backgroundColor: '#f4ede3'}}>
                    <Board squares={status[stepNumber]} onClick={handleClick}/>
                    <div className="info-wrapper">
                        <div>
                            <button onClick={() => restart()}>Restart</button>
                        </div>
                        <div>
                            <Grid item style={{ margin: 10 }}>
                                {isConnectedGame && <Button variant="outlined" size="small" disableElevation onClick={onDisconnect}>Disconnect</Button>}
                                {!isConnectedGame && <Button variant="outlined" size="small" disableElevation onClick={onConnect}>Connect</Button>}
                            </Grid>
                        </div>
                        <h3>{winner ? "Winner: " + winner : "Next Player: " + xO}</h3>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Game;