import React, { useState } from 'react'
import WeatherBackground from './components/WeatherBackground'

const App = () => {

  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('')
  const [suggestion, setSuggestion] = useState([])

  const API_KEY = '501cf176e7f80eac85a43d613b337237'

  // https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid={API_KEY}&units=metric 

  // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key} city name api key

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

          {suggestion.length > 0 && (
            <div className='absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10'>
              {suggestion.map((s) => (
                <button type='button' key={`${s.lat}-${s.lon}`}
                onClick={() => featchWeatherData(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid={API_KEY}&units=metric `,
                  `${s.name}, ${s.country}${s.state ? `, ${s.state}`: ''}`
                )} className='block hover:bg-blue-700 bg-transparent px-4 py-2 text-sm text-left w-full transition-colors'>
                  {s.name},{s.country}{s.state && `, ${s.state}`}
                </button>
              ))}
            </div>
          )}
          <button className='bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors'>
            Get Weather
          </button>
        </form>
      ) : (
        <div className='mt-6 text-center transition-opacity duration-500'>
          <button onClick={() => {setWeather(null); setCity('')}}></button>
        </div>
      )}
      </div>
    </div>
  </div>
  )
}

export default App