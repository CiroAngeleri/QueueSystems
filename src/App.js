import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import './App.css';
import { Link } from 'react-router-dom';
import { SocialMediaIconsReact } from 'social-media-icons-react';


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

const getTimes = (timeUnit, value) => {

  switch (timeUnit) {
    case 'segundo/s':
      return {
        s: value,
        m: value / 60,
        h: value / 3600
      } 
    case 'minuto/s':
      return {
        s: value * 60,
        m: value,
        h: value / 60
      }
    case 'hora/s':
      return {
        s: value * 3600,
        m: value * 60,
        h: value
      }
  
    default:
      break;
  }
}

const App = (props) => {
  const [{mu, lambda, sigma}, setState] = useState({mu: 0, lambda: 0, sigma: 0})
  const [timeUnit, setTimeUnit] = useState('minuto/s')
  const classes = useStyles()
  let Ls = 0, Ws = 0, Lq = 0, Wq = 0, P = 0, P0 = 0, Paux = 0
  const saturated = lambda > mu

  if (mu > 0 && lambda > 0 && mu > lambda) {
    switch (props.type) {
      case 'M/M/1':
        Ls = lambda / (mu / lambda)
        Ws = 1 / (mu - lambda)
        Lq = (lambda * lambda) / (mu * (mu - lambda))
        Wq = lambda / (mu * (mu - lambda))
        P = lambda / mu * 100
        P0 = 100 - P
        break;
      case 'M/G/1':
        if (sigma > 0) {
          P = lambda / mu * 100
          P0 = 100 - P
          Paux = lambda / mu
          Lq = ( Math.pow(lambda,2) * Math.pow(sigma,2) + Math.pow(Paux,2) ) / ( 2*(1 - Paux) )
          Ls = Lq + Paux
          Wq = Lq / lambda
          Ws = Wq + 1/mu
        }
        break;
      case 'M/D/1':
        P = lambda / mu * 100
        P0 = 100 - P
        Paux = lambda / mu
        Lq = (Math.pow(Paux,2)) / (2*(1 - Paux))
        Wq = Lq / lambda
        Ws = Wq + 1/mu
        Ls = lambda * Ws
        break;
    
      default:
        break;
    }

  }

  const WsTimes = getTimes(timeUnit, Ws)
  const WqTimes = getTimes(timeUnit, Wq)

  console.log({WsTimes, WqTimes})

  return (
    <div className="App">
      <div className="links">
        <Link to="/"> Ir a M/M/1 </Link>
        <Link to="/mg1"> Ir a M/G/1 </Link>
        <Link to="/md1"> Ir a M/D/1 </Link>
        <SocialMediaIconsReact size={45} icon="github" url="https://github.com/CiroAngeleri/QueueSystems" />
      </div>
      <div className="header">Implementacion de {props.type} por Angeleri Ciro</div>
      <div className="inputs-container">
        <CssTextField 
          type="number" 
          inputProps={{ min: "0"}}
          onChange={({ target }) => setState({mu, lambda: parseFloat(target.value)})} 
          id="lambda" 
          label="Λ (Velocidad de llegada)" 
          placeholder="Inserte Lambda" 
          variant="outlined" 
        />
        <CssTextField
          type="number" 
          inputProps={{ min: "0"}}
          onChange={({ target }) => setState({lambda, mu: parseFloat(target.value)})} 
          id="mu" 
          label="μ (Velocidad de servicio)" 
          placeholder="Inserte Mu" 
          variant="outlined"
        />
        {props.type === "M/G/1" && 
        <CssTextField
          type="number" 
          inputProps={{ min: "0"}}
          onChange={({ target }) => setState({lambda, mu, sigma: parseFloat(target.value)})} 
          id="mu" 
          label="σ (Desvio estándar)" 
          placeholder="Inserte Sigma" 
          variant="outlined"
        />}
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            defaultValue={'minuto/s'}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <MenuItem value={'hora/s'}>Horas</MenuItem>
            <MenuItem value={'minuto/s'}>Minutos</MenuItem>
            <MenuItem value={'segundo/s'}>Segundos</MenuItem>
          </Select>
        </FormControl>

      </div>
      <div className="saturated-container">{saturated && 'El sistema se encuentra saturado!'}</div>
      <div className="results-container">
        <CssTextField value={`${Math.round(Ls)} cliente/s`} label="Promedio de unidades en el sistema (Ls)" variant="filled" disabled/>
        <CssTextField value={`${WsTimes.s.toFixed(2)} sec ${WsTimes.m.toFixed(2)} min ${WsTimes.h.toFixed(2)} hs`} label="Tiempo de unidad en el sistema (Ws)" variant="filled" disabled/>
        <CssTextField  value={`${Math.round(Lq)} cliente/s`} label="Promedio de unidades en la fila (Lq)" variant="filled" disabled/>
      </div>
      <div className="results-container">
        <CssTextField value={`${WqTimes.s.toFixed(2)} sec ${WqTimes.m.toFixed(2)} min ${WqTimes.h.toFixed(2)} hs`} label="Tiempo de espera en la fila (Wq)" variant="filled" disabled/>
        <CssTextField value={`${Math.round(P)}%`} label="Factor de uso del sistema (P)" variant="filled" disabled/>
        <CssTextField value={`${Math.round(P0)}%`} label="Ninguna unidad en el sistema (P0)" variant="filled" disabled/>
      </div>
    </div>
  );
}

export default App;
