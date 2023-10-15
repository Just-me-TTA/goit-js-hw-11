const apiKey = '40060797-f13629dcce3146cc8bd36115b';

const searchForm = document.querySelector('.search-form');
const imageGallery = document.querySelector('.gallery');
const errorMessage = document.querySelector('.error-message');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreClick);

let page = 1;

function handleFormSubmit(event) {
    event.preventDefault();
    const searchQuery = searchForm.querySelector('input[name="searchQuery"]').value;
    
    if (searchQuery) {
        page = 1; // Скидаємо сторінку при новому пошуку
        fetchImages(searchQuery);
    } else {
        clearImageGallery();
        showError('Please enter a search query.');
    }
}

async function fetchImages(searchQuery, nextPage = 1) {
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${nextPage}&per_page=40`;
    
    if (nextPage === 1) {
        clearImageGallery();
    }
    showLoader();

    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.hits.length > 0) {
                renderImages(data.hits);
                page = nextPage;
            } else {
                loadMoreButton.style.display = 'none';
                if (nextPage === 1) {
                    showError("Sorry, there are no images matching your search query. Please try again.");
                }
            }
        } else {
            showError('An error occurred while fetching images. Please try again later.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        showError('An error occurred while fetching images. Please try again later.');
    } finally {
        hideLoader();
    }
}

function renderImages(images) {
    images.forEach(image => {
        const imageElement = createImageElement(image.webformatURL, image.largeImageURL, image.tags);
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
    loadMoreButton.style.display = 'none';
}

function hideLoader() {
    searchForm.classList.remove('loading');
    loadMoreButton.style.display = 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function createImageElement(webformatURL, largeImageURL, tags) {
    const imageElement = document.createElement('div');
    imageElement.classList.add('photo-card');

    const image = document.createElement('img');
    image.src = webformatURL;
    image.alt = tags;
    image.loading = 'lazy';
    imageElement.appendChild(image);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${tags}`;
    infoDiv.appendChild(likes);

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${tags}`;
    infoDiv.appendChild(views);

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${tags}`;
    infoDiv.appendChild(comments);

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${tags}`;
    infoDiv.appendChild(downloads);

    imageElement.appendChild(infoDiv);

    return imageElement;
}

function handleLoadMoreClick() {
    fetchImages(searchForm.querySelector('input[name="searchQuery"]').value, page + 1);
}
