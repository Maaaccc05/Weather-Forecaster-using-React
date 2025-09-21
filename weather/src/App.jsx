import React, { useEffect, useState } from 'react'
import WeatherBackground from './components/WeatherBackground'
import { convertTemperature } from './components/Helper'

const App = () => {
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('')
  const [suggestion, setSuggestion] = useState([])
  const [unit, setUnit] = useState('C')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const API_KEY = '501cf176e7f80eac85a43d613b337237'

  // ask for user location on first visit
  useEffect(() => {
    if (!weather) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords
            featchWeatherData(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            )
          },
          (err) => {
            console.error(err)
            setError("Couldn't get your location, search manually.")
            setLoading(false)
          }
        )
      } else {
        setError("Geolocation not supported in your browser.")
        setLoading(false)
      }
    }
  }, [])

  // suggestion fetch
  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestions(city), 500)
      return () => clearTimeout(timer)
    }
    setSuggestion([])
  }, [city, weather])

  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      )
      res.ok ? setSuggestion(await res.json()) : setSuggestion([])
    } catch {
      setSuggestion([])
    }
  }

  const featchWeatherData = async (url, name = '') => {
    setError('')
    setLoading(true)
    try {
      const response = await fetch(url)
      if (!response.ok)
        throw new Error((await response.json()).message || 'City not found')
      const data = await response.json()
      setWeather(data)
      setCity(name || data.name)
      setSuggestion([])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim()) return setError('Please Enter Correct City name')
    await featchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    )
  }

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    }

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />

      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white w-full border border-white/30 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-6">
            Weather Forecaster
          </h1>

          {loading ? (
            <p className="text-center">Fetching weather data...</p>
          ) : !weather ? (
            <form onSubmit={handleSearch} className="flex flex-col relative">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter Your City or Country Name"
                className="mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300 transition duration-300"
              />

              {suggestion.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10">
                  {suggestion.map((s) => (
                    <button
                      type="button"
                      key={`${s.lat}-${s.lon}`}
                      onClick={() =>
                        featchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${
                            s.state ? `, ${s.state}` : ''
                          }`
                        )
                      }
                      className="block hover:bg-blue-700 bg-transparent px-4 py-2 text-sm text-left w-full transition-colors"
                    >
                      {s.name},{s.country}
                      {s.state && `, ${s.state}`}
                    </button>
                  ))}
                </div>
              )}
              <button className="bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                Get Weather
              </button>
            </form>
          ) : (
            <div className="mt-6 text-center transition-opacity duration-500">
              <button
                onClick={() => {
                  setWeather(null)
                  setCity('')
                }}
                className="mb-4 bg-purple-900 hover:bg-blue-700 text-white font-semibold rounded transition-colors px-3 py-1"
              >
                New Search
              </button>
              <div className="flex justify-between items-center ">
                <h2 className="text-3xl font-bold">{weather.name}</h2>
                <button
                  onClick={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  &deg;{unit}
                </button>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto my-4 animate-bounce"
              />
              <p className="text-4xl">
                {convertTemperature(weather.main.temp, unit)} &deg;{unit}
              </p>
              <p className="capitalize">{weather.weather[0].description}</p>
            </div>
          )}
          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default App
