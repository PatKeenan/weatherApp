import React from "react";
import { IconName } from "react-icons/bs";

const Card = ({ temp, city, desc }) => {
  return (
    <div className="flex flex-col h-full w-full justify-between space-y-4">
      <h3 className="font-bold text-gray-700 pt-3 text-3xl text-center">
        {city}
      </h3>
      <p
        className={`${
          temp > 100 ? "text-red-500" : "text-indigo-500"
        } font-bold text-8xl justify-center -mt-10 flex w-full `}
      >
        {temp}
        <span className="text-2xl pt-3">°</span>
      </p>
      <p className="capitalize text-center text-gray-600 font-bold">{desc}</p>
      <p className="rounded-lg text-center p-4 bg-gray-600 shadow-md text-white">
        View Forecast
      </p>
    </div>
  );
};

export default Card;
