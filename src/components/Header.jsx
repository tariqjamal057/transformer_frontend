import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/kalpana.jpg";
import Button from "@mui/material/Button";
import {
  MdMenuOpen,
  MdOutlineLightMode /*MdOutlineMailOutline*/,
} from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { /*IoCartOutline*/ IoMenu, IoSettingsSharp } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { Divider } from "@mui/material";
import { MyContext } from "../App";
import UserAvatarImg from "./UserAvatarImg";
import { Assessment } from "@mui/icons-material";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpennotificationDrop, setIsOpennotificationDrop] = useState(false);

  const myAcc = Boolean(anchorEl);
  const openNotifications = Boolean(isOpennotificationDrop);

  const context = useContext(MyContext);
  const {
    isToggleSidebar,
    setIsToggleSidebar,
    windowWidth,
    openNav,
    setAlertBox,
  } = context;

  const navigate = useNavigate();

  const selectedCompany = JSON.parse(localStorage.getItem("selectedCompany"));
  const companyLogo = selectedCompany?.logo 
    ? `${import.meta.env.VITE_IMAGE_BASE_URL}${selectedCompany.logo.replace(/\\/g, "/")}` 
    : logo;

  const auth = localStorage.getItem("Transformer user");

  const logout = () => {
    localStorage.clear();
    setAlertBox({
      msg: "Logout Successfully!",
      open: true,
      error: false,
    });
    navigate("/login");
  };

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

  const handleOpennotificationsDrop = () => {
    setIsOpennotificationDrop(true);
  };

  const handleClosenotificationsDrop = () => {
    setIsOpennotificationDrop(false);
  };

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            <div className="col-sm-2 part1">
              <Link to={"/"} className="d-flex align-items-center logo">
                {<img src={companyLogo} alt="logo" style={{ width: "auto", height: "50px"}} />}
                {/*<span className="ms-2">RIVIE</span>*/}
              </Link>
            </div>

            {windowWidth > 992 && (
              <div className="col-sm-3 d-flex align-items-center part2 res-hide">
                <Button
                  className="rounded-circle me-3"
                  onClick={() => setIsToggleSidebar(!isToggleSidebar)}
                >
                  {isToggleSidebar === false ? (
                    <MdMenuOpen />
                  ) : (
                    <MdOutlineMenu />
                  )}
                </Button>
                {/*<SearchBox />*/}
              </div>
            )}

            <div className="col-sm-7 d-flex align-items-center justify-content-start part3 ms-auto">
              {/* Back to company/discom selection */}
              {localStorage.getItem("selectedSupplyTenderId") && (
                <button
                  className="btn p-2 me-3"
                  style={{
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderRadius: "30px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    whiteSpace: "nowrap", // Prevent text wrapping
                  }}
                  onClick={() => {
                    localStorage.removeItem("selectedSupplyTenderId");
                    navigate("/companies");
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Assessment />
                  Change Company/Discom
                </button>
              )}

              {/* 🌟 MIS Reports Button */}
              <button
                className="btn p-2 "
                style={{
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: "30px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={() => navigate("/mis-reports")}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <Assessment />
                MIS Reports
              </button>

              {windowWidth <992 && <Button className="rounded-circle me-3 ms-3 hide" onClick={()=>openNav()}><IoMenu/></Button> }

              {!auth ? (
                <Link to={"/login"}>
                  <Button className="btn-blue btn-lg btn-round ms-auto">Sign In</Button>
                </Link>
              ) : (
                <div className="myAccWrapper ms-auto">
                  <Button
                    className="myAcc d-flex align-items-center"
                    onClick={handleOpenMyAccDrop}
                  >
                    <div className="userImg">
                      <span className="rounded-circle">
                        {JSON.parse(auth)?.name.charAt(0)}
                      </span>
                    </div>

                    <div className="userInfo res-hide">
                      <h4>{JSON.parse(auth)?.name}</h4>
                      <p
                        className="mb-0"
                        style={{ textTransform: "lowercase" }}
                      >
                        {JSON.parse(auth)?.loginId}
                      </p>
                    </div>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={myAcc}
                    onClose={handleOpenMyAccDrop}
                    onClick={handleCloseMyAccDrop}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={logout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
