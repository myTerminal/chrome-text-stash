import { notifications } from 'chrome-extension-helper';

// Create an error reporter
export const reportError = message => {
    notifications.showSimpleNotification(
        'error',
        {
            iconUrl: 'icons/icon128.png',
            title: 'Oops!',
            message
        }
    );
};

// Just for avoiding ESlint errors
export const nothing = null;
