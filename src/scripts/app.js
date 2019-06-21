/* global require chrome window document process */

import '../styles/styles.less';

const packageDetails = require('../../package.json');

const clearStash = () => {

};

const start = () => {
    document.querySelector('#title-text').innerText = `Chrome Text Stash (${packageDetails.version})${process.env.NODE_ENV !== 'development' ? ' [DEBUG]' : ''}`;

    document.querySelector('#clear').onclick = clearStash;
};

window.addEventListener('load', start);
