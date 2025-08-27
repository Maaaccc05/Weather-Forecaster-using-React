import React from 'react'
import WeatherBackground from './components/WeatherBackground'

const App = () => {

  const getWeatherCondition = () => weather && ({
    main: weather.weather[0].main,
    isDay: Date.now()/1000 > weather.sys.sunrise && Date.now()/1000 < weather.sys.sunset
  })

  return (
    <div className='min-h-screen'>
    <WeatherBackground condition={getWeatherCondition()}/>
  </div>
  )
}

export default App