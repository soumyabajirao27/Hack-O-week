document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const currentUrlP = document.getElementById('currentUrl');
    const loader = document.getElementById('loader');

    // Get the current tab's URL and display it
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
            const url = new URL(tabs[0].url);
            currentUrlP.textContent = url.hostname;
        } else {
            currentUrlP.textContent = 'Not on a valid webpage.';
            checkButton.disabled = true;
            checkButton.classList.add('opacity-50', 'cursor-not-allowed');
        }
    });

    checkButton.addEventListener('click', () => {
        resultDiv.classList.add('hidden');
        loader.classList.remove('hidden');
        checkButton.disabled = true;
        checkButton.classList.add('opacity-50');

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url;
            if (!url || !url.startsWith('http')) {
                displayResult({
                    title: 'Error',
                    message: 'Cannot analyze this page. Please try on a valid website.',
                    color: 'red'
                });
                return;
            }

            const hostname = new URL(url).hostname.replace('www.', '');

            // Simulate an API call delay to give feedback to the user
            setTimeout(() => {
                const analysis = analyzeUrl(hostname);
                displayResult(analysis);
            }, 1500);
        });
    });

    function displayResult(analysis) {
        loader.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        checkButton.disabled = false;
        checkButton.classList.remove('opacity-50');

        // Reset Tailwind classes to avoid conflicts
        resultDiv.className = 'mt-4 p-4 rounded-lg border-l-4';
        resultTitle.className = 'text-lg font-bold';

        // Add the correct classes based on the result
        resultDiv.classList.add(`bg-${analysis.color}-100`, `border-${analysis.color}-500`);
        resultTitle.classList.add(`text-${analysis.color}-800`);

        resultTitle.textContent = analysis.title;
        resultMessage.textContent = analysis.message;
    }

    /**
     * Analyzes a URL based on a predefined list of sources.
     * In a real-world scenario, this would be a call to a sophisticated AI/ML model.
     * @param {string} hostname - The hostname of the URL to analyze.
     * @returns {object} - An object containing the analysis result.
     */
    function analyzeUrl(hostname) {
       const reliableSources = [
    // Internationally trusted sources
    'reuters.com', 'apnews.com', 'bbc.com', 'pbs.org',
    'npr.org', 'wsj.com', 'nytimes.com', 'theguardian.com',
    'propublica.org', 'csmonitor.com', 'economist.com',
    'bloomberg.com', 'c-span.org', 'forbes.com', 'nbcnews.com',
    'cbsnews.com', 'abcnews.go.com', 'ft.com', 'latimes.com',
    'newsweek.com', 'time.com', 'axios.com', 'politico.com',
    'aljazeera.com', 'dw.com', 'sciencenews.org', 'statnews.com',
    'theconversation.com', 'factcheck.org', 'snopes.com',

    // 🇮🇳 Reliable Indian news websites
    'timesofindia.indiatimes.com',     // Widely read, broad coverage
    'ndtv.com',                         // Balanced reporting, English & Hindi
    'indianexpress.com',               // Investigative journalism, editorials
    'thehindu.com',                    // Analytical, ethical journalism
    'hindustantimes.com',              // National and regional coverage
    'indiatoday.in',                   // Political and investigative depth
    'business-standard.com',           // Financial and economic news
    'financialexpress.com',            // Business and policy analysis
    'scroll.in',                       // Independent, in-depth reporting
    'thewire.in',                      // Investigative and opinion journalism
    'newslaundry.com',                 // Media critique and independent reporting
    'theprint.in',                     // Policy, politics, and current affairs
    'livemint.com',                    // Business and tech news
    'firstpost.com',                   // News and opinion
    'deccanherald.com',                // Regional and national news
    'telegraphindia.com',              // Eastern India focus, national coverage
    'wionews.com',                     // Global Indian perspective
    'outlookindia.com',               // News, culture, and analysis
    'thebetterindia.com',             // Positive stories and social impact
    'indiatimes.com',
    'sitnagpur.edu.in'                  // Youth-oriented, trending news
];
       const unreliableSources = [
    'infowars.com', 'breitbart.com', 'naturalnews.com',
    'dailycaller.com', 'thegatewaypundit.com', 'wnd.com',
    'occupydemocrats.com', 'theblaze.com', 'dailywire.com',
    'postcard.news', 'opindia.com', 'swarajyamag.com',
    'greatgameindia.com', 'zeenews.india.com', 'republicworld.com',
     // Added per your request
];

        if (reliableSources.some(source => hostname.includes(source))) {
            return {
                title: 'Likely Reliable Source',
                message: `This domain (${hostname}) has a general reputation for factual reporting and journalistic integrity. Always remember to cross-reference information.`,
                color: 'green'
            };
        }

        if (unreliableSources.some(source => hostname.includes(source))) {
            return {
                title: 'Potentially Unreliable Source',
                message: `Caution advised. This domain (${hostname}) has been noted for publishing biased, misleading, or unverifiable information. Seek out other more reliable sources.`,
                color: 'red'
            };
        }

        return {
            title: 'Unknown Reliability',
            message: `The reliability of this domain (${hostname}) is not in our database. Please use your judgment and look for other indicators of credibility.`,
            color: 'yellow'
        };
    }
});

