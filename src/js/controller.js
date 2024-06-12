import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Likes from "./models/likes";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

/** SEARCH CONTROLLER */
const controlSearch = async () => {
    // 1) Get the query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (error) {
            alert('Something wrong with the search...')
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn--inline');
    if (btn) {
        const goToPage =  parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

/** RECIPE CONTROLLER */
const controlRecipe = async () => {
    // Get ID from the url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare the UI for changes 
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight the selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe Object
        state.recipe = new Recipe(id);

        try {
            // Get the recipe Data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();  
            state.recipe.calcServings();
    
            // render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );

        } catch (error) {
            console.log(error)
            alert('Error processing recipe');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add likes to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to the UI list
        likesView.renderLike(newLike);

         // User HAS yet liked current recipe
    } else {
         // Remove likes to the state
         state.likes.deleteLike(currentID);

        // toggle the like button
        likesView.toggleLikeBtn(false);
 
        // Remove like from the UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore like recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn--round, btn--round *')) {
        // like controller
        controlLike();
    }
})

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredient(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredient(state.recipe);
    }
    
});