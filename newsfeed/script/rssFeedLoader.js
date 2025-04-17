const newsSources = {
    "NY Times": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "Politico": "https://rss.politico.com/politics-news.xml",
    "CNN": 'http://rss.cnn.com/rss/edition.rss',
    "Africa": 'http://rss.cnn.com/rss/edition_africa.rss',
    "Middle East": 'http://rss.cnn.com/rss/edition_meast.rss',
    "Money": 'http://rss.cnn.com/rss/money_news_international.rss',
    "Technology": 'http://rss.cnn.com/rss/edition_technology.rss',
    "El Mundo": 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml',
    "España": 'https://e00-elmundo.uecdn.es/elmundo/rss/espana.xml',
    "UE": 'https://e00-elmundo.uecdn.es/elmundo/rss/union_europea.xml',
};
let allNewsItems = [];

const englishSources = [
    "NY Times",
    "Politico",
    "CNN",
    "Africa",
    "Europe",
    "Middle East",
    "Money",
    "Technology",    
];

const spanishSources = [
    "El Mundo",
    "España",
    "UE",
];


// Function to fetch and display RSS feed
/**
 * Fetches an RSS feed from a specified URL and displays it in a container element.
 *
 * @param {string} rssUrl - The URL of the RSS feed to fetch.
 * @param {string} containerId - The ID of the HTML element where the news items will be displayed.
 * @throws {Error} If there is an error fetching the RSS feed, it will be logged to the console.
 */
function fetchRSSFeed(rssUrl, containerId) {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl))
    .then(response => response.json())
    .then(data => {
        allNewsItems = data.items; // Store all news items
        displayNewsItems(allNewsItems, containerId);
    })
    .catch(error => console.error('Error fetching RSS feed:', error));
}

// Function to display news items
/**
 * Displays news items in a specified container.
 *
 * @param {Array} items - An array of news item objects to be displayed.
 * @param {string} containerId - The ID of the HTML element where the news feed will be rendered.
 */
function displayNewsItems(items, containerId) {
    const newsFeedContainer = document.getElementById(containerId);
    newsFeedContainer.innerHTML = ''; // Clear previous content

    items.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 mb-4';

        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        // Title
        const title = document.createElement('div');
        title.className = 'news-title';
        title.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
        newsItem.appendChild(title);

        // Description
        const description = document.createElement('div');
        description.className = 'news-description';
        description.innerHTML = item.description;
        newsItem.appendChild(description);

        // For the image
        if(item.enclosure && item.enclosure.link) {
        const image = document.createElement('img');
        image.src = item.enclosure.link;
        image.className = 'img-fluid';
        image.setAttribute('aria-label', 'News Image'); // Added aria-label
        newsItem.appendChild(image);
        }

        // Social Share Button
        const shareButton = document.createElement('button');
        shareButton.className = 'share-button';
        shareButton.innerHTML = '<i class="fa-brands fa-twitter"></i> Share';
        shareButton.setAttribute('aria-label', 'Share on Twitter'); // Added aria-label
        shareButton.onclick = () => shareNews(item.link);
        newsItem.appendChild(shareButton);

        col.appendChild(newsItem);
        newsFeedContainer.appendChild(col);
    });
}


// Function to share news
/**
 * Shares a news article on Twitter.
 *
 * @param {string} url - The URL of the news article to share.
 * @throws {TypeError} If `url` is not a string.
 */
function shareNews(url) {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
}

// Function to remove accents from a string
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Function to search news
/**
 * Searches for news items based on a user's input and updates the display accordingly.
 *
 * @function searchNews
 */
function searchNews() {
    const searchTerm = removeAccents(document.getElementById('searchInput').value.toLowerCase()); // Convert search term to lower case and remove accents
    const filteredNews = allNewsItems.filter(item => 
        removeAccents(item.title.toLowerCase()).includes(searchTerm) || // Convert title to lower case and remove accents
        removeAccents(item.description.toLowerCase()).includes(searchTerm) // Convert description to lower case and remove accents
    );
    displayNewsItems(filteredNews, 'newsContent');
}


/**
 * Generates tabs dynamically based on predefined news sources.
 *
 * This function creates tab buttons for each news source listed in the `newsSources` object.
 * Each tab button, when clicked, triggers an action to fetch and display the corresponding RSS feed.
 *
 * @function
 * @returns {void} - Does not return anything.
 */
function generateTabs() {
    const tabsContainer = document.querySelector('.news-tabs');
    Object.keys(newsSources).forEach(source => {
        let tabCol = document.createElement('div');
        tabCol.className = 'col-6 col-sm-6 col-md-4 col-lg-3 mb-2';

        let tab = document.createElement('button');
        tab.className = 'tab-button btn btn-block';
        if (source === "NY Times") {
            tab.classList.add('active'); // Add 'active' class if it's the "NY Times" tab
        }
        tab.textContent = source;
        tab.onclick = () => {
            // Remove 'active' class from all tabs
            document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));

            // Add 'active' class to the clicked tab
            tab.classList.add('active');

            // Fetch and display RSS feed for the clicked tab
            fetchRSSFeed(newsSources[source], 'newsContent');
        };

        tabCol.appendChild(tab);
        tabsContainer.appendChild(tabCol);
    });
}

// Function to filter news by language
/**
 * Filters tabs to display content based on the selected language.
 *
 * @param {string} language - The language code ('all', 'english', or 'spanish') to filter by.
 */
function filterLanguage(language) {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        if (language === 'all') {
            tab.style.display = 'block'; // Show all tabs
        } else {
            const source = tab.textContent;
            if ((language === 'english' && englishSources.includes(source)) || 
                (language === 'spanish' && spanishSources.includes(source))) {
                tab.style.display = 'block'; // Show relevant tabs for English or Spanish
            } else {
                tab.style.display = 'none'; // Hide other tabs
            }
        }
    });
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    generateTabs();
    fetchRSSFeed(newsSources["NY Times"], 'newsContent'); // Load default tab content

    document.getElementById('toggleMode').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    const languageButtons = document.querySelectorAll('.lang-button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log("Language button clicked:", this.textContent); // Debugging line
            languageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Use 'all' for the "Clear" button to reset and show all tabs
            const language = this.textContent.toLowerCase() === 'clear' ? 'all' : this.textContent.toLowerCase();
            filterLanguage(language);
        });
    });

    // Event listener for search button click
    document.getElementById('searchButton').addEventListener('click', searchNews);

    // Event listener for pressing Enter in the search input field
    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) { // 13 is the keycode for the Enter key
            searchNews();
        }
    });

    // Event listener for clearing search
    document.getElementById('clearSearch').addEventListener('click', () => {
        document.getElementById('searchInput').value = ''; // Clear the search input

        // Find the currently active tab
        const activeTab = document.querySelector('.tab-button.active');
        const activeSource = activeTab ? activeTab.textContent : "NY Times"; // Default to "NY Times" if no active tab found

        // Fetch RSS feed for the currently active tab
        fetchRSSFeed(newsSources[activeSource], 'newsContent');
    });
});
