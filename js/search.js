document.addEventListener("DOMContentLoaded", function() {
    // Function to update search results based on the query parameter
    function updateSearchResults(query, cseId, apiKey) {
        // Check if "search-results-container" exists on the current page
        const searchResultsContainer = document.getElementById("search-results-container");
        const searchInput = document.getElementById("search-input");
        const searchFilters = document.getElementById("search-filters");
        
        const allButton = document.getElementById("all-button");
        const imagesButton = document.getElementById("images-button");

        if (searchResultsContainer) {
            // Display the search query

            const searchQueryElement = document.createElement("h2");
            searchQueryElement.textContent = `Search results for: ${query}`;
            searchResultsContainer.appendChild(searchQueryElement);

            searchInput.value = query || ''; // Use an empty string if query is null

            section = urlParams.get("section");

            // Use the Google Custom Search JSON API to fetch and display the search results
            
            const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${query}`;
            const apiUrlSearchImage = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${query}&searchType=${section}`;

            if(section == "all") {
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        // Handle and display the search results
                        //console.log("Search results:", data);

                        if (data.items && data.items.length > 0) {
                            // Assuming you have a container element with the id "search-results-container"
                            const searchResultsContainer = document.getElementById("search-results-container");
                            searchFilters.classList.remove('hidden');

                            // Iterate through the search results and display them
                            data.items.forEach(item => {
                                allButton.classList.add('active-section');
                                // Create elements to display the title, link, and snippet of each search result
                                const resultTitle = document.createElement("h3");
                                resultTitle.textContent = item.title;

                                const resultLink = document.createElement("a");
                                resultLink.href = item.link;
                                resultLink.textContent = item.link;
                                resultLink.target = "_blank"; // Open link in a new tab

                                const resultSnippet = document.createElement("p");
                                resultSnippet.textContent = item.snippet;

                                // Create a container for each search result
                                const resultContainer = document.createElement("div");
                                resultContainer.classList.add("search-result"); // You can style this class with CSS

                                // Append the elements to the result container
                                resultContainer.appendChild(resultTitle);
                                resultContainer.appendChild(resultLink);
                                resultContainer.appendChild(resultSnippet);

                                // Append the result container to the search results container
                                searchResultsContainer.appendChild(resultContainer);
                            });
                        } else {
                            // If there are no search results, display a message
                            const noResultsMessage = document.createElement("p");
                            noResultsMessage.textContent = "No search results found.\nIf you believe this is an error, check that you haven't reached your queries/day rate limit for your API key.";
                            searchResultsContainer.appendChild(noResultsMessage);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } else if(section == "image"){
                fetch(apiUrlSearchImage)
                .then(response => response.json())
                .then(data => {
                    // Handle and display the image search results
                    // Assuming you have a container element with the id "image-results-container"
                    const imageResultsContainer = document.getElementById("image-results-container");
                    
                    if (data.items && data.items.length > 0) {
                        searchFilters.classList.remove('hidden');
                        imagesButton.classList.add('active-section');
                        searchResultsContainer.style.width = '96%';
                        // Iterate through the image search results and display them
                        data.items.forEach(item => {
                            // Create an image element for the small preview
                            const imagePreview = document.createElement("img");
                            imagePreview.src = item.link; // Assuming the link is the URL of the image
                            imagePreview.alt = item.title; // Set alt text for accessibility

                            // Create an outer container for each image result
                            const imageResult = document.createElement("div");
                            imageResult.classList.add("image-result"); // You can style this class with CSS

                            // Create the .image-inner div
                            const imageInner = document.createElement("div");
                            imageInner.classList.add("image-inner");

                            // Append the image preview to the .image-inner div
                            imageInner.appendChild(imagePreview);

                            // Add a click event listener to open a larger version of the image
                            imagePreview.addEventListener("click", function () {
                                window.open(item.link, "_blank"); // Open the image link in a new tab
                            });

                            // Append the .image-inner to the outer .image-result container
                            imageResult.appendChild(imageInner);

                            // Append the result container to the image results container
                            imageResultsContainer.appendChild(imageResult);
                        });
                        fixImages();
                    } else {
                        // If there are no image search results, display a message
                        const noImageResultsMessage = document.createElement("p");
                        noImageResultsMessage.textContent = "No image search results found.";
                        imageResultsContainer.appendChild(noImageResultsMessage);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }    
        }
    }

    // Get the search query from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    let section = urlParams.get("section");

    if(!section) {
        section = "all";
        if(query) {
            history.replaceState({}, document.title, `/search/?query=${encodeURIComponent(query)}&section=${encodeURIComponent(section)}`);
        }
    }


    // If a query parameter exists, update the search results
    if (query) {
        updateSearchResults(query, getCookie("cseID"), getCookie("apiKey"));
    }
});

document.addEventListener("DOMContentLoaded", function() {
    
    // Get references to the search input and search button
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    const urlParams = new URLSearchParams(window.location.search);

    // Add a click event listener to the search button
    searchButton.addEventListener("click", function() {
        performSearch();
    });

    searchInput.addEventListener("keydown", function(event) {
      if(event.key == "Enter" || event.keyCode === 13) {
        performSearch();
      }
    })

    function performSearch() {
      const query = searchInput.value;
      let section = urlParams.get("section");

      if(!section) {
        section = "all";
      }

      if(query) {
        window.location.href = `/search/?query=${encodeURIComponent(query)}&section=${encodeURIComponent(section)}`;
      } else {
        console.log("no query specified.")
      }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);

    const allButton = document.getElementById("all-button");
    const imagesButton = document.getElementById("images-button");
    const videosButton = document.getElementById("videos-button");

    let section = urlParams.get("section");
    const query = urlParams.get("query");

    allButton.addEventListener("click", function() {
        section = "all";
        updateSearchSection();
    })

    imagesButton.addEventListener("click", function() {
        section = "image";
        updateSearchSection();
    })

    videosButton.addEventListener("click", function() {
        section = "video";
        updateSearchSection();
    })

    function updateSearchSection() {
        history.replaceState({}, document.title, `/search/?query=${encodeURIComponent(query)}&section=${encodeURIComponent(section)}`);
        window.location.href = `/search/?query=${encodeURIComponent(query)}&section=${encodeURIComponent(section)}`;
    }
});

window.addEventListener('load', function () {
    fixImages();
});

function fixImages() {
    const imageResults = document.querySelectorAll('.image-result');

    imageResults.forEach((imageResult) => {
        const img = imageResult.querySelector('img');

        // Check if the image has loaded
        if (img.complete) {
            setHeight(imageResult, img);
        } else {
            img.onload = function () {
                setHeight(imageResult, img);
            };
        }
    });
}

function setHeight(imageResult, img) {
    const imgHeight = img.clientHeight;

    // Set the height of the .image-result div to match the image height
    imageResult.style.height = imgHeight + 'px';
}
