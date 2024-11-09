import React from 'react';
import { useRequestTracker } from '../../../HeplersFunctions/RequestTrackerContext';

const ScrollUpButton = () => {
  const { requestCount } = useRequestTracker();

  return (
    <div>
      <a
        id="scroll-up"
        className="scroll-up fixed right-12 bottom-[-50%] z-10 w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.7)] backdrop-blur-lg flex items-center justify-center overflow-hidden transition-all duration-400 hover:translate-y-[-0.25rem] sm:right-4"
        href="#"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="rgba(255,255,255,1)" d="M11.9997 10.8284L7.04996 15.7782L5.63574 14.364L11.9997 8L18.3637 14.364L16.9495 15.7782L11.9997 10.8284Z"></path>
        </svg>
        {requestCount}
      </a>
    </div>
  );
};

export default ScrollUpButton;
