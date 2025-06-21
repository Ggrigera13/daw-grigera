var API_URL = 'https://rickandmortyapi.com/api/character';

var getAllButton = document.getElementById('getAllButton');
var resultsSection = document.getElementById('results');
var errorSection = document.getElementById('error');

var filterForm = document.getElementById('filterForm');

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
    fetchCharacters(`${API_URL}/?${query.toString()}`);
});

getAllButton.addEventListener('click', () => {
    filterForm.reset();
    fetchCharacters(API_URL);
});

async function fetchCharacters(url) {
    resultsSection.innerHTML = '';
    errorSection.textContent = '';

    try {
        var response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener los personajes. Verifica los filtros o intenta más tarde.');
        }

        var data = await response.json();
        renderCharacters(data.results);
    } catch (error) {
        errorSection.textContent = error.message;
    }
}

function renderCharacters(characters) {
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
