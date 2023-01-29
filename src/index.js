import './css/styles.css';
import Notiflix from 'notiflix';
import imageMarkupHdb from './templates/images-markup.hbs';
import { fetchImages } from './js/fetch-images';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';

const Handlebars = require("handlebars");
const DEBOUNCE_DELAY = 300;
// const axios = require('axios').default;

const refs = {
  input: document.querySelector('.search-form input'),
  searchBtn: document.querySelector('.search-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery')
}
let searchedWord = '';
let page = 1;
let lightbox;

refs.searchBtn.disabled = true;

refs.input.addEventListener('input', debounce(onClickInpit, DEBOUNCE_DELAY));
refs.form.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);


async function onSearchClick(evt){
  
  evt.preventDefault();
  cleanMarkup();
  
  const {
    elements: { searchQuery }
  } = evt.currentTarget;
  // console.log(searchQuery.value);
  searchedWord = searchQuery.value.trim();

  try {
    const fetchImagesResult = await fetchImages(searchedWord, page);
    if(fetchImagesResult.hits.length <= 0){
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }

    createimagesMarkup(fetchImagesResult);
    lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
    lightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found ${fetchImagesResult.totalHits} images`);
    setTimeout(loadBtnAppear, 2000);  

    if (fetchImagesResult.hits.length < 40 && fetchImagesResult.hits.length !== 0){
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
      return
    };
  } catch(err) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }
}


async function onLoadMoreClick(){
  try {
    page +=1;
    console.log(page, 'page Number')
    const moreImagesLoaded = await fetchImages(searchedWord, page);
    let lastPageChecker = Math.ceil(moreImagesLoaded.totalHits / 40);
    console.log(moreImagesLoaded.totalHits, 'totalhits')
    // console.log(moreImagesLoaded, 'fetch for load');
    console.log(lastPageChecker, 'page checker')
    createimagesMarkup(moreImagesLoaded);
    lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
    lightbox.refresh();

    if (page === lastPageChecker) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results.");
    }
  } catch(err) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}

function createimagesMarkup(res){
  const imagesMarkup = imageMarkupHdb(res.hits);
  refs.gallery.insertAdjacentHTML('beforeend', imagesMarkup)
  return imagesMarkup;
}


function cleanMarkup(){
  refs.gallery.innerHTML = '';
  page = 1;
  refs.loadMoreBtn.classList.add('is-hidden');
}

function loadBtnAppear(){
  refs.loadMoreBtn.classList.remove('is-hidden')
}

function onClickInpit(evt){
  if(evt.target.value.trim()){
    refs.searchBtn.disabled = false;
  } else {
    refs.searchBtn.disabled = true;
  }
}
