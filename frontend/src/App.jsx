import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="p-8 bg-white shadow-lg rounded-lg">

        <h1 className="text-2xl font-bold text-blue-600 mb-4">

          Job Application Tracker

        </h1>

        <p className="text-gray-700">

          Backend Status: <span className="font-semibold">{message || 'Loading...'}</span>

        </p>

      </div>

    </div>

  )
}

export default App
