import { useEffect, useState } from 'react';
import axios from 'axios';
import ollama from 'ollama/browser'

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortedUsers, setSortedUsers] = useState(null);

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

            // SORTING
            let dictionary = {};
            for (let i = 0; i < allUsers.length; i++) {
                let difference = 
                    (Math.abs(userFeatures.instrumentalness - allUsers[i].instrumentalness)) +
                    (Math.abs(userFeatures.acousticness - allUsers[i].acousticness)) +
                    (Math.abs(userFeatures.energy - allUsers[i].energy)) +
                    (Math.abs(userFeatures.speechiness - allUsers[i].speechiness)) +
                    (Math.abs(userFeatures.valence - allUsers[i].valence)) +
                    (Math.abs(userFeatures.danceability - allUsers[i].danceability)) +
                    (Math.abs(userFeatures.liveness - allUsers[i].liveness));
                
                difference = (1 - (difference / 7.0)) * 100; // Adjusted for max difference based on features
                dictionary[allUsers[i].name] = difference;
            }

            console.log(dictionary);

            // Step 1: Get entries (key-value pairs) and sort them by value
            const sortedKeyArray = Object.entries(dictionary).sort((a, b) => b[1] - a[1]);

            console.log(sortedKeyArray);

            // Set the sorted users
            setSortedUsers(sortedKeyArray);


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
        <div className="flex flex-wrap justify-center gap-4">
        <div className="flex flex-wrap justify-center gap-4">
          {sortedUsers.map((array) => (
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg w-52 flex flex-col items-center" key={array[0]}>
              <h3 className="text-1xl font-bold">{array[0]}</h3>
              <p className="text-1xl font-bold">{`${array[1].toFixed(2)}% Match`}</p>
            </div>
          ))}
        </div>
        </div>
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
