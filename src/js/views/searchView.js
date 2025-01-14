import { elements } from './base';
// import icons from '../../img/icons.svg';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'))
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active');
  })

  document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

/// limit the recipe title to 1 line
const limitRecipeTitle = (title, limit = 20) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    // return the result
    return `${newTitle.join(' ')} ...`;
  }
  return title
};

const renderRecipe = recipe => {
  const markup = `
  <li>
    <a class="results__link" href="#${recipe.recipe_id}">
      <figure class="results__fig">
        <img src="${recipe.image_url}" alt="${recipe.title}" />
      </figure>
      <div class="results__data">
        <h4 class="results__title">${limitRecipeTitle(recipe.title)}</h4>
        <p class="results__publisher">${recipe.publisher}</p>
        <div class="results__user-generated">
          <svg>
            <use xlink:href="../../img/icons.svg#icon-user"></use>
          </svg>
        </div>
      </div>
    </a>
  </li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
  <button class="btn--inline pagination__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
    <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
    <svg class="search__icon">
      <use xlink:href="../../img/icons.svg#icon-arrow-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`;



const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    //only  button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // both buttons
    button = `
        ${createButton(page, 'next')}
        ${createButton(page, 'prev')}
    `;
  } else if (page === pages && pages > 1) {
    // Only button to go to the previous page
    button = createButton(page, 'prev');
  }

   elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page -1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);


  // render the pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};

