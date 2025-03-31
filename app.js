const searchForm = document.querySelector('form');
const movieContainer = document.querySelector('.movie-container');
const inputBox = document.querySelector('.inputBox');
const searchContainer = document.querySelector('.search-container');

// Create a dropdown for suggestions
const suggestionsList = document.createElement('ul');
suggestionsList.classList.add('suggestions');
searchContainer.appendChild(suggestionsList);

const API_KEY = "17a97983"; // Your OMDB API Key

// Function to fetch movie suggestions
const getMovieSuggestions = async (query) => {
    if (query.length < 1) { // Fetch only when 1 or more characters are typed
        suggestionsList.innerHTML = "";
        return;
    }
    
    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.Response === "True") {
            showSuggestions(data.Search);
        } else {
            suggestionsList.innerHTML = ""; // Clear if no results found
        }
    } catch (error) {
        console.error("Error fetching movie suggestions", error);
    }
};

// Function to display movie suggestions
const showSuggestions = (movies) => {
    suggestionsList.innerHTML = ""; // Clear previous suggestions
    
    movies.slice(0, 20).forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = movie.Title;
        listItem.addEventListener('click', () => {
            inputBox.value = movie.Title;
            suggestionsList.innerHTML = ""; // Hide suggestions
            getMovieinfo(movie.Title); // Fetch movie details
        });
        suggestionsList.appendChild(listItem);
    });
};

// Function to fetch movie details
const getMovieinfo = async (movieName) => {
    try {
        const url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(movieName)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Unable to fetch movie data");
        }
        
        const data = await response.json();
        showMovieData(data);
    } catch (error) {
        showErrorMessage("No Movie Found!!");
    }
};

// Function to show movie details
const showMovieData = (data) => {
    movieContainer.innerHTML = "";
    movieContainer.classList.remove('noBackground');

    const { Title, imdbRating, Genre, Released, Runtime, Actors, Plot, Poster } = data;

    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-info');
    movieElement.innerHTML = `<h2>${Title}</h2>
                              <p><strong>Rating: &#11088;</strong> ${imdbRating}</p>`;

    const movieGenreElement = document.createElement('div');
    movieGenreElement.classList.add('movie-genre');

    Genre.split(",").forEach(element => {
        const p = document.createElement('p');
        p.innerText = element;
        movieGenreElement.appendChild(p);
    });

    movieElement.appendChild(movieGenreElement);
    movieElement.innerHTML += `<p><strong>Released Date: </strong>${Released}</p>
                              <p><strong>Duration: </strong>${Runtime}</p>
                              <p><strong>Cast: </strong>${Actors}</p>
                              <p><strong>Plot: </strong>${Plot}</p>`;

    const moviePosterElement = document.createElement('div');
    moviePosterElement.classList.add('movie-poster');
    moviePosterElement.innerHTML = `<img src="${Poster}"/>`;

    movieContainer.appendChild(moviePosterElement);
    movieContainer.appendChild(movieElement);
};

// Function to display error message
const showErrorMessage = (message) => {
    movieContainer.innerHTML = `<h2>${message}</h2>`;
    movieContainer.classList.add('noBackground');
};

// Function to handle form submission
const handleFormSubmission = (e) => {
    e.preventDefault();
    const movieName = inputBox.value.trim();
    
    if (movieName !== '') {
        showErrorMessage("Fetching Movie Details...");
        getMovieinfo(movieName);
    } else {
        showErrorMessage("Firstly!!! Please Enter movie name in Search Box.");
    }
};

// Event listeners
searchForm.addEventListener('submit', handleFormSubmission);
inputBox.addEventListener('input', () => getMovieSuggestions(inputBox.value));
