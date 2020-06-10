import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import './App.css';


const CssTextField = withStyles({
  root: {
    width: '300px',
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
})(TextField);


const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
}));

const App = () => {
  const [{mu, lambda, }, setState] = useState({mu: 0, lambda: 0})
  const [timeUnit, setTimeUnit] = useState('minuto/s')
  const classes = useStyles()
  let Ls = 0, Ws = 0, Lq = 0, Wq = 0, P = 0, P0 = 0

  console.log({mu, lambda})
  if (mu > 0 && lambda > 0 && mu > lambda) {
    Ls = lambda / (mu / lambda)
    Ws = 1 / (mu - lambda)
    Lq = (lambda * lambda) / (mu * (mu - lambda))
    Wq = lambda / (mu * (mu - lambda))
    P = lambda / mu * 100
    P0 = 100 - P
  }

  return (
    <div className="App">
      <div className="header">Implementacion de M/M/1 por Angeleri Ciro</div>
      <div className="inputs-container">
        <CssTextField 
          type="number" 
          inputProps={{ min: "0"}}
          onChange={({ target }) => setState({mu, lambda: parseInt(target.value)})} 
          id="lambda" 
          label="Λ" 
          placeholder="Inserte Lambda" 
          variant="outlined" 
        />
        <CssTextField
          type="number" 
          inputProps={{ min: "0"}}
          onChange={({ target }) => setState({lambda, mu: parseInt(target.value)})} 
          id="mu" 
          label="μ" 
          placeholder="Inserte Mu" 
          variant="outlined"
        />
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            defaultValue={'minutos/s'}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <MenuItem value={'hora/s'}>Horas</MenuItem>
            <MenuItem value={'minutos/s'}>Minutos</MenuItem>
            <MenuItem value={'segundo/s'}>Segundos</MenuItem>
          </Select>
        </FormControl>

      </div>
      <div className="results-container">
          <CssTextField value={`${Math.round(Ls)} cliente/s`} label="Promedio de unidades en el sistema (Ls)" variant="filled" disabled/>
          <CssTextField value={`${Ws.toFixed(2)} ${timeUnit}`} label="Tiempo de unidad en el sistema (Ws)" variant="filled" disabled/>
          <CssTextField  value={`${Math.round(Lq)} cliente/s`} label="Promedio de unidades en la fila (Lq)" variant="filled" disabled/>
      </div>
      <div className="results-container">
          <CssTextField value={`${Wq.toFixed(2)} ${timeUnit}`} label="Tiempo de espera en la fila (Wq)" variant="filled" disabled/>
          <CssTextField value={`${Math.round(P)}%`} label="Factor de uso del sistema (P)" variant="filled" disabled/>
          <CssTextField value={`${Math.round(P0)}%`} label="Ninguna unidad en el sistema (P0)" variant="filled" disabled/>
      </div>
    </div>
  );
}

export default App;
