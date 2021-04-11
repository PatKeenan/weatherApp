import Head from "next/head";
import { useState, useRef } from "react";
import styles from "../styles/Home.module.css";
import { animate, motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import Card from "../components/Card";

import { BsArrowCounterclockwise } from "react-icons/bs";

export default function Home() {
  const constraintsRef = useRef(null);
  /* This is the state of the mountain range at the bottom of the page as well as the moon */
  const [mountain, setMountain] = useState(false);
  const [scaleMoon, setScaleMoon] = useState(0.3);

  //search state
  const [searchQ, setSearchQ] = useState("");
  const [weather, setWeather] = useState({});
  const [err, setError] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  const variants = {
    open: { scale: 0.5, top: 30, right: 90 },
    closed: { scale: 1, top: 90 },
  };
  const formVariant = {
    open: { opacity: 0 },
    closed: { opacity: 1 },
  };

  /* `${api.base}weather?q=${searchQ}&appid=${api.key}`; */

  //Function when the form is clicked
  // Api call to weather openweather
  const api_secret = process.env.API;

  const api = {
    key: api_secret,
    base: "https://api.openweathermap.org/data/2.5/",
  };

  const handleMountains = async (e) => {
    e.preventDefault();
    if (searchQ === "") {
      setError(true);
      setErrorCode("Please Enter A City");
    } else {
      try {
        const data = await fetch(
          `${api.base}weather?q=${searchQ}&units=imperial&appid=${api.key}`
        )
          .then((res) => {
            return res.json();
          })
          .then((result) => {
            if (result.message == "city not found") {
              setErrorCode("City Not Found");
              setError(true);
            } else {
              setError(false);
              setWeather({
                temp: Math.round(result.main.temp),
                city: result.name,
                desc: result.weather[0].description,
              });
              setMountain(true);
              console.log(result);
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
    // call the api and wait for a response
  };

  const handleRefresh = () => {
    setSearchQ("");
    setWeather({});
    setError(false);
    setMountain(false);
  };

  return (
    <motion.div className={styles.container}>
      <Head>
        <title>Local Weather</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.div className={styles.moonHolder} ref={constraintsRef}>
        <motion.img
          src="/Moon.png"
          className={styles.moon}
          animate={mountain ? "open" : "closed"}
          variants={variants}
          transition={{ ease: "easeInOut", duration: 1 }}
          drag={true}
          dragMomentum={true}
          dragConstraints={{ top: 0, left: 5, right: 5, bottom: 5 }}
        />
      </motion.div>
      <p
        className="absolute left-3 top-3 text-gray-700 opacity-50 font-bold text-sm bg-gray-50 px-2 py-2 rounded"
        id="local"
      >
        Local Weather
      </p>

      {/* bottom mountains png which moves when mountains is set to true */}
      <motion.img
        animate={{ y: `${mountain ? "-160%" : 0}` }}
        transition={{ ease: "easeInOut", duration: 1 }}
        initial={{ y: `${mountain ? "60%" : 0}` }}
        src="/Mountains.png"
        className={styles.mountains}
      />

      <main className="searchBar">
        <motion.div
          animate={mountain ? "open" : "closed"}
          variants={formVariant}
          transition={{ ease: "easeInOut", duration: 1 }}
          initial={false}
        >
          {/* <h1 className="text-3xl text-gray-100 font-bold text-center">
            Search By City
          </h1> */}
          <form className=" pt-3 flex justify-evenly flex-col relative w-full">
            <div className="flex flex-row">
              <input
                type="text"
                className=" bg-gray-50 text-gray-500 shadow-lg rounded-r-none rounded-lg w-9/12 h-12 px-2 outline-none"
                placeholder="Search By City"
                value={searchQ}
                onChange={(e) => {
                  setSearchQ(e.target.value);
                }}
              />

              <button
                onClick={(e) => {
                  handleMountains(e);
                }}
                className="px-4 py-2  bg-green-400 rounded-l-none rounded-lg shadow-lg text-gray-100  outline-none focus:outline-none"
              >
                Search
              </button>
            </div>
            {err && (
              <div className="w-full text-red-500 text-sm pt-2 pl-1 absolute  -bottom-7 left-0">
                <p>{errorCode}</p>
              </div>
            )}
          </form>
        </motion.div>

        <motion.div
          className={styles.baseMountain}
          animate={{
            height: `${mountain ? "70%" : 0}`,
          }}
          transition={{ ease: "easeInOut", duration: 1 }}
          initial={false}
        >
          {mountain && (
            <motion.div
              animate={{ opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 1, delay: 0.5 }}
              initial={{ opacity: 0 }}
            >
              <motion.div
                className={`${styles.card} rounded-md relative`}
                animate={{ scaleX: 1 }}
                transition={{ ease: "easeInOut", duration: 0.5, delay: 0.5 }}
                initial={{ scaleX: 0 }}
              >
                {weather && (
                  <div className="h-auto w-full">
                    <Card
                      city={weather.city}
                      temp={weather.temp}
                      desc={weather.desc}
                    />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    handleRefresh();
                  }}
                  className="absolute shadow-lg -top-3 -right-3 hover:cursor-pointer text-white bg-indigo-400 px-2 rounded-full focus:outline-none hover:bg-indigo-500 active:scale-95 transform transition ease-in-out duration-150 cursor-pointer"
                  id={styles.refresh}
                  title="Refresh"
                >
                  <BsArrowCounterclockwise className="h-8" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}
