import React from "react";
import { AppBar, Toolbar, Link as MuiLink } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

/**
 * AccountSubNav renders a sticky sub‑navigation bar for the user's account section.
 * It highlights the active link based on the current URL path.
 */

const AccountSubNav: React.FC = () => {
  /***
   * useLocation gives access to the current URL path.
   * This allows us to style the active link.
   * https://reactrouter.com/en/main/hooks/use-location
   */
  const location = useLocation();

  /***
   * Navigation links for the account section.
   * Each link has a label and a target path.
   */
  const links = [
    { label: "My Trips", path: "/account/mytrips" },
    { label: "Profile", path: "/account/profile" },
  ];

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{ top: 80, backgroundColor: "#f5f5f5", zIndex: 1200 }}
    >
      {/***
       * Toolbar centers the navigation links horizontally.
       * https://mui.com/material-ui/react-app-bar/#app-bar-with-a-primary-search-field
       */}
      <Toolbar sx={{ justifyContent: "center", gap: 4 }}>
        {links.map((link) => (
          <MuiLink
            key={link.path}
            component={Link}
            to={link.path}
            underline="none"
            /***
             * Highlight the active link by comparing the current path.
             * https://mui.com/material-ui/customization/color/
             */
            color={location.pathname === link.path ? "#472d30" : "textPrimary"}
            sx={{
              fontWeight: location.pathname === link.path ? "bold" : "normal",
            }}
          >
            {link.label}
          </MuiLink>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default AccountSubNav;
