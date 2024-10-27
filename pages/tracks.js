import { useEffect, useState } from 'react';
import axios from 'axios';
import ollama from 'ollama/browser'

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState(null);

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

            const userDetails = await axios.get('https://api.spotify.com/v1/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            userFeatures.id = userDetails.data.id;
            userFeatures.name = userDetails.data.display_name;
            console.log(userFeatures);

            // MONGO THINGS
            // Check if user exists in MongoDB
            const fetchedUser = await fetch(`/api/users?id=${userFeatures.id}`);

            // If user does not exist, add to DB
            if (fetchedUser.status == 404) {
              const postResponse = await fetch('/api/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(userFeatures),
              });

              if (!postResponse.ok) {
                throw new Error('Failed to add user to the database');
              }
            } else {
              console.log("User already exists in DB");
            }

            const allUsersResponse = await fetch(`/api/users`);
            const allUsers = await allUsersResponse.json();
            console.log(`ALL USERS: ${JSON.stringify(allUsers)}`);
            setAllUsers(allUsers);

            // LLAMA THINGS
            const ollamaResponse = await ollama.chat({
              model: 'llama3.2',
              messages: [{ role: 'user', content: `Given the following values, provide a short description of my music taste in less than 50 words (NO NUMBERS): ${JSON.stringify(userFeatures)}` }],
            });
            console.log(ollamaResponse.message.content);

            setTracks(response.data.items);
            setMessage(ollamaResponse.message.content);
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
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
      {message && (
        <div>
          <h2>Music Taste Description</h2>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Tracks;
