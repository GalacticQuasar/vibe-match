# 🎵 Vibe Match

Welcome to **Vibe Match**, a web application designed to help users discover their musical matches based on their listening habits on Spotify! 🎶 Dive into your music taste, find similarities with others, and explore a new world of sound.

## 🚀 Features

- **Fetches Top Tracks**: The application retrieves the top 20 tracks of the user from Spotify's API, providing a snapshot of their favorite music. 🎧

- **Audio Feature Analysis**: For each track, we gather various audio features (like energy, danceability, and more) to analyze music preferences, giving users deeper insights into their listening habits. 🔍

- **Personalized Music Taste Description**: Using advanced models, we generate a concise description of the user's music taste based on the collected audio features, allowing users to understand their vibe in just a few words. ✍️

- **Similar Users Display**: The app showcases the top users in the database with the most similar music tastes, fostering a community of music lovers who can connect and share their favorite tracks! 👥

## 💻 Technologies Used

- **Next.js**: This powerful React framework enables server-side rendering, optimizing our application for performance and SEO while allowing for smooth navigation. 🌐

- **MongoDB**: This NoSQL database framework holds our user data and makes it possible to compare your tastes with our other users. 📂

- **Ollama**: This open source library allows us to run llama LLM locally and powers the personalization of the application. ⌨️

- **Tailwind CSS**: For a modern and responsive design, Tailwind CSS provides utility classes that enable rapid styling and customization of components. 🎨

## 🛠️ Codebase Overview

### Home Component

The Home component serves as the entry point of the application, welcoming users with the Vibe Match logo, title, and a login button that initiates the Spotify authentication process. Users are redirected to the Spotify authentication page, where they can log in and allow the application access to their Spotify data.

### Authentication Handler

The authentication handler manages the Spotify login flow by receiving an authorization code upon successful login. It exchanges this code for an access token, which allows the application to access the user's Spotify data securely. After obtaining the token, users are redirected to the tracks page to start exploring their musical journey.

## 📦 Installation

To get started with Vibe Match, follow these steps:

1. **Clone the Repository**: Clone the Vibe Match repository from GitHub to your local machine.

2. **Install Dependencies**: Navigate into the project directory and install the necessary dependencies using your package manager.

3. **Environment Variables**: Create a `.env.local` file in the root directory and add your Spotify development credentials, including your client ID, client secret, and redirect URI.

4. **Start the Development Server**: Run the development server and open your browser to view the application.

## 🎉 Conclusion

Vibe Match is more than just an application; it's a platform for music lovers to connect, discover, and understand their musical tastes. With the power of Spotify's API and modern web technologies, we aim to bring music enthusiasts closer together.

Join us on this musical journey, and let's vibe together! If you have any questions or suggestions, feel free to reach out! 🎤

## 🤝 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for providing access to a wealth of music data.
- [Next.js](https://nextjs.org/) for powering our application with server-side rendering capabilities.
- [Tailwind CSS](https://tailwindcss.com/) for enabling rapid styling and customization.
