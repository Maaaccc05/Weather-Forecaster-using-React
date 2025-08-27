import React, { useState } from 'react'
import WeatherBackground from './components/WeatherBackground'

const App = () => {

  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('')
  const [suggestion, setSuggestion] = useState([])

  const getWeatherCondition = () => weather && ({
    main: weather.weather[0].main,
    isDay: Date.now()/1000 > weather.sys.sunrise && Date.now()/1000 < weather.sys.sunset
  })

  return (
    <div className='min-h-screen'>
    <WeatherBackground condition={getWeatherCondition()}/>

    <div className='flex items-center justify-center p-6 min-h-screen'>
      <div className='bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white w-full border border-white/30 relative z-10'>
      <h1 className='text-4xl font-extrabold text-center mb-6'>
        Weather Forecaster
      </h1>

      {weather ? (
        <form onSubmit={handleSearch} className='flex flex-col relative'>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter Your City or Country Name' className='mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300 transition duration-300'/>
        </form>
      )}
      </div>
    </div>
  </div>
  )
}

export default App