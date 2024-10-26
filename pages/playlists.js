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
            const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            for (let i = 0; i < response.data.items.length; i++) {
              const audioFeatures = await axios.get(`https://api.spotify.com/v1/audio-features/${response.data.items[i].id}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              console.log(anudder);
            }

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
