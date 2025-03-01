import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  DollarSign,
  CloudRain,
  Clock,
  ArrowLeft,
  Download,
  Share2,
  Edit,
  Coffee,
  Utensils,
  Bed,
  Camera,
} from 'lucide-react'
import axios from 'axios' //fetch api

function ItineraryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { formData } = location.state || {}

  //go back
  const onBack = () => navigate('/')
  const Directions = ({ origin, destination }) => (
    <div className="directions-fallback">
      <p>
        Directions from {origin} to {destination}
      </p>
      <p className="text-sm text-gray-500">
        Directions service unavailable in mock mode
      </p>
    </div>
  )

  // State for the itinerary data
  const [itineraryData, setItineraryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeDay, setActiveDay] = useState(1)
  const [mapApiLoaded, setMapApiLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  // Animation
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  //Google Maps API
  useEffect(() => {
    // Function to load Google Maps
    const loadGoogleMaps = () => {
      // Global callback function
      window.initGoogleMaps = () => {
        setMapApiLoaded(true)
        // Clean up the global callback when done
        delete window.initGoogleMaps
      }

      if (document.getElementById('google-maps-script')) {
        return
      }

      // Create script with callback
      const script = document.createElement('script')
      script.id = 'google-maps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places&callback=initGoogleMaps`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      // Append to head instead of body
    }

    if (window.google && window.google.maps) {
      setMapApiLoaded(true)
    } else {
      loadGoogleMaps()
    }
  }, [])

  //gemini ai api
  useEffect(() => {
    const generateItinerary = async () => {
      if (!formData) {
        setError('No form data provided')
        setLoading(false)
        return
      }

      setLoading(true)


      try {
        // prompt for gemini
        const prompt = `
          Create a detailed travel itinerary for a trip to ${
            formData.destination
          }.
          Trip type: ${formData.tripType || 'Leisure'}
          Start date: ${formData.startDate}
          End date: ${formData.endDate}
          Number of travelers: ${formData.travelers || 1}
          Budget: ${formData.budget || 'moderate'}
          Food preferences: ${formData.foodPreference || 'any'}
          You are a travel planning assistant. Create detailed itineraries with realistic locations, timings, and activities. Include geographic coordinates for each activity.

          Format the response as a valid JSON object with the following structure:
          {
            "destination": "City, Country",
            "tripType": "Type of trip",
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD",
            "totalDays": number,
            "costEstimate": {
              "low": number,
              "high": number,
              "currency": "USD"
            },
            "weather": [
              { "day": 1, "temp": number, "condition": "Weather condition", "icon": "emoji" }
            ],
            "days": [
              {
                "day": number,
                "title": "Day title",
                "activities": [
                  {
                    "time": "HH:MM AM/PM",
                    "title": "Activity title",
                    "description": "Activity description",
                    "location": { "lat": number, "lng": number },
                    "type": "attraction/restaurant/hotel/coffee",
                    "cost": number
                  }
                ]
              }
            ]
          }
        `

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY


        // Set up abort controller for timeouts
        const controller = new AbortController()

        const response = await axios({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          method: 'POST',

      
          headers: {
            'Content-Type': 'application/json',
            
          },
          data: {
           contents: [
            {
              role: "user",
            parts: [ {text: prompt}]
          }
        ],
        generationConfig:{
            
            temperature: 0.7,
            maxOutputTokens: 10000
        }
          },
          signal: controller.signal,
        })
        console.log(response.data)

        if (response.status !== 200) {
          console.warn(
            `API request failed with status ${response.status}.`
          )
          return
        }

        const data = response.data
        let itinerary

        try {
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text

          if (!content) {
            throw new Error('Empty response from Gemini API')
          }

          // Attempt to extract JSON from response
          const jsonMatch =
            content.match(/```json\n([\s\S]*?)\n```/) ||
            content.match(/{[\s\S]*}/)

          if (!jsonMatch) {
            throw new Error('No valid JSON found in API response')
          }

          const jsonString = jsonMatch[1] || jsonMatch[0]
          const cleanedJsonString = jsonString
            .replace(/```json|```/g, '')
            .trim()

          console.log('Extracted JSON String:', cleanedJsonString)

          itinerary = JSON.parse(cleanedJsonString)
          console.log(itinerary)
        } catch (err) {
          console.error('Failed to parse Gemini response:', err)
          return
        }

        // Validate the itinerary data
        if (!itinerary || !itinerary.days || !Array.isArray(itinerary.days)) {
          console.warn(
            'Invalid itinerary data format.'
          ) 
          return
        }

        setItineraryData(itinerary)
      } catch (err) {
       
        console.error('Error generating itinerary:', err)
       
      } finally {
        setLoading(false)
      }
    }
    // Only run the effect if formData is available and has actually changed
    if (formData && Object.keys(formData).length > 0) {
      generateItinerary()
    }

    // The Directions component definition should be outside of useEffect, not inside
  }, [formData, setItineraryData, setLoading, setError]) // Add all state setters to the dependency array

  // Initialize Google Map once API is loaded and itinerary data is available
  useEffect(() => {
    if (mapApiLoaded && itineraryData && !map && window.google) {
      const currentDayActivities =
        itineraryData.days.find((day) => day.day === activeDay)?.activities ||
        []

      // Find the first activity with a location to center the map
      const centerActivity = currentDayActivities.find(
        (activity) => activity.location
      )

      if (centerActivity) {
        const mapElement = document.getElementById('map')
        if (mapElement) {
          const googleMap = new window.google.maps.Map(mapElement, {
            center: centerActivity.location,
            zoom: 13,
            mapTypeId: 'roadmap',
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          })

          setMap(googleMap)
        }
      }
    }
  }, [mapApiLoaded, itineraryData, map, activeDay])

  // Update markers when active day changes or map initializes
  useEffect(() => {
    if (map && itineraryData && window.google) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null))

      const newMarkers = []
      const currentDayActivities =
        itineraryData.days.find((day) => day.day === activeDay)?.activities ||
        []

      // Create bounds to fit all markers
      const bounds = new window.google.maps.LatLngBounds()

      // Add markers for each activity
      currentDayActivities.forEach((activity, index) => {
        if (activity.location) {
          const marker = new window.google.maps.Marker({
            position: activity.location,
            map: map,
            title: activity.title,
            label: (index + 1).toString(),
          })

          // Create info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div>
              <h3 style="font-weight: bold; margin-bottom: 5px;">${activity.title}</h3>
              <p>${activity.description}</p>
              <p><strong>Time:</strong> ${activity.time}</p>
            </div>`,
          })

          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })

          newMarkers.push(marker)
          bounds.extend(activity.location)
        }
      })

      // Fit map to bounds if we have markers
      if (newMarkers.length > 0) {
        map.fitBounds(bounds)
        // Adjust zoom level if too zoomed in
        const listener = window.google.maps.event.addListener(
          map,
          'idle',
          () => {
            if (map.getZoom() > 16) map.setZoom(16)
            window.google.maps.event.removeListener(listener)
          }
        )
      }

      setMarkers(newMarkers)
    }
    return () => {
      markers.forEach((marker) => marker.setMap(null))
    }
  }, [map, activeDay, itineraryData])

  // icons for acitivities
  const getActivityIcon = (type) => {
    switch (type) {
      case 'restaurant':
        return <Utensils className="text-orange-500" />
      case 'attraction':
        return <Camera className="text-blue-500" />
      case 'hotel':
        return <Bed className="text-indigo-500" />
      case 'coffee':
        return <Coffee className="text-blue-700" />
      default:
        return <MapPin className="text-gray-500" />
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  // Calculate day date from start date
  const getDayDate = (dayNumber) => {
    if (!itineraryData || !itineraryData.startDate) return ''
    const startDate = new Date(itineraryData.startDate)
    const dayDate = new Date(startDate)
    dayDate.setDate(startDate.getDate() + (dayNumber - 1))
    return formatDate(dayDate)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Creating your perfect itinerary...
          </h2>
          <p className="text-gray-600">
            Our AI is planning your trip to{' '}
            {formData?.destination || 'your destination'}.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!itineraryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No itinerary data available
          </h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-4"
          >
            Back to Planning
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.button
            onClick={onBack}
            className="flex items-center text-gray-700 hover:text-blue-600 transition"
            whileHover={{ x: -3 }}
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to Planning</span>
          </motion.button>

          <div className="text-center flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Your {itineraryData.tripType} Trip to {itineraryData.destination}
            </h1>
            <p className="text-sm text-gray-600">
              {formatDate(itineraryData.startDate)} -{' '}
              {formatDate(itineraryData.endDate)}
            </p>
          </div>

          <div className="flex space-x-2">
            <motion.button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Download Itinerary"
            >
              <Download size={18} />
            </motion.button>
            <motion.button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Share Itinerary"
            >
              <Share2 size={18} />
            </motion.button>
            <motion.button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit Itinerary"
            >
              <Edit size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Summary and Day Navigation */}
          <div className="lg:col-span-1">
            {/* Trip Summary */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trip Summary
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="text-blue-500 mr-3" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">
                      {itineraryData.totalDays} Days
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign className="text-green-500 mr-3" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">
                      Estimated Budget
                    </div>
                    <div className="font-medium">
                      {itineraryData.costEstimate.low} -{' '}
                      {itineraryData.costEstimate.high}{' '}
                      {itineraryData.costEstimate.currency}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <CloudRain className="text-blue-500 mr-3" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">
                      Weather Forecast
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                      {itineraryData.weather.map((day) => (
                        <div key={day.day} className="text-center">
                          <div className="text-xl">{day.icon}</div>
                          <div className="text-sm font-medium">
                            {day.temp}°C
                          </div>
                          <div className="text-xs">Day {day.day}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Day Navigation */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Itinerary
              </h2>

              <div className="space-y-3">
                {itineraryData.days.map((day) => (
                  <motion.button
                    key={day.day}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      activeDay === day.day
                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveDay(day.day)}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          Day {day.day}: {day.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getDayDate(day.day)}
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {day.activities.length} Activities
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Map and Day Details */}
          <div className="lg:col-span-2">
            {/* Map */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div id="map" className="w-full h-96"></div>
            </motion.div>

            {/* Day Details */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {itineraryData.days
                .filter((day) => day.day === activeDay)
                .map((day) => (
                  <div key={day.day}>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          Day {day.day}: {day.title}
                        </h2>
                        <p className="text-gray-600">{getDayDate(day.day)}</p>
                      </div>
                      <motion.button
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Directions size={18} className="mr-1" />
                        <span>Get Directions</span>
                      </motion.button>
                    </div>

                    <div className="space-y-8">
                      {day.activities.map((activity, index) => (
                        <motion.div
                          key={index}
                          className="flex"
                          variants={itemVariants}
                        >
                          {/* Timeline */}
                          <div className="mr-4 relative">
                            <div className="flex flex-col items-center">
                              <div className="text-sm text-gray-500 mb-1">
                                {activity.time}
                              </div>
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                {getActivityIcon(activity.type)}
                              </div>
                              {index < day.activities.length - 1 && (
                                <div className="h-full border-l-2 border-dashed border-gray-300 my-2 ml-0.5"></div>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-medium text-gray-800">
                                {activity.title}
                              </h3>
                              {activity.cost > 0 && (
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">
                                    {activity.cost}{' '}
                                    {itineraryData.costEstimate.currency}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">
                              {activity.description}
                            </p>

                            <div className="mt-3 flex justify-between items-center">
                              <div
                                className="flex items-center text-sm text-blue-600 cursor-pointer"
                                onClick={() => {
                                  if (map && activity.location) {
                                    map.setCenter(activity.location)
                                    map.setZoom(15)
                                    // Find the marker for this activity
                                    const marker = markers[index]
                                    if (marker) {
                                      // Trigger a click on the marker to open the info window
                                      window.google.maps.event.trigger(
                                        marker,
                                        'click'
                                      )
                                    }
                                  }
                                }}
                              >
                                <MapPin size={14} className="mr-1" />
                                <span>Show on map</span>
                              </div>

                              <div className="flex space-x-2">
                                <button className="text-gray-500 hover:text-blue-600 transition">
                                  <Edit size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItineraryPage
