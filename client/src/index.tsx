import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { WeddingApp } from './WeddingApp';


const main: HTMLElement|null = document.getElementById('main');
if (main === null)
  throw new Error("Uh oh! HTML is missing 'main' element");

const root: Root = createRoot(main);
root.render(<WeddingApp/>);
