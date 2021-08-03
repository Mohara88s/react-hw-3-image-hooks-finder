import { useState, useEffect } from 'react';
import 'modern-normalize/modern-normalize.css';
import styles from './App.module.css';
import Searchbar from './components/Searchbar/Searchbar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './components/Button/Button';
import Loader from 'react-loader-spinner';
import Modal from './components/Modal/Modal';
import pixabayApi from './services/pixabay-api';

function App() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageImages, setCurrentPageImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  useEffect(() => {
    if (searchQuery) fetchImages();
  }, [searchQuery]);

  const onChangeQuery = query => {
    setSearchQuery(query);
    setCurrentPage(1);
    setImages([]);
    setError(null);
  };

  const fetchImages = () => {
    setIsLoading(true);
    const options = { searchQuery, currentPage };

    pixabayApi
      .fetchImages(options)
      .then(images => {
        setImages(prevState => [...prevState, ...images]);
        setCurrentPage(prevState => prevState + 1);
        setCurrentPageImages([...images]);
        if (images.length === 0)
          setError('Nothing was find by your query. Try again.');
      })
      .catch(error => setError(error.message))
      .finally(() => setIsLoading(false));
  };

  const toogleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const onClickImageGalleryItem = e => {
    setModalUrl(e.currentTarget.getAttribute('url'));
    setModalAlt(e.currentTarget.getAttribute('alt'));
    toogleModal();
  };
  const souldLoadMoreButton = !(currentPageImages.length < 12) && !isLoading;
  return (
    <div className={styles.App}>
      <Searchbar onSubmit={onChangeQuery} />
      {error && (
        <p style={{ color: 'red', textAlign: 'center', fontSize: '20px' }}>
          This is error: {error}
        </p>
      )}
      <ImageGallery>
        {images.map(({ id, tags, webformatURL, largeImageURL }) => (
          <ImageGalleryItem
            key={id}
            alt={tags}
            src={webformatURL}
            url={largeImageURL}
            onClick={onClickImageGalleryItem}
          />
        ))}
      </ImageGallery>
      {isLoading && (
        <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
      )}
      {souldLoadMoreButton && <Button onClick={fetchImages} />}
      {showModal && (
        <Modal src={modalUrl} alt={modalAlt} onClose={toogleModal} />
      )}
    </div>
  );
}

export default App;
