import { useEffect, useState } from 'react';
import axios from 'axios';
import ollama from 'ollama/browser'

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [message, setMessage] = useState("");
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

            const ollamaResponse = await ollama.chat({
              model: 'llama3.2',
              messages: [{ role: 'user', content: `Given the following values, provide a short description of my music taste in less than 50 words (NO NUMBERS): ${JSON.stringify(userFeatures)}` }],
            });
            console.log(ollamaResponse.message.content);

            console.log(userFeatures);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="w-12 h-12 border-4 border-t-[#1DB954] border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return ( 
    <div className="bg-black min-h-screen p-6 flex justify-between"> {/* Black background with flexbox layout */}
      {/* Your Top Tracks Box */}
      <div className="shadow w-1/2 h-800 p-6 border-2 border-[#1DB954] bg-black text-white rounded-lg mr-6 shadow-glow shadow-[0_0px_20px_rgba(29,185,84,0.5)]"> {/* Centered shadow */}
      <h1 className="text-4xl font-bold mb-4">Your Top Tracks:</h1> {/* Margin-bottom for spacing */}
        <div className="flex flex-col space-y-3"> {/* Flex column for spacing between cards */}
          {tracks.map((track) => (
            <div key={track.id} className="w-full">
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}`} // Embed URL for Spotify track
                width="100%" // Make iframe responsive
                height="80" // Adjust height as needed
                frameBorder="0" // No border around iframe
                allow="encrypted-media" // Allow encrypted media playback
                className="rounded-lg" // Rounded corners for iframe
              ></iframe>
            </div>
          ))}
        </div>
      </div>
      {/* Similar Users Box */}
      <div className="shadow w-1/2 h-800 p-6 border-2 border-[#1DB954] bg-black text-white rounded-lg shadow-glow shadow-[0_0px_20px_rgba(29,185,84,0.5)]"> {/* Centered shadow */}
        <h1 className="text-4xl font-bold mb-4">Similar Users</h1> {/* Title for similar users */}
        <ul className="list-disc pl-5 mb-6"> {/* Add bullet points with left padding and margin-bottom */}
          <li className="text-lg mb-2">Add here</li> {/* Placeholder list item */}
          <li className="text-lg mb-2">Add here</li> {/* Placeholder list item */}
          <li className="text-lg mb-2">Add here</li> {/* Placeholder list item */}
        </ul>
        {message && (
          <div>
            <h2 className="text-4xl font-bold mb-4">Music Taste Description:</h2> {/* Margin-bottom for spacing */}
            <p className="text-lg mb-2">{message}</p> {/* Slightly lighter text color for contrast */}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Tracks;
