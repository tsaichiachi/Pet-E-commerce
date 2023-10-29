import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Image from "next/image";
import Link from "next/link";
import { useActivePage } from "@/hooks/useActivePage";
import { useAuth } from "@/context/fakeAuthContext";

//logo-icon
import catLogo from "@/assets/catLogo.svg";
import McatLogo from "@/assets/McatLogo.svg";
//shoppingCart
import ShoppingCart from "@/assets/shoppingCart.svg";

//cart
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/router";

const theme = createTheme({
  // 自定義色調
  palette: {
    primary: {
      main: "#f8cb9f", // 主色调
    },
    secondary: {
      main: "#ffd362", // 次要色调
    },
    tertiary: {
      main: "#512f10",
    },
  },
  typography: {
    fontFamily: "Noto Sans TC",
    fontWeight: 700,
    color: "#f8cb9f",
    // 在这里定义其他文本样式
  },
  // 添加其他自訂樣式
  components: {
    MuiContainer: {
      root: {
        maxWidth: "1440px",
      },
      maxWidthMd: {
        maxWidth: 320,
      },
      maxWidthLg: {
        maxWidth: "1440px!important",
      },
    },
  },
});
// 購物車商品數量樣式
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    // border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const pages = [
  { path: "http://localhost:3000/#", name: "品牌介紹", id: 1 },
  { path: "http://localhost:3000/product", name: "全部商品", id: 2 },
  { path: "http://localhost:3000/work/find-mission", name: "小貓上工", id: 3 },
  { path: "http://localhost:3000/article", name: "小貓兩三知", id: 4 },
  { path: "http://localhost:3000/#", name: "常見問題", id: 5 },
];

function ResponsiveAppBar() {
  //會員狀態
  const { Token, isAuthenticated, login, logout } = useAuth();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  // const handleOpenUserMenu = (event) => {
  //   if (anchorElUser !== event.currentTarget) {
  //     setAnchorElUser(event.currentTarget);
  //   }
  // };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    document.body.style.paddingRight = "0px";
    setAnchorElUser(null);
  };

  const { setActiveButton } = useActivePage();
  const { cart, setCart } = useCart();
  const goCart = () => {
    router.push("/product/cart");
  };

  const router = useRouter();
  //登入登出
  const handleLogout = () => {
    logout();
    localStorage.removeItem("helperFav"); //移除小幫手收藏
    localStorage.removeItem("data");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setActiveButton();

    localStorage.clear();
    setCart([]);
    router.push("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Container maxWidth={false} sx={{ maxWidth: "1440px" }}>
          <Toolbar disableGutters>
            {/* mobile裝置*/}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon fontSize="large" sx={{ color: "#512f10" }} />
                {/* ^^^^BURGER */}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((v) => (
                  <Link href={v.path} key={v.id}>
                    <MenuItem
                      sx={{
                        width: "330px",
                        background: "#f8cb9f",
                        fontSize: "16px",
                        fontWeight: "700",
                        my: 2,
                      }}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">{v.name}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
              {/* mobile-logo*/}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <Link href={"/"}>
                  <Image src={McatLogo} alt="logo" />
                </Link>
              </Box>
            </Box>

            {/* Desktop 裝置*/}
            {/* logo */}
            <Box sx={{ flexShrink: 0, display: { xs: "none", md: "flex" } }}>
              <Link href={"/"}>
                <Image src={catLogo} alt="logo" />
              </Link>
            </Box>
            {/* nav-item */}
            <Box sx={{ width: "100%", display: { xs: "none", md: "flex" } }}>
              {pages.map((v) => (
                <Link href={v.path} key={v.id}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 3.5,
                      mx: 1.5,
                      color: "#512f10",
                      display: "block",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {v.name}
                  </Button>
                </Link>
              ))}
            </Box>
            {/* 會員＆購物車icon */}
            <Box sx={{ flexShrink: 0 }}>
              <Tooltip title="Open settings">
                {/* userMenu */}
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircleIcon
                    color="tertiary"
                    style={{ fontSize: 40 }}
                    sx={{ display: { xs: "flex", md: "flex" }, mr: 2 }}
                  />
                </IconButton>
                <IconButton onClick={goCart} sx={{ p: 0 }} className="cartNum">
                  <Image src={ShoppingCart} alt="shoppingCart" />
                  {Token && cart.length !== 0 ? (
                    <div className="cartNumber size-7 ">
                      <p className="">{cart.length}</p>
                    </div>
                  ) : (
                    ""
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isAuthenticated ? (
                  <>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">登出</Typography>
                    </MenuItem>
                    <Link href="http://localhost:3000/member/profile">
                      <MenuItem
                        onClick={() => {
                          setActiveButton();
                        }}
                      >
                        <Typography textAlign="center">會員中心</Typography>
                      </MenuItem>
                    </Link>
                    <Link href="/chatlist">
                      <MenuItem>
                        <Typography textAlign="center">來聊聊</Typography>
                      </MenuItem>
                    </Link>
                  </>
                ) : (
                  <Link href="http://localhost:3000/member/login">
                    <MenuItem>
                      <Typography textAlign="center">登入</Typography>
                    </MenuItem>
                  </Link>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;
