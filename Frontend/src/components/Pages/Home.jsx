import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
      

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-b from-gray-200 to-white">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome To <span className="text-indigo-600">COLLEGIUM</span></h1>
        <p className="text-gray-600 mb-6">We’ve solutions at method on you and to allow for anything, are way to build on all potentials.</p>
        <div className="space-x-4">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">Home</button>
          <button className="px-6 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-200">About</button>
        </div>
      </section>

      {/* Collegiums Section */}
      <section className="bg-gray-900 text-white py-16">
        <h2 className="text-center text-3xl font-bold mb-12">COLLEGIUMS</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Card 1 */}
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <img 
                src="https://via.placeholder.com/50" 
                alt="Person" 
                className="w-12 h-12 rounded-full mr-4"
              />
              <h3 className="text-lg font-bold">Yale Tectious</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Yale provides expert-level solutions that save time and increase outcomes.</p>
            <a href="#" className="text-indigo-600 font-bold">Learn More</a>
          </div>

          {/* Card 2 */}
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <img 
                src="https://via.placeholder.com/50" 
                alt="Person" 
                className="w-12 h-12 rounded-full mr-4"
              />
              <h3 className="text-lg font-bold">First Resource</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">First in place, resourceful solutions offer efficiency and impact.</p>
            <a href="#" className="text-indigo-600 font-bold">Learn More</a>
          </div>

          {/* Card 3 */}
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <img 
                src="https://via.placeholder.com/50" 
                alt="Person" 
                className="w-12 h-12 rounded-full mr-4"
              />
              <h3 className="text-lg font-bold">Valet Fectility</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Valet’s services promise quality results in record time.</p>
            <a href="#" className="text-indigo-600 font-bold">Learn More</a>
          </div>
        </div>
      </section>
    </div>
  );
};


export default Home;