import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const SERVER_BASE_URL = 'https://api.thedogapi.com/v1/images';
  const API_KEY = 'live_5NXsLTiebPv3vo1HBAVCUt1WXwm2IpI7yRG6WfZweX3CxdUKcwuV8bkhQIbAYUDc';
  const [dogData, setDogData] = useState(null);
  const [bannedProperties, setBannedProperties] = useState([]);

  const handleClick = (property) => {
    if (property && !bannedProperties.includes(property)) {
      setBannedProperties([...bannedProperties, property]);
    }
  };

  const fetchRandomDog = async () => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/search?has_breeds=true&api_key=${API_KEY}`);
      if (
        bannedProperties.includes(response.data[0].breeds[0].life_span) ||
        bannedProperties.includes(response.data[0].breeds[0].height.imperial) ||
        bannedProperties.includes(response.data[0].breeds[0].weight.imperial) ||
        bannedProperties.includes(response.data[0].breeds[0].name)
      ) {
        await fetchRandomDog();
      } else {
        setDogData(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching dog image:', error);
    }
  };

  return (
    <div className='container'>
      <div className='mainBody'>
        <h1>Veni Vici!</h1>
        <p>Discover dogs from your wildest dreams!</p>
        {dogData &&
          <div>
            <div className='dogInfo'>
              <button onClick={() => handleClick(dogData?.breeds[0]?.name)}>{dogData?.breeds[0]?.name}</button>
              <button onClick={() => handleClick(dogData?.breeds[0]?.life_span)}>{dogData?.breeds[0]?.life_span}</button>
              <button onClick={() => handleClick(dogData?.breeds[0]?.height.imperial)}>{dogData?.breeds[0]?.height.imperial} inches</button>
              <button onClick={() => handleClick(dogData?.breeds[0]?.weight.imperial)}>{dogData?.breeds[0]?.weight.imperial} lbs</button>
            </div>
            <img className='dogImage' src={dogData?.url} alt="Random Dog Image" />
          </div>
        }
        <button className='fetchDogButton' onClick={() => fetchRandomDog()}>🔀 Discover!</button>
      </div>
      <div className='bannedBody'>
        <h2>Banned Properties</h2>
        <div className='bannedButtonsContainer'>
          {bannedProperties.length > 0 && bannedProperties.map((property, index) => (
            <button key={index}>
              {property}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
