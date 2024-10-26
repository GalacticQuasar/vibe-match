import { useEffect, useState } from 'react';
import axios from 'axios';

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      // Check if we're in the browser
      if (typeof window !== 'undefined') {
        const accessToken = new URLSearchParams(window.location.search).get('access_token');
        if (accessToken) {
          try {
            // Get all tracks
            const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            let userFeatures = {
              id: "",
              instrumentalness: 0,
              acousticness: 0,
              energy: 0,
              speechiness: 0,
              valence: 0,
              danceability: 0,
              liveness: 0,
            };
            
            const promises = response.data.items.map(async (item) => {
              const audioFeatures = await axios.get(`https://api.spotify.com/v1/audio-features/${item.id}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              
              // Make sure to access the data correctly
              const features = audioFeatures.data;
              
              userFeatures.instrumentalness += features.instrumentalness;
              userFeatures.acousticness += features.acousticness;
              userFeatures.energy += features.energy;
              userFeatures.speechiness += features.speechiness;
              userFeatures.valence += features.valence;
              userFeatures.danceability += features.danceability;
              userFeatures.liveness += features.liveness;
            });
            
            // Wait for all promises to resolve
            await Promise.all(promises);
            
            // Calculate averages
            const trackCount = response.data.items.length;
            if (trackCount > 0) {
              Object.keys(userFeatures).forEach(key => {
                userFeatures[key] /= trackCount;
              });
            }
            
            console.log(userFeatures);            

            setTracks(response.data.items);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        } else {
          setError('No access token found.');
          setLoading(false);
        }
      }
    };

    fetchTracks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Your Top Tracks</h1>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>{track.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tracks;
