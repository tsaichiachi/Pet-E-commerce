import React, { useState, useRef, useEffect } from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { easeInOut, motion, useAnimationControls } from "framer-motion";

const Filter = ({
  items,
  src,
  onClick,
  order,
  filterType,
  controller,
  handleHelperAnimate,
}) => {
  const dropDownRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    document.body.style.marginRight = "17px";
    // console.log(event);
  };
  const handleClose = () => {
    setAnchorEl(null);
    document.body.style.marginRight = "0px";
  };
  // const handleOption = (e) => {
  //   console.log(e.target.getAttribute("value"));
  // };
  return (
    <div className="drop-down-filter" ref={dropDownRef}>
      <motion.button
        className={`drop-down-filter-btn ${anchorEl ? "drop-down-active" : ""}`}
        onClick={handleClick}
      >
        <div
          className={`drop-down-filter-btn-icon ${
            anchorEl ? "drop-down-active" : ""
          }`}
        >
          <img src={src} />
        </div>
        {items.title || "選項"}
        <BiSolidDownArrow className={`icon icon-down `} />
      </motion.button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className="drop-down-filter-menu"
      >
        {items?.children?.map((item) => {
          if (
            (order &&
              order.value === item.value &&
              order.parentValue === items.value) ||
            (items.value === "type" && item.value === filterType)
          ) {
            return (
              <MenuItem
                disabled={true}
                onClick={() => {
                  handleClose();
                  if (onClick) {
                    onClick(item.value, items.value);
                  }
                }}
              >
                <motion.span value={item.value}>{item.label}</motion.span>
              </MenuItem>
            );
          }
          return (
            <MenuItem
              onClick={() => {
                handleClose();
                if (onClick) {
                  onClick(item.value, items.value);
                }
              }}
            >
              <motion.span value={item.value}>{item.label}</motion.span>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
export default Filter;

// 下拉式選單可傳入變數(props)：
// items={{
//   title: "選單名稱",
//   value: "自訂",
//   children: [
//     { label: "自訂", value: "自訂" },
//     { label: "自訂", value: "自訂" },
//   ],
// }}

// src={"/job-calendar.svg"} =>選單icon

// onClick => 這是用來控制選單點選後觸發事件的fn ex.onClick={handleOption} 有兩個參數1. value 2.parent value

//使用範例：
{
  /* <Filter
items={{
  title: "服務費用",
  value: "price",
  children: [
    { label: "由高到低", value: "DESC" },
    { label: "由低到高", value: "ASC" },
  ],
}}
src={"/job-icon/Heart-price.svg"}
/> */
}
