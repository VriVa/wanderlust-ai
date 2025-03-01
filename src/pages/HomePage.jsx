import React, { useState } from 'react';
import { Briefcase,Calendar, MapPin, DollarSign, Clock, Users, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";


function HomePage() {
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    startDate: '',
    endDate: '',
    tripType: 'Leisure',
    budget: 1000,
    foodPreference: 'any',
    travelers: 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    navigate("/itinerary", { state: { formData } });
  };

  // Animation 
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Navigation Bar */}
      <motion.nav 
        className="fixed top-0 w-full bg-white shadow-md z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="   container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MapPin className="text-blue-600" />
            </motion.div>
            <span className="text-2xl font-bold text-blue-600">Wanderlust AI</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">How It Works</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
          </div>
          <motion.button 
            className="bg-blue-600 text-white mr-10 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className=" mt-[60px] py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
            <motion.h1 
  className=" ml-20 text-5xl md:text-5xl font-bold text-gray-800 leading-tight mb-6 px-3"
  whileHover={{ scale: 1.02, color: "#2563EB" }}
  transition={{ duration: 0.3 }}
>
  Plan Your Perfect Trip with <span className="text-blue-600">AI-Powered</span> Itineraries
</motion.h1>
              <p className="text-lg text-gray-600 mb-8 px-3 ml-20">
                Tell us your preferences, and our AI will craft a personalized travel plan with day-by-day itineraries, cost estimates, and weather forecasts.
              </p>
              <div className="ml-20 flex space-x-4 px-3">
                <motion.a 
                  href="#plan-trip" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Plan My Trip
                </motion.a>
                <motion.a 
                  href="#how-it-works" 
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.a>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.img 
                src="/src/assets/images/travel.jpg" 
                alt="Travel planning" 
                className="rounded-xl shadow-xl  w-[74%] h-45 ml-24"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trip Planning Form */}
      <section id="plan-trip" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Create Your Dream Itinerary</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fill in your travel details below and let our AI craft the perfect travel plan for you.
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="max-w-4xl mx-auto bg-blue-100 p-8 rounded-xl shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={scaleIn}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where would you like to go?
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="px-3 py-2">
                    <MapPin className="text-blue-500" size={20} />
                  </div>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="City, Country, or Region"
                    className="w-full px-4 py-3 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Travel Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="px-3 py-2">
                    <Calendar className="text-blue-500" size={20} />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="px-3 py-2">
                    <Calendar className="text-blue-500" size={20} />
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 focus:outline-none"
                    required
                  />
                </div>
              </div>

             {/* Trip Type  */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Type
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="px-3 py-2">
                    <Briefcase className="text-blue-500" size={20} />
                  </div>
                  <select
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 focus:outline-none"
                    required
                  >
                    <option value="Leisure">Leisure</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Business">Business</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (USD)
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="px-3 py-2">
                    <DollarSign className="text-blue-500" size={20} />
                  </div>
                  <input
                    type="number"
                    name="budget"
                    min="100"
                    step="100"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="px-3 py-2">
                    <Users className="text-blue-500" size={20} />
                  </div>
                  <input
                    type="number"
                    name="travelers"
                    min="1"
                    max="20"
                    value={formData.travelers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Food Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Preferences
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="px-3 py-2">
                    <Utensils className="text-blue-500" size={20} />
                  </div>
                  <select
                    name="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 focus:outline-none"
                    required
                  >
                    <option value="any">Any</option>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="jain">Jain</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate My Itinerary
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Features Section */}
      <section className=" pb-24 py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Wanderlust AI</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform takes the stress out of travel planning
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Day-by-Day Itinerary</h3>
              <p className="text-gray-600">
                Get a detailed plan for each day of your trip, including attractions, activities, and restaurant recommendations.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Budget Estimates</h3>
              <p className="text-gray-600">
                Receive accurate cost estimates for accommodation, transportation, activities, and dining options.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Weather Forecast</h3>
              <p className="text-gray-600">
                Plan accordingly with expected weather conditions during your travel dates.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <MapPin />
                <span className="text-xl font-bold">Wanderlust AI</span>
              </div>
              <p className="mt-2 text-gray-400">Your AI travel planning companion</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition">Home</a>
              <a href="#" className="hover:text-blue-400 transition">About</a>
              <a href="#" className="hover:text-blue-400 transition">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition">Terms</a>
              <a href="#" className="hover:text-blue-400 transition">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Wanderlust AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;