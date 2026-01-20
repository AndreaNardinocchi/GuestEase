import { Box } from "@mui/material";
import { useState, useEffect } from "react";

/**
 * We created this component to work our way around the mobile view of the
 * searchRoomsForm which was taking up to much space.
 * This component collapses its children (StickyHeaderComp, and SearchRoomForm) into a
 * toggleable panel on mobile (width < 768px), but shows them normally on desktop.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky
 * https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
 * https://dev.to/saiful7778/detecting-mobile-devices-in-react-with-a-custom-hook-4gil
 */
const ResponsiveBookingWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /**
   * Track whether the viewport is mobile-sized.
   * window.innerWidth is safe here because this component is client-side only.
   * https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
   */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Controls whether the mobile dropdown is open
  const [open, setOpen] = useState(false);

  /**
   * Listen for window resize events and update isMobile.
   * Cleanup removes the listener when the component unmounts.
   * https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
   * https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
   * https://dev.to/saiful7778/detecting-mobile-devices-in-react-with-a-custom-hook-4gil
   */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // On desktop, simply render children without the mobile wrapper.
  if (!isMobile) return <>{children}</>;

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 80,
          width: "100%",
          zIndex: 1200,
          boxShadow: "0px 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Mobile header bar that toggles the dropdown */}
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
            background: "#e26d5c",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.15)", // stronger bottom shadow
          }}
        >
          <span>Search your room</span>
          <span>{open ? "▲" : "▼"}</span>
        </div>

        {/* Dropdown content (only visible when open) */}
        {open && (
          <div
            style={{
              borderTop: "1px solid #472d30",
              paddingTop: "0.2rem",
            }}
          >
            {/* Children are the StickyHeaderComp and the SearchRoomsForm  */}
            {children}
          </div>
        )}
      </Box>
    </>
  );
};

export default ResponsiveBookingWrapper;
