import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import data from './data.json';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  // State for form inputs
  const [formData, setFormData] = useState({
    brand: 'Toyota',
    Vehicle_color: 'Blanc',
    Mileage: 50000,
    Vehicle_condition: 'Avec kilométrage',
    engine_size: '1.6L',
    year: 2018,
    gearbox: 'Manuelle',
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState(null);

  // Filter valid data (years between 1980 and 2023)
  const validData = data.filter(item => item.year >= 1980 && item.year <= 2023);

  // Extract unique values for form dropdowns
  const brands = [...new Set(validData.map(item => item.brand))].sort();
  const colors = [...new Set(validData.map(item => item.Vehicle_color))].sort();
  const conditions = [...new Set(validData.map(item => item.Vehicle_condition))].sort();
  const gearboxes = [...new Set(validData.map(item => item.gearbox))].sort();
  const engineSizes = ['<1.0L', '1.0L', '1.6L', '2.0L', '3.0L', '4.0L', '>4.0L'];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPredictedPrice(null);
    try {
      const response = await axios.post('https://car-price-prediction-api-nvkx.onrender.com/predict', {
        ...formData,
        Mileage: parseFloat(formData.Mileage),
        year: parseInt(formData.year),
      });
      setPredictedPrice(response.data.predicted_price);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching prediction');
    }
  };

  // Graph 1: Price Distribution Histogram
  const priceData = validData.map(item => item.Price);
  const bins = 15;
  const minPrice = Math.min(...priceData);
  const maxPrice = Math.max(...priceData);
  const binWidth = (maxPrice - minPrice) / bins;
  const binEdges = Array.from({ length: bins + 1 }, (_, i) => minPrice + i * binWidth);
  const histogramData = binEdges.slice(0, -1).map((edge, i) => {
    const count = priceData.filter(price => price >= edge && price < binEdges[i + 1]).length;
    return count;
  });

  const histogramChartData = {
    labels: binEdges.slice(0, -1).map(edge => `${Math.round(edge/1000)}k`),
    datasets: [
      {
        label: 'Price Distribution',
        data: histogramData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Graph 2: Price vs. Year Scatter Plot
  const scatterChartData = {
    datasets: [
      {
        label: 'Cars',
        data: validData.map(item => ({
          x: item.year,
          y: item.Price,
        })),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        pointRadius: 5,
      },
      {
        label: 'Your Car',
        data: predictedPrice && formData.year ? [{
          x: parseInt(formData.year),
          y: predictedPrice,
        }] : [],
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 10,
        pointStyle: 'star',
      },
    ],
  };

  // Graph 3: Price by Brand Bar Chart
  const brandPrices = brands.map(brand => {
    const prices = validData.filter(item => item.brand === brand).map(item => item.Price);
    return prices.length ? prices.reduce((sum, p) => sum + p, 0) / prices.length : 0;
  });

  const barChartData = {
    labels: brands,
    datasets: [
      {
        label: 'Average Price by Brand',
        data: brandPrices,
        backgroundColor: brands.map(brand =>
          brand === formData.brand ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)'
        ),
        borderColor: brands.map(brand =>
          brand === formData.brand ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Car Price Predictor
        </h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <select
                name="Vehicle_color"
                value={formData.Vehicle_color}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mileage (km)</label>
              <input
                type="number"
                name="Mileage"
                value={formData.Mileage}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <select
                name="Vehicle_condition"
                value={formData.Vehicle_condition}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Engine Size</label>
              <select
                name="engine_size"
                value={formData.engine_size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {engineSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="1980"
                max="2023"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gearbox</label>
              <select
                name="gearbox"
                value={formData.gearbox}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {gearboxes.map(gearbox => (
                  <option key={gearbox} value={gearbox}>{gearbox}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Predict Price
              </button>
            </div>
          </form>

          {/* Prediction Result */}
          {predictedPrice && (
            <div className="mt-4 p-4 bg-green-100 rounded-md">
              <p className="text-lg font-semibold text-green-800">
                Predicted Price: {predictedPrice.toFixed(2)} TND
              </p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 rounded-md">
              <p className="text-lg font-semibold text-red-800">Error: {error}</p>
            </div>
          )}
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Price Distribution</h2>
            <Bar
              data={histogramChartData}
              options={{
                plugins: {
                  title: { display: true, text: 'Price Distribution (TND)' },
                  legend: { display: false },
                },
                scales: {
                  x: { title: { display: true, text: 'Price (thousands TND)' } },
                  y: { title: { display: true, text: 'Count' } },
                },
              }}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Price vs. Year</h2>
            <Scatter
              data={scatterChartData}
              options={{
                plugins: {
                  title: { display: true, text: 'Price vs. Year' },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Year' },
                    min: 1980,
                    max: 2023,
                    type: 'linear',
                  },
                  y: {
                    title: { display: true, text: 'Price (TND)' },
                    min: 0,
                  },
                },
              }}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Average Price by Brand</h2>
            <Bar
              data={barChartData}
              options={{
                plugins: {
                  title: { display: true, text: 'Average Price by Brand' },
                },
                scales: {
                  x: { title: { display: true, text: 'Brand' } },
                  y: { title: { display: true, text: 'Average Price (TND)' } },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;