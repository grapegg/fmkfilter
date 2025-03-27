// Get DOM elements
const filterWordsTextarea = document.getElementById('filterWords');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

// Load saved filter words when popup opens
document.addEventListener('DOMContentLoaded', () => {
  // Get filter words from storage
  chrome.storage.sync.get(['filterWords'], (result) => {
    if (result.filterWords && result.filterWords.length > 0) {
      // Display saved filter words in textarea, one per line for better readability
      filterWordsTextarea.value = result.filterWords.join('\n');
    } else {
      const defaultFilterWords = [
        // Add your default filter words here
        '필터링할단어1:게시판이름1',
        '필터링할단어2:게시판이름2',
        '필터링할단어3',
        '필터링할단어4',
      ];
      // Use local default filter words
      filterWordsTextarea.value = defaultFilterWords.join('\n');
    }
  });
});


// Get toggle element
const showFilteredToggle = document.getElementById('showFiltered');

// Load saved toggle state
chrome.storage.sync.get('showFiltered', (result) => {
  showFilteredToggle.checked = result.showFiltered || false;
});

// Save toggle state when changed
showFilteredToggle.addEventListener('change', () => {
  const showFiltered = showFilteredToggle.checked;
  chrome.storage.sync.set({ showFiltered });

  // Send message to content script to update without reloading
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'updateFilterVisibility',
      showFiltered
    });
  });
});


// Save filter words when save button is clicked
saveButton.addEventListener('click', () => {
  // Get filter words from textarea, splitting by line breaks
  const filterWords = filterWordsTextarea.value
    .split('\n')
    // .map(word => word.trim())
    // .filter(word => word.length > 0);

  // Save filter words to storage
  chrome.storage.sync.set({ filterWords }, () => {
    // Show status message
    statusDiv.innerText = '저장중...'
    statusDiv.style.display = 'block';

    // Hide status message after 2 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 500);
  });
});
