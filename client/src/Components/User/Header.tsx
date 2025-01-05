import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Logo from "../../assets/logo.svg";
import { axiosInstance } from "../../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../../redux/Slice/userSlice";
import toast from "react-hot-toast";
import { RootState } from "../../redux/store";
import { useEffect } from "react";

export const ConnectSphereLogo = () => {
  return (
    <div className="navbar-logo h-5 w-20">
      <img src={Logo} alt="Logo" />
    </div>
  );
};
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // const checkUserBlocked = async () => {
    //   if (currentUser) {
    //     try {
    //       const response = await axiosInstance.post("/auth/check-status", {
    //         email: currentUser.email,
    //       });

    //       if (response.status === 200) {
    //         console.log("User is active");
    //       }
    //     } catch (err: any) {
    //       if (err.response?.status === 403) {
    //         toast.error("Your account has been blocked. Logging out...");
    //         dispatch(signOut());
    //         navigate("/login", { replace: true });
    //       } else {
    //         toast.error(err.response?.data?.message || "Failed to verify status");
    //       }
    //     }
    //   }
    // };

    // checkUserBlocked();
    if (
      (currentUser && location.pathname === "/login") ||
      location.pathname === "/signup" ||
      location.pathname === "/forgot" ||
      location.pathname === "/otp" ||
      location.pathname === "/reset"
    ) {
      navigate("/", { replace: true });
    }
  }, [currentUser, location.pathname, navigate, dispatch]);

  const handleLogout = async () => {
    const email = currentUser?.email;
    //console.log("current userId :",userId);
    try {
      await axiosInstance.post("/auth/logout", { email });
      dispatch(signOut());
      navigate("/login", { replace: true });
      toast.success("Logout successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout Failed");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <Navbar className="bg-green-100">
      <NavbarBrand>
        <ConnectSphereLogo />
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="secondary" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Explore
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Task Management
          </Link>
        </NavbarItem>
      </NavbarContent>

      {currentUser ? (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={currentUser.profilePic}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                onPress={handleProfileClick}
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{currentUser.name}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (<Button color="secondary" onPress={()=>navigate('/login')}> Login</Button>)}
    </Navbar>
  );
};

export default Header;
