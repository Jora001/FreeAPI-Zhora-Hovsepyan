const pokemonList = document.getElementById('pokemon-list');
const pokemonDetails = document.getElementById('pokemon-details');
const favoritesList = document.getElementById('favorites-list');

let pokemons = [];
let favorites = [];

fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
    .then(response => response.json())
    .then(data => {
        pokemons = data.results;
        renderPokemonList();
    })
    .catch(error => console.error(error));

function renderPokemonList() {
    pokemonList.innerHTML = '';
    pokemons.forEach(pokemon => {
        const li = document.createElement('li');
        li.textContent = capitalize(pokemon.name);
        li.addEventListener('click', () => showPokemonDetails(pokemon.url));
        pokemonList.appendChild(li);
    });
}

function showPokemonDetails(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            pokemonDetails.innerHTML = `
                <h3>${capitalize(data.name)}</h3>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <p>Height: ${data.height}</p>
                <p>Weight: ${data.weight}</p>
                <p>Types: ${data.types.map(t => t.type.name).join(', ')}</p>
                <button id="favorite-btn">
                    ${favorites.some(f => f.name === data.name) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            `;
            document.getElementById('favorite-btn').addEventListener('click', () => toggleFavorite(data));
        })
        .catch(error => console.error(error));
}

function toggleFavorite(pokemon) {
    const index = favorites.findIndex(f => f.name === pokemon.name);
    if (index >= 0) {
        favorites.splice(index, 1);
    } else {
        favorites.push({name: pokemon.name, url: pokemon.sprites.front_default, types: pokemon.types});
    }
    renderFavorites();
    showPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
}

function renderFavorites() {
    favoritesList.innerHTML = '';
    favorites.forEach(fav => {
        const li = document.createElement('li');
        li.textContent = capitalize(fav.name);
        li.addEventListener('click', () => {
            pokemonDetails.innerHTML = `
                <h3>${capitalize(fav.name)}</h3>
                <img src="${fav.url}" alt="${fav.name}">
                <p>Types: ${fav.types.map(t => t.type.name).join(', ')}</p>
                <button id="favorite-btn">Remove from Favorites</button>
            `;
            document.getElementById('favorite-btn').addEventListener('click', () => toggleFavorite(fav));
        });
        favoritesList.appendChild(li);
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
