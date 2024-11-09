import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../HeplersFunctions/CheckSCRFandAUTH';
import LoadingPage from '../../../HeplersFunctions/LoadingPage';
import GetUserLengthInfo from './GetUserLengthInfo';
import styled from "styled-components";

import ModalComponent from './ModalComponent';

const Dashboard = () => {
  const { user, authenticated, loading } = useContext(AuthContext);
  const [users, setUsers] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // For modal type

  useEffect(() => {
    if (user && authenticated) {
      setUsers(user);
    }
  }, [user, authenticated]);

  if (loading) return <LoadingPage />;

  if (!authenticated || !users) {
    return <div className="text-white">User not found or not authenticated</div>;
  }

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
      };

      const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
      };


  return (
    <div className="content w-full flex flex-col justify-center mt-10">
      <main className={isModalOpen ? 'blur-sm pointer-events-none' : ''}>
        <h2 className="text-2xl font-bold text-center mb-12">Welcome to Dashboard!</h2>
        <article className="container mx-auto p-5">
          <section className="flex flex-col md:flex-row justify-evenly">
            <div className="flex flex-col justify-around">
              {/* Profile Card */}
              <div className="relative bg-white rounded-lg shadow-md px-6 py-6 mb-5 flex justify-around items-center">
                <div className="flex items-center gap-4">
                  <figure className="w-20 h-20 rounded overflow-hidden">
                    <img
                      src="https://randompicturegenerator.com/img/people-generator/g1f3229025c3d5bfe285df1d4bad25c71ec473af8e98d80bb634561616ccd9788e5486c896768a6c1b04aeafa2fae4746_640.jpg"
                      alt="Angela Ronaldo"
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{users.fullname}</p>
                    <p className="text-gray-500">{users.account_type === "0" ? 'Buyer' : 'Seller'}</p>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-4">
                  <li>
                    <a href={`mailto:${users.email}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                      <span className="material-symbols-rounded icon text-2xl">email:</span>
                      <p className='text-xl'>{users.email}</p>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Info Edit Card */}
              <div className=" bg-white rounded-lg shadow-md p-6">
              <ul className="flex flex-wrap gap-4">
                  <li>
                      <p className='text-black'>{users.fullname}</p>
                  </li>
                </ul>

              <div className="flex items-center flex-wrap">
              <StyledWrapper className="p-5">
                <button className="learn-more" onClick={() => openModal("edit")}>
                    <span className="circle" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[2.5em] w-[2.5em] text-center pl-2 pt-2" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                        </svg>
                    </span>
                    <span className="button-text">Edit Info</span>
                </button>
                </StyledWrapper>

                <StyledWrapper className='p-5'>
                    <button className="learn-more bg-red-600">
                        <span className="circle" aria-hidden="true">
                        <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[2.5em] w-[2.5em] text-center pl-2 pt-2"
                        >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                        <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5"></circle>
                        <path
                            d="M9 17C9.85038 16.3697 10.8846 16 12 16C13.1154 16 14.1496 16.3697 15 17"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        ></path>
                        <ellipse cx="15" cy="10.5" rx="1" ry="1.5" fill="#fff"></ellipse>
                        <ellipse cx="9" cy="10.5" rx="1" ry="1.5" fill="#fff"></ellipse>
                        </g>
                        </svg>
                        </span>
                        <button className="button-text" onClick={() => openModal("delete")}>Delete Account</button>
                    </button>
                </StyledWrapper>

                <StyledWrapper className='p-5'>
                        <button className="learn-more" onClick={() => openModal("resetPassword")}>
                            <span className="circle" aria-hidden="true">
                            <svg
                                className="h-[2.5em] w-[2.5em] text-center pl-2 pt-2"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480h80q0 66 25 124.5t68.5 102q43.5 43.5 102 69T480-159q134 0 227-93t93-227q0-134-93-227t-227-93q-89 0-161.5 43.5T204-640h116v80H80v-240h80v80q55-73 138-116.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-80-240q-17 0-28.5-11.5T360-360v-120q0-17 11.5-28.5T400-520v-40q0-33 23.5-56.5T480-640q33 0 56.5 23.5T560-560v40q17 0 28.5 11.5T600-480v120q0 17-11.5 28.5T560-320H400Zm40-200h80v-40q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560v40Z"/>
                            </svg>
                            </span>
                            <span className="button-text">Reset Password</span>
                        </button>
                    </StyledWrapper>

                    </div>
              </div>
            </div>

            <GetUserLengthInfo />
          </section>
        </article>
      </main>
        {/* Modal Component */}
        <ModalComponent
            isOpen={isModalOpen}
            onClose={closeModal}
            modalType={modalType}
        />
    </div>
  );
};

const StyledWrapper = styled.div`
  button {
 position: relative;
 display: inline-block;
 cursor: pointer;
 outline: none;
 border: 0;
 vertical-align: middle;
 text-decoration: none;
 background: transparent;
 padding: 0;
 font-size: inherit;
 font-family: inherit;
}

button.learn-more {
 width: 12rem;
 height: auto;
}

button.learn-more .circle {
 transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
 position: relative;
 display: block;
 margin: 0;
 width: 3rem;
 height: 3rem;
 background: #282936;
 border-radius: 1.625rem;
}

button.learn-more .circle .icon {
 transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
 position: absolute;
 top: 0;
 bottom: 0;
 margin: auto;
 background: #fff;
}

button.learn-more .circle .icon.arrow {
 transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
 left: 0.625rem;
 width: 1.125rem;
 height: 0.125rem;
 background: none;
}

button.learn-more .circle .icon.arrow::before {
 position: absolute;
 content: "";
 top: -0.29rem;
 right: 0.0625rem;
 width: 0.625rem;
 height: 0.625rem;
 border-top: 0.125rem solid #fff;
 border-right: 0.125rem solid #fff;
 transform: rotate(45deg);
}

button.learn-more .button-text {
 transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 padding: 0.75rem 0;
 margin: 0 0 0 1.85rem;
 color: #282936;
 font-weight: 700;
 line-height: 1.6;
 text-align: center;
 text-transform: uppercase;
}

button:hover .circle {
 width: 100%;
}

button:hover .circle .icon.arrow {
 background: #fff;
 transform: translate(1rem, 0);
}

button:hover .button-text {
 color: #fff;
}
`;

export default Dashboard;
