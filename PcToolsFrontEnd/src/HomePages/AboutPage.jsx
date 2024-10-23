import React from 'react';

const AboutPage = () => {
  return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center">About Us</h1>
        <p className="mt-6 text-center max-w-4xl mx-auto">
          We are PCTools, a leading provider of high-quality PC tools and accessories dedicated to delivering the best for tech enthusiasts and professionals alike. Founded in 2010, our mission has always been to empower our customers by providing top-notch products that enhance productivity and creativity.
        </p>

        <div className="flex flex-col md:flex-row justify-between gap-8 mt-12">
          <div className="md:w-1/3">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="mt-4">
              Our mission is to democratize technology by making high-performance tools accessible to every tech enthusiast and professional.
            </p>
          </div>
          <div className="md:w-1/3">
            <h2 className="text-2xl font-semibold">Our Values</h2>
            <p className="mt-4">
              At PCTools, integrity, innovation, and customer satisfaction form the cornerstone of our business.
            </p>
          </div>
          <div className="md:w-1/3">
            <h2 className="text-2xl font-semibold">Looking Ahead</h2>
            <p className="mt-4">
              As we look to the future, PCTools is excited about the emerging technologies that will redefine what's possible in the PC tool industry.
            </p>
          </div>
        </div>
      </div>
  );
};

export default AboutPage;
