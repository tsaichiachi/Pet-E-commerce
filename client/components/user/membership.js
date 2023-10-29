import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
//import Typography from '@mui/material/Typography';
import Modal from "@mui/material/Modal";
import Image from "next/image";
import memberCat1 from "@/assets/membership-01.png";
import memberCat2 from '@/assets/membership-02.png';
import memberCat3 from '@/assets/membership-03.png';
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  backgroundColor: "#fbf5ef",
//   bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const theme = createTheme({
    // 自定義色調
    palette: {
      primary: {
        main: "#512f10",
         // 主色调
      },
    },

  });

export default function Membership() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <ThemeProvider theme={theme}>
      <Button  onClick={handleOpen}>查看會員等級優惠</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className="membership-header my-4 d-flex justify-content-center">
          <div className="size-4 mb-1"> 小貓兩三隻 - 會員養成計劃</div>
          </div>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
        <div className="d-flex justify-content-center">
          <div className="membership-box mb-3">
            <div>
              <div className="member-avatar">
                <Image src={memberCat1} alt="memberCat1" className="member-avatar-img"  />
              </div>
              <div className="membership-body my-3">
                <div className="membership-title">
                  <div className="membership-title-level">幼貓 Lv.1</div>
                </div>
                <div className="membership-content my-2">
                  <div className="membership-content1">累積消費滿 <span className="discount">NT$5000</span></div>
                  <div className="membership-content2">享有會員折扣 <span className="discount"> 5%</span></div>
                </div>
              </div>
            </div>

            <div>
            <div className="member-avatar">
                <Image src={memberCat2} alt="memberCat2" className="member-avatar-img"   />
              </div>
              <div className="membership-body my-3">
                <div className="membership-title my-2">
                  <div className="membership-title-level">成貓 Lv.2</div>
                </div>
                <div className="membership-content">
                  <div className="membership-content1">累積消費滿 <span className="discount">NT$10000</span></div>
                  <div className="membership-content2">享有會員折扣 
                  
                 <span className="discount"> 10%</span></div>
                </div>
              </div>
            </div>

            <div>
            <div className="member-avatar">
                <Image src={memberCat3} alt="memberCat3" className="member-avatar-img"  />
              </div>
              <div>
              <div className="membership-body my-3">
                <div className="membership-title my-2">
                  <div className="membership-title-level">
                  老貓 Lv.3
                  </div>
                </div>
                <div className="membership-content">
                  <div className="membership-content1">累積消費滿 <span className="discount">NT$20000</span></div>
                  <div className="membership-content2">享有會員折扣 
                  <span className="discount"> 15%</span>
                  
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
          </div>
        </Box>
      </Modal>
      </ThemeProvider>
  );
}
