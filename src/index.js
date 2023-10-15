// script.js
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const infoLoader = document.querySelector('.loader');
const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const errorElement = document.querySelector('.error'); // Додаємо елемент помилки

function init() {
  infoLoader.style.display = 'block';
  errorElement.style.display = 'none'; // Приховуємо елемент помилки під час завантаження

  fetchBreeds()
    .then((breeds) => {
      infoLoader.style.display = 'none';
      errorElement.style.display = 'none'; // Приховуємо елемент помилки після успішного завершення

      breeds.forEach((breed) => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.text = breed.name;
        breedSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.log(error);
      infoLoader.style.display = 'none';
      errorElement.style.display = 'block'; // Відображаємо елемент помилки у разі помилки запиту
    });

  breedSelect.addEventListener('change', () => {
    const selectBreedId = breedSelect.value;
    infoLoader.style.display = 'block';
    errorElement.style.display = 'none'; // Приховуємо елемент помилки під час завантаження інформації про кота
    catInfo.innerHTML = '';

    fetchCatByBreed(selectBreedId)
      .then((result) => {
        infoLoader.style.display = 'none';
        errorElement.style.display = 'none'; // Приховуємо елемент помилки після успішного завершення

        if (result && result.length > 0) {
          const catData = result[0];
          const catBreed = catData.breeds[0];
          catInfo.innerHTML = `
            <img src="${catData.url}" alt="Cat">
            <div class="cats-story">
              <h2>${catBreed.name}</h2>
              <p><strong>Description:</strong> ${catBreed.description}</p>
              <p><strong>Temperament:</strong> ${catBreed.temperament}</p>
            </div>
          `;
        }
      })
      .catch((error) => {
        console.log(error);
        infoLoader.style.display = 'none';
        errorElement.style.display = 'block'; // Відображаємо елемент помилки у разі помилки запиту
      });
  });
}

window.addEventListener('load', init);
