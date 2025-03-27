/**
 * FM Korea Content Filter - Optimized for performance with large word lists
 * Filters content as it loads to prevent flickering
 */
(function() {
    const defaultFilterWords = [
      // Add your default filter words here
      '필터링할단어1:게시판이름1',
      '필터링할단어2:게시판이름2',
      '필터링할단어3',
      '필터링할단어4',
    ];

    // Initialize filter words array
    let filterWordsArray = [...defaultFilterWords];

    // Load filter words from Chrome storage
    chrome.storage.sync.get(['filterWords'], (result) => {
      if (result.filterWords && result.filterWords.length > 0) {
        // Use the array directly
        filterWordsArray = result.filterWords;
        // Rebuild the filter map with new words
        filterMap = buildFilterMap();
        // Re-process containers that are already on the page
        const containers = document.querySelectorAll(config.containerSelector);
        containers.forEach(container => processContainer(container));
      }
    });

    // Add storage listener to update filter words when they change
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync' && changes.filterWords) {
        // Use the array directly
        filterWordsArray = changes.filterWords.newValue;
        // Rebuild the filter map with new words
        filterMap = buildFilterMap();
        // Re-process containers that are already on the page
        const containers = document.querySelectorAll(config.containerSelector);
        containers.forEach(container => processContainer(container));
      }
    });


    function buildFilterMap() {
      const map = {};

      // Process each entry directly from the array
      filterWordsArray.forEach(entry => {
        //entry = entry.trim();
        if (!entry || !entry.trim()) return;

        // Check if this has a category specified
        const parts = entry.split(':');
        // const keyword = parts[0].trim().toLowerCase();
        const keyword = parts[0].toLowerCase();

        if (parts.length === 1) {
          // No category, applies to all
          map[keyword] = null; // null means "all categories"
        } else {
          // Has specific category
          const category = parts[1].trim().toLowerCase();

          // If this keyword already exists, update its categories
          if (map[keyword]) {
            const existing = map[keyword];
            if (existing === null) {
              // Already applies to all categories, no need to change
            } else {
              // Add this category
              existing.add(category);
            }
          } else {
            // New keyword with specific category
            map[keyword] = new Set([category]);
          }
        }
      });

      return map;
    }


    // Configuration
    const config = {
      containerSelector: ".fm_best_widget", // Only filter elements in this container
      listItemSelector: "li.li", // Target list items
    };

    // Build the filter map once at initialization for O(1) lookups
    let filterMap = buildFilterMap();

    // Immediately inject CSS to hide target elements during processing
    const style = document.createElement('style');
    style.textContent = `
      /* All items visible by default */
      ${config.containerSelector} ${config.listItemSelector} {
        visibility: visible !important;
      }
      /* Class for filtered content - hidden by default */
      ${config.containerSelector} ${config.listItemSelector}.content-filtered {
        display: none !important;
      }
      /* When showing filtered content */
      body.show-filtered ${config.containerSelector} ${config.listItemSelector}.content-filtered {
        display: block !important;
      }
    `;

    // style.textContent = `
    //   /* Only hide list items within our target container */
    //   ${config.containerSelector} ${config.listItemSelector} {
    //     visibility: hidden !important;
    //   }

    //   /* Class for elements that passed our filter */
    //   ${config.containerSelector} ${config.listItemSelector}.filter-passed {
    //     visibility: visible !important;
    //   }
    // `;
    document.documentElement.appendChild(style);

    // Process a single list item to check if it should be filtered
    function processListItem(element) {
      // Find relevant elements within this list item
      const titleElement = element.querySelector('.title');
      const categoryElement = element.querySelector('.category');

      if (!titleElement || !categoryElement) {
        // If we can't find our target elements, show this item
        element.classList.add('filter-passed');
        return;
      }

      // Get text content, handling any nested elements
      const titleText = titleElement.textContent || '';
      const categoryText = categoryElement.textContent || '';

      // Check if any filtered keyword is in the title
      //const lowerTitleText = titleText.toLowerCase();
      const normalizedTitleText = titleText.replace(/\t/g, ' ');
      const lowerTitleText = ' ' + normalizedTitleText.toLowerCase() + ' ';
      let shouldFilter = false;

      // Check each keyword in our filter map - O(n) where n is number of keywords, not words in content
      for (const keyword in filterMap) {
        //if (lowerTitleText.includes(keyword)) {
        if (lowerTitleText.indexOf(keyword) !== -1) {
          const categories = filterMap[keyword];
          // Found a keyword match, now check category
          if (categories === null) {
            // This keyword applies to all categories
            shouldFilter = true;
            break;
          } else {
            // Check if category matches - O(1) lookup in Set
            const lowerCategoryText = categoryText.toLowerCase();
            for (const category of categories) {
              if (lowerCategoryText.includes(category)) {
                shouldFilter = true;
                break;
              }
            }
            if (shouldFilter) break;
          }
        }
      }

      if (shouldFilter) {
        // Found a match - hide this element permanently
        // element.style.display = 'none';
        element.classList.add('content-filtered');
      } else {
        // No match - show this element
        element.classList.add('filter-passed');
      }
    }

    // Process all list items in a container
    function processContainer(container) {
      if (!container) return;

      // Process all list items in this container
      const listItems = container.querySelectorAll(config.listItemSelector);
      listItems.forEach(processListItem);
    }

    // Set up mutation observer to watch for changes in target containers
    function observeContainer(container) {
      if (!container) return;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
              // Process only Element nodes (nodeType 1)
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches(config.listItemSelector)) {
                  processListItem(node);
                }

                // Also check for list items within this node
                node.querySelectorAll(config.listItemSelector).forEach(processListItem);
              }
            });
          }
        });
      });

      // Start observing only this container for better performance
      observer.observe(container, {
        childList: true,
        subtree: true
      });
    }

    // Initialize the extension
    function initialize() {
      chrome.storage.sync.get('showFiltered', (result) => {
        if (result.showFiltered) {
          document.body.classList.add('show-filtered');
        }
      });
      // Find all target containers
      const containers = document.querySelectorAll(config.containerSelector);

      // Process and observe each container
      containers.forEach(container => {
        processContainer(container);
        observeContainer(container);
      });

      // Also set up an observer for new containers that might be added dynamically
      const bodyObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if this is a container
                if (node.matches(config.containerSelector)) {
                  processContainer(node);
                  observeContainer(node);
                }

                // Check for containers within this node
                node.querySelectorAll(config.containerSelector).forEach(container => {
                  processContainer(container);
                  observeContainer(container);
                });
              }
            });
          }
        });
      });

      // Observe the body for new containers
      bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateFilterVisibility') {
        if (message.showFiltered) {
          document.body.classList.add('show-filtered');
        } else {
          document.body.classList.remove('show-filtered');
        }
      }
    });


    // Run immediately for document_start
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
  })();
