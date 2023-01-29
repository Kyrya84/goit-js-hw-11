// const axios = require('axios').default;
import axios from 'axios';

export async function fetchImages(searchedWord, page) {
  const BASE_URL = 'https://pixabay.com/api/?key=33175223-25b8fe096b797ca818efbd756'

  const response = await axios.get(`${BASE_URL}&q=${searchedWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
  const images = response.data;
  // console.log(images, 'fetch function');

  return images;
}

// fetchPictures

// pixabay-fetch