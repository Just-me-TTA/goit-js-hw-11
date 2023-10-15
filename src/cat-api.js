import axios from "axios";

axios.defaults.headers.common["x-api-key"] = "live_J8W0hahIFUjcdgxSQO6kelzHRqxxYRskhO1UUhHFWVPvDKt3f4v55fOa68CYgc7F";

export function fetchBreeds() {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');

  loader.style.display = 'block';
  error.style.display = 'none';
  breedSelect.disabled = true;

  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then((response) => {
      loader.style.display = 'none';
      breedSelect.disabled = false;
      const breeds = response.data;
      return breeds;
    })
    .catch((error) => {
      loader.style.display = 'none';
      error.style.display = 'block';
      throw error;
    });
}

export function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching cat by breed:", error);
      return null;
    });
}
