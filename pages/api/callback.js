import axios from 'axios';
import querystring from 'querystring';

export default async function handler(req, res) {
  const { code } = req.query;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    data: querystring.stringify({
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  };

  try {
    const response = await axios(authOptions);
    const accessToken = response.data.access_token;
    res.redirect(`/playlists?access_token=${accessToken}`);
  } catch (error) {
    console.error(error);
    res.redirect('/?error=invalid_token');
  }
}
