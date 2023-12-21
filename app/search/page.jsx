"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image'
import style from '../page.module.css'
import { CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const styles = {
  grayLoader: {
    color: "gray",
  },
};

const apiKey = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';
const apiUrl = 'https://api.giphy.com/v1/gifs/search';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // caching the query response for search query
        const response = await fetch(`${apiUrl}?q=${searchQuery}&api_key=${apiKey}`, { cache: 'force-cache' });
        const data = await response.json();
        setGifs(data.data);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
      } finally {
        setLoading(false);
      }
    };

    // Use a debounce function to avoid rapid API requests while typing
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        fetchData();
      } else {
        setGifs([]);
      }
    }, 300);

    // Cleanup the timer on component unmount or when searchQuery changes
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogOut = () => {
    Cookies.remove("userAuthToken");
    router.push("/");
  }

  return (
    <main className={style.main}>
        <nav style={{ display: "flex", justifyContent: "flex-end", width: "100%", margin: "1rem 4rem 0 0" }}>
        <button onClick={handleLogOut} className={style.logOutButton}>
            Log Out
          </button>
        </nav>
      <section className={style.searchSection}>
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="Articles name or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={style.searchInput}
          />
          <button onClick={() => setSearchQuery('')} className={style.searchButton}>
            Clear
          </button>
        </div>
      </section>
      <div className={style.gifsContainer}>
        {loading ? (
          <CircularProgress style={styles.grayLoader} thickness={5} />
        ) : (
          <div className={style.grid}>
            {gifs.map((gif) => (
              <div key={gif.id} className={style.gifCard}>
                <Image src={`${gif.images.fixed_height.url}`} alt={gif.title} width={200} height={200} />
                <div className={style.gifNames}>
                  <span>{gif.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
