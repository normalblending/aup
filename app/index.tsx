import React from 'react';
import ReactDom from 'react-dom';
import './styles.css';
import {Root} from "./Root";

window.addEventListener("keydown", function(e: KeyboardEvent) {
    const isInput = e.target instanceof Element ? (e.target.tagName === 'INPUT') : false;
    if(["ArrowLeft","ArrowRight"].indexOf(e.code) > -1 && !isInput) {
        e.preventDefault();
    }
}, false);

ReactDom.render(<Root/>, document.getElementById('main'));