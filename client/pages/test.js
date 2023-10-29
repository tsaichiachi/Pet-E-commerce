import React from "react";
import { motion } from "framer-motion";
import CatLoading from "@/components/cat-loading";
import CatRun from "@/components/cat-run";
import "animate.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};
const allHelpers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const Test = () => {
  return (
    <>
      <CatRun />
    </>
  );
};

export default Test;
