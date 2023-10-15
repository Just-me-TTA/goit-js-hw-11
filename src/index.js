import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '40060797-f13629dcce3146cc8bd36115b';

const searchForm = document.querySelector('.search-form');
const imageGallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
let totalHits = 0;
let perPage = 40;

searchForm.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreClick);

loadMoreButton.style.display = 'none';

async function handleFormSubmit(event) {
    event.preventDefault();
    searchQuery = searchForm.querySelector('input[name="searchQuery"]').value;

    if (searchQuery) {
        page = 1;
        clearImageGallery();
        loadMoreButton.style.display = 'none';
        await fetchImages();
    } else {
        clearImageGallery();
        showError('Please enter a search query.');
    }
}

async function fetchImages() {
    showLoader();

    try {
        const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
            const data = response.data;

            if (data.hits.length > 0) {
                renderImages(data.hits);
                totalHits = data.totalHits;

                if (page * perPage >= totalHits) {
                    loadMoreButton.style.display = 'none';
                    Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
                } else {
                    loadMoreButton.style.display = 'block';
                }
            } else {
                loadMoreButton.style.display = 'none';
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }
        } else {
            loadMoreButton.style.display = 'none';
            Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
    } finally {
        hideLoader();
    }
}

function renderImages(images) {
    images.forEach(image => {
        const imageElement = createImageElement(image.webformatURL, image.largeImageURL, image.tags, image.likes, image.views, image.comments, image.downloads);
        imageGallery.appendChild(imageElement);
    });
}

function clearImageGallery() {
    while (imageGallery.firstChild) {
        imageGallery.removeChild(imageGallery.firstChild);
    }
}

function showLoader() {
    searchForm.classList.add('loading');
}

function hideLoader() {
    searchForm.classList.remove('loading');
}

function showError(message) {
    Notiflix.Notify.failure(message);
}

function createImageElement(webformatURL, largeImageURL, tags, likes, views, comments, downloads) {
    const imageElement = document.createElement('div');
    imageElement.classList.add('photo-card');

    const image = document.createElement('img');
    image.src = webformatURL;
    image.alt = tags;
    image.loading = 'lazy';
    imageElement.appendChild(image);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const likesElement = document.createElement('p');
    likesElement.classList.add('info-item');
    likesElement.innerHTML = `<b>Likes:</b> ${likes}`;
    infoDiv.appendChild(likesElement);

    const viewsElement = document.createElement('p');
    viewsElement.classList.add('info-item');
    viewsElement.innerHTML = `<b>Views:</b> ${views}`;
    infoDiv.appendChild(viewsElement);

    const commentsElement = document.createElement('p');
    commentsElement.classList.add('info-item');
    commentsElement.innerHTML = `<b>Comments:</b> ${comments}`;
    infoDiv.appendChild(commentsElement);

    const downloadsElement = document.createElement('p');
    downloadsElement.classList.add('info-item');
    downloadsElement.innerHTML = `<b>Downloads:</b> ${downloads}`;
    infoDiv.appendChild(downloadsElement);

    imageElement.appendChild(infoDiv);

    return imageElement;
}

async function handleLoadMoreClick() {
    page++;
    await fetchImages();
}
