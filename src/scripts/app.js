/* global require chrome window document process */

import { storage } from 'chrome-extension-helper';

import '../styles/styles.less';

const packageDetails = require('../../package.json');

// Intialize chrome storage
storage.initializeStorage();

// Reference for listContainerDom, shared across background and foreground
let listContainerDom;

// Function to update stash contents on UI
const updateStashContentsOnInterface = entries => {
    if (listContainerDom) {
        if (entries.length) {
            loadStashContentsOnInterface(entries);
        } else {
            displayEmptyStashMessage();
        }
    }
};

// Function to load stash contents on interface
const loadStashContentsOnInterface = entries => {
    // Empty the list DOM
    listContainerDom.innerHTML = '';

    // Add all items from collection
    entries.forEach(
        entry => {
            // Create an item DOM element
            const element = document.createElement('div');

            // Set properties for the item element
            element.className = 'stash-item';
            element.setAttribute('id', entry.id);

            // Create a DOM element for text
            const textContent = document.createElement('div');

            // Set properties for the text element
            textContent.className = 'stash-text';
            textContent.innerText = entry.text;

            // Create a DOM element for selection action
            const selectButton = document.createElement('span');

            // Set properties for the 'select' item
            selectButton.className = 'stash-select far fa-copy';
            selectButton.onclick = handleSelectOnStashItem;

            // Create a DOM element for deletion action
            const deleteButton = document.createElement('span');

            // Set properties for the 'delete' button
            deleteButton.className = 'stash-delete fas fa-times';
            deleteButton.onclick = handleDeleteOnStashItem;

            // Append elements to the item
            element.append(textContent);
            element.append(selectButton);
            element.append(deleteButton);

            // Append the item to the list
            listContainerDom.append(element);
        }
    );
};

// Event handler to select a stash item
const handleSelectOnStashItem = event => {
    const source = event.srcElement,
        itemDom = source.parentElement,
        itemId = itemDom.getAttribute('id');

    // Read items from the list
    stash.get(s => {
        // Find the selected item
        const selectedItem = s.filter(i => i.id.toString() === itemId)[0];

        // Extract text to work with
        if (selectedItem) {
            console.log(selectedItem.text);
        }
    });
};

// Event handler to delete a stash item
const handleDeleteOnStashItem = event => {
    const source = event.srcElement,
        itemDom = source.parentElement,
        itemId = itemDom.getAttribute('id');

    // Remove item from the stash
    stash.get(s => {
        stash.set(
            s.filter(i => i.id.toString() !== itemId)
        );
    });
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
    titleDom.innerText = `Chrome Text Stash (${packageDetails.version})${process.env.NODE_ENV === 'development' ? ' [DEBUG]' : ''}`;

    // Load stash contents on UI
    stash.read();

    // Bind event to 'Clear' button
    document.querySelector('#clear').onclick = clearStash;
};

// Generate the pop-up UI
window.addEventListener('load', start);

// Create text-stash property to hold the stash
const stash = storage.createSyncedProperty(
    'text-stash',
    [[]],
    updateStashContentsOnInterface
);
