/* global require chrome window document process */

import { storage } from 'chrome-extension-helper';

import '../styles/styles.less';

const packageDetails = require('../../package.json');

// Intialize chrome storage
storage.initializeStorage();

// Reference for listContainerDom, shared across background and foreground
let listContainerDom;

// Function to create a context-menu item to provide an option to add selected text to stash
const createContextMenuItems = () => {
    chrome.contextMenus.removeAll(
        () => {
            chrome.contextMenus.create(
                {
                    type: 'normal',
                    id: '1',
                    title: 'Add to stash',
                    contexts: ['selection'],
                    onclick: addSelectionToStash
                }
            );
        }
    );
};

// Event handler to add selected text to stash
const addSelectionToStash = event => {
    const { selectionText } = event;

    stash.get(s => {
        stash.set(s.concat([selectionText]));
    });
};

// Function to load stash contents on UI
const loadStashContentsOnInterface = entries => {
    if (listContainerDom) {
        if (entries.length) {
            listContainerDom.innerHTML = entries
                .map(e => `<div>${e}</div>`)
                .join('');
        } else {
            displayEmptyStashMessage();
        }
    }
};

// Event handler to clear stash
const clearStash = () => {
    stash.set([]);
};

// Function to display an "empty stash" message
const displayEmptyStashMessage = () => {
    document.querySelector('#list-container').innerText = 'Your stash is empty!';
};

// The entry-point to the pop-up
const start = () => {
    // Get reference to DOM elements
    const titleDom = document.querySelector('#title #title-text');
    listContainerDom = document.querySelector('#list-container');

    // Set the title
    titleDom.innerText = `Chrome Text Stash (${packageDetails.version})${process.env.NODE_ENV !== 'development' ? ' [DEBUG]' : ''}`;

    // Load stash contents on UI
    stash.read();

    // Bind event to 'Clear' button
    document.querySelector('#clear').onclick = clearStash;
};

// Generate the pop-up UI
window.addEventListener('load', start);

// Generate context menu items
createContextMenuItems();

// Create text-stash property to hold the stash
const stash = storage.createSyncedProperty(
    'text-stash',
    [[]],
    loadStashContentsOnInterface
);
