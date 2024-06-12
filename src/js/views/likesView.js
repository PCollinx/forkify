import { elements } from "./base";

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-bookmark' : 'icon-bookmark-fill';
    document.querySelector('.btn--round use').setAttribute('href', `../../img/icons.svg#${iconString}`);

    // icons.svg#icon-bookmark-fill
}

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
    const markup = `
        <li class="results">
            <a class="results__link" href="#${like.id}">
                <figure class="results__fig">
                    <img src="${like.img}" alt="${like.title}" />
                </figure>
                <div class="results__data">
                    <h4 class="results__title">${like.title}</h4>
                    <p class="results__publisher">${like.author}</p>
                </div>
            </a>
        </li> 
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.preview__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}

