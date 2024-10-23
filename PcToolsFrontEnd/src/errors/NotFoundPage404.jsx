import React from 'react';
import { useNavigate } from 'react-router-dom';
import errorImage from '../assets/imgs/Errors/404-illustration.svg';

const NotFoundPage404 = () => {
  const navigate = useNavigate();

  return (
    <div className="md:flex min-h-screen">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center">
        <div className="max-w-sm m-8">
          <div className="text-black text-5xl md:text-[9rem] font-black">404</div>
          <div className="w-16 h-1 bg-purple-light my-3 md:my-6"></div>
          <p className="text-black text-2xl md:text-3xl font-light mb-8 leading-normal">
            Sorry, the page you are looking for could not be found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-black bg-transparent text-grey-darkest font-bold uppercase tracking-wide py-3 px-6 border-2 border-grey-light hover:border-grey rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
      <div className="relative pb-full md:flex md:pb-0 md:min-h-screen w-full md:w-1/2">
        <div
          style={{ backgroundImage: `url(${errorImage})` }}
          className="absolute inset-0 bg-cover bg-no-repeat md:bg-left lg:bg-center"
        ></div>
      </div>
    </div>
  );
};

export default NotFoundPage404;
