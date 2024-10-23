import React from 'react';
import sectionimg from '../assets/imgs/SectionImg.png';

const HomePage = () => {
  return (
      <section className="flex flex-col md:flex-row items-center justify-center p-10 mt-3 lg:mt-14">
        <div className="flex-1 flex justify-center">
          <img
            src={sectionimg}
            alt="SectionImg"
            className="w-full h-auto max-w-lg"
          />
        </div>
        <div className="flex-1 mt-10 md:mt-0 md:ml-10">
          <h1 className="text-5xl font-bold mb-9"><span className='block mb-4'>Premium</span><span className='block mb-4'>PC Tools</span> Marketplace</h1>
          <p className="mt-5">
            Discover the ultimate selection of professional-grade PC tools tailored for demanding tasks and complex projects. Whether you're a developer or a graphic designer, our products meet the highest standards.
          </p>
          <a href="/products" className="mt-8 inline-block bg-teal-500 px-6 py-3 text-lg rounded-lg">Start Shopping</a>
        </div>
      </section>
  );
};

export default HomePage;
