
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full text-center p-4 text-orange-400 text-sm bg-gray-950 backdrop-blur-md ">
      <p>
        Created by: 
        <a 
          href="https://www.instagram.com/cyvix4102/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-bold from-red-400 to-orange-400 hover:text-orange-cyber transition duration-200 mx-1"
        >
          @cyvix4102
        </a> 
        <span className="text-orange-400">|</span> 
        <a 
          href="https://www.instagram.com/calx4102" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-bold text-red-neon hover:text-orange-cyber transition duration-200 ml-1"
        >
          @calx4102
        </a>
      </p>
    </footer>
  );
}