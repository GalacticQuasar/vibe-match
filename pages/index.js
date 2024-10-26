import styles from '../styles/Index.module.css';
import Image from 'next/image'
const Home = () => {
  return (
    <div className = {styles.header}>
      <Image
        src="/images/vibe-match-logo.jpg"
        width={500}
        height={500}
        alt="Vibe Match Logo"
      />
      <a href="/api/login">
        <button className={styles.loginButton}>Login with Spotify</button>
      </a>
    </div>
  );
};

export default Home;
