/* global chrome */

import { storage } from 'chrome-extension-helper';
import { reportError } from './common';

// Intialize chrome storage
storage.initializeStorage(reportError);

// Function to create a context-menu item to provide an option to add selected text to stash
const createContextMenuItems = () => {
    chrome.contextMenus.removeAll(
        () => {
            chrome.contextMenus.create(
                {
                    type: 'normal',
                    id: '1',
                    title: 'Add to stash',
                    contexts: ['selection']
                }
            );
        }
    );
};

// Event handler to add selected text to stash
const addSelectionToStash = info => {
    const { selectionText } = info;

    stash.get(s => {
        stash.set(s.concat([{
            id: (new Date()).getTime(),
            text: selectionText
        }]));
    });
};

// Create text-stash property to hold the stash
const stash = storage.createSyncedProperty(
    'text-stash',
    [[]]
);

// Generate context menu items
createContextMenuItems();

// Add event listener for context menu clicks
chrome.contextMenus.onClicked.addListener(addSelectionToStash);
