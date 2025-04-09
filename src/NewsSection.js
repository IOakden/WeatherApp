import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsSection = ({ location }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const API_TOKEN = "gnluxPMkoJ6TG0GOcbea2wcFQUA7pPn9Y8npbhlW";

  const minSwipeDistance = 50;

  useEffect(() => {
    const fetchNews = async () => {
      if (!location || !location.name) return;
      
      setLoading(true);
      setError(null);
      setCurrentIndex(0); // Reset to first article when location changes
      
      try {
        // Get the current date
        const currentDate = new Date();

        // Get the date for one month ago
        const lastMonthDate = new Date(currentDate);
        lastMonthDate.setMonth(currentDate.getMonth() - 1);

        // Format the dates to YYYY-MM-DD
        const currentDateFormatted = currentDate.toISOString().slice(0, 10);
        const lastMonthDateFormatted = lastMonthDate.toISOString().slice(0, 10);

        // Build search query
        const searchQuery = location.name + (location.country ? ` ${location.country}` : '');

        const response = await axios.get(
          `https://api.thenewsapi.com/v1/news/top?api_token=${API_TOKEN}&search=${encodeURIComponent(searchQuery)}&language=en&limit=10&published_after=${lastMonthDateFormatted}&published_before=${currentDateFormatted}`
        )
        if (response.data && response.data.data) {
          setNews(response.data.data);
        } else {
          setError('Could not fetch news');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news for this location');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [location]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleNextArticle = () => {
    if (currentIndex < news.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevArticle = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextArticle();
    }
    if (isRightSwipe) {
      handlePrevArticle();
    }
  };

  if (loading) {
    return (
      <div className="news-section">
        <h2>Local News</h2>
        <div className="loading">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-section">
        <h2>Local News</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="news-section">
      <h2>News for {location?.name}</h2>
      
      {news.length === 0 ? (
        <p className="no-news">No news available for this location.</p>
      ) : (
        <div className="news-carousel">
          <div 
            className="carousel-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="news-card">
              {news[currentIndex].image_url && (
                <div className="news-image">
                  <img 
                    src={news[currentIndex].image_url} 
                    alt={news[currentIndex].title} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }} 
                  />
                </div>
              )}
              <div className="news-content">
                <h3>
                  <a href={news[currentIndex].url} target="_blank" rel="noopener noreferrer">
                    {news[currentIndex].title}
                  </a>
                </h3>
                <p className="news-source">
                  {news[currentIndex].source} • {formatDate(news[currentIndex].published_at)}
                </p>
                <p className="news-description">
                  {news[currentIndex].description || news[currentIndex].snippet}
                </p>
                
                {news[currentIndex].categories && news[currentIndex].categories.length > 0 && (
                  <div className="news-categories">
                    {news[currentIndex].categories.map(category => (
                      <span key={category} className="category-tag">{category}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="carousel-controls">
            <button 
              className="carousel-button prev" 
              onClick={handlePrevArticle}
              disabled={currentIndex === 0}
            >
              &lt;
            </button>
            
            <div className="carousel-indicators">
              <span className="current-index">{currentIndex + 1}</span>
              <span className="total-count">/ {news.length}</span>
            </div>
            
            <button 
              className="carousel-button next" 
              onClick={handleNextArticle}
              disabled={currentIndex === news.length - 1}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsSection;