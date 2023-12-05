import React, { useState } from 'react';

const DeliveryOptions = () => {
  const [selectedOption, setSelectedOption] = useState('standard');

  return (
    <div className="mt-2 lg:mt-4 p-6 flex flex-col h-62 border rounded-md lg:w-[30vw] bg-white">
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">1. Delivery Option</h2>
        <hr className="border-gray-300 my-4 mx-[-1.5rem]" />
        <div className="flex items-center">
          <input
            id="standardShipping"
            type="radio"
            name="delivery"
            value="standard"
            checked={selectedOption === 'standard'}
            onChange={() => setSelectedOption('standard')}
            className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          <label htmlFor="standardShipping" className="ml-2 block text-sm font-medium text-gray-700">
            Standard Shipping
          </label>
        </div>
        <div className="ml-6 pl-1 text-gray-600 text-sm">
          JABODETABEK: next day <br />
          Java: 1-5 working days <br />
          Outside Java: 1-10 working days
        </div>
        <div className="flex items-center mt-4">
          <input
            id="expressShipping"
            type="radio"
            name="delivery"
            value="express"
            checked={selectedOption === 'express'}
            onChange={() => setSelectedOption('express')}
            className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          <label htmlFor="expressShipping" className="ml-2 block text-sm font-medium text-gray-700">
            Express Shipping
          </label>
        </div>
        <div className="ml-6 pl-1 text-gray-600 text-sm">
          JABODETABEK: next day <br />
          Java: 1-3 working days <br />
          Outside Java: 1-7 working days
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button className="bg-gray-900 enabled:hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Payment Method
        </button>
        <button className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded">
          Register a New Address
        </button>
      </div>
    </div>
  );
};

export default DeliveryOptions;