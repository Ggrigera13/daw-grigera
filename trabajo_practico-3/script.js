var API_URL = 'https://rickandmortyapi.com/api/character';

var getAllButton = document.getElementById('getAllButton');
var resultsSection = document.getElementById('results');
var errorSection = document.getElementById('error');
var paginationSection = document.getElementById('pagination');

var filterForm = document.getElementById('filterForm');

var lastQuery = '';

var genderDictionary = {
    'Female': 'Femenino',
    'Male': 'Masculino',
    'Genderless': 'Sin Género',
    'unknown': 'Desconocido'
};

var statusDictionary = {
    'Alive': 'Vivo',
    'Dead': 'Muerto',
    'unknown': 'Desconocido'
};

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    var name = document.getElementById('name').value;
    var status = document.getElementById('status').value;
    var species = document.getElementById('species').value;
    var type = document.getElementById('type').value;
    var gender = document.getElementById('gender').value;
  
    var query = new URLSearchParams({ name, status, species, type, gender });
    getCharacters(`${API_URL}/?${query.toString()}`);
});

getAllButton.addEventListener('click', () => {
    filterForm.reset();
    getCharacters(API_URL);
});

async function getCharacters(url, saveQuery = true) {
    resultsSection.innerHTML = '';
    errorSection.textContent = '';
    paginationSection.innerHTML = '';

    try {
        var response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener los personajes. Verifica los filtros o intenta más tarde.');
        }

        var data = await response.json();
        displayCharacters(data.results);

        if (saveQuery) {
            var generatedUrl = new URL(url);
            generatedUrl.searchParams.delete('page');
            lastQuery = `${generatedUrl.origin}${generatedUrl.pathname}?${generatedUrl.searchParams.toString()}`;
        }

        displayPagination(data.info);
    } catch (error) {
        errorSection.textContent = error.message;
    }
}

function displayCharacters(characters) {
    if (!characters || characters.length === 0) {
        resultsSection.innerHTML = '<p>No se encontraron personajes.</p>';
        return;
    }

    characters.forEach(character => {
        var card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p><strong>Estado:</strong> ${getStatusName(character.status)}</p>
            <p><strong>Especie:</strong> ${character.species}</p>
            <p><strong>Género:</strong> ${getGenderName(character.gender)}</p>
            `;
        resultsSection.appendChild(card);
    });
}

function getGenderName(gender) {
    return genderDictionary[gender]
}

function getStatusName(status) {
    return statusDictionary[status];
}

function displayPagination(info) {
    if (!info || info.pages <= 1) {
        return;
    }

    var currentPage = getPageFromUrl(info.next, info.prev);
    var totalPages = info.pages;

    for (let i = 1; i <= totalPages; i++) {
        var createdButton = document.createElement('button');
        createdButton.textContent = i;
        createdButton.disabled = i === currentPage;

        createdButton.addEventListener('click', () => {
            getCharacters(`${lastQuery}&page=${i}`, false);
        });

        paginationSection.appendChild(createdButton);
    }
}

function getPageFromUrl(next, prev) {
    if (prev) {
        var url = new URL(prev);
        return parseInt(url.searchParams.get('page')) + 1;
    } else if (next) {
        var url = new URL(next);
        return parseInt(url.searchParams.get('page')) - 1;
    }

    return 1;
}