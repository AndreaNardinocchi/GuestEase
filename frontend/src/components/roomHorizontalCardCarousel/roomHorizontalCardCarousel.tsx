import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface BookingCardImageCarouselProps {
  images: string[];
}

/**
 * RoomCardHorizontalCarousel is an horizontal image carousel built using 'React state + refs',
 * 'MUI Box + IconButton', and manual scroll-based slide navigation.
 * This approach is similar to the carousel logic we used in the MoviesApp assignment for
 * the FullStack2 module.
 * https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/pages/homePage.tsx
 * where we also relied on horizontal scrolling containers instead of external libraries.
 */

const RoomCardHorizontalCarousel: React.FC<BookingCardImageCarouselProps> = ({
  images,
}) => {
  /**
   * 'scrollRef' is a reference to the scrollable container.
   * We manually scroll this element left/right to simulate a carousel.
   * Similar pattern used in MoviesApp homePage.tsx where we used refs
   * to control horizontal scroll for movie lists.
   * 'useRef' is a hook that associates a DOM element with it, in this case a <div>
   * It is basically used to manipulate the DOM element, and, it is initially set to null
   * until the component mounts.
   * After the component mounts and React renders the DOM node with ref={scrollRef}:
   * https://atomizedobjects.com/blog/react/how-to-use-useref-in-react/
   * https://medium.com/@juvitasaini/useref-understand-with-scroll-example-75ad7139557b
   * https://tj.ie/scrollable-container-controls-with-react-hooks/?
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * 'currentIndex' tracks which slide is currently visible.
   * to show or hide arrows and move scroll position
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * 'goTo(direction)' moves the carousel left or right.
   * This mirrors the logic in our MoviesApp where we scroll by container width.
   * The parameter 'direction' is a string that indicates the direction of the scroll.
   */
  const goTo = (direction: "next" | "prev") => {
    let newIndex = currentIndex;

    // Move forward if not at last slide
    if (direction === "next" && currentIndex < images.length - 1) {
      newIndex = currentIndex + 1;
    }

    // Move backward if not at first slide
    if (direction === "prev" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    setCurrentIndex(newIndex);

    /**
     * The '.current' property holds a reference to the actual DOM element, once React assigns it.
     * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
     */
    if (scrollRef.current) {
      // We call 'scrollTo' on the DOM element 'current'
      scrollRef.current.scrollTo({
        // 'left' defines how far to scroll horizontally
        // as much as the 'clientWidth'
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
        left: scrollRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 200, md: 330 },
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: "2px, 2px, 0, 0",
      }}
    >
      {/* 
        Left Arrow only shown when NOT on the first slide.
      */}
      {currentIndex > 0 && (
        <IconButton
          onClick={() => goTo("prev")}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            // It shifts the element up by 50% of its own height
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "rgba(255,255,255,0.7)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
      )}

      {/**
       * Scrollable Image Container
       */}
      <Box
        ref={scrollRef}
        sx={{
          // A flex row where each image takes 100% width.
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {images.map((img, index) => (
          /**
           * React.Fragment is used here because we need a wrapper element for the mapped children
           * without adding an extra <div> to the DOM.
           *
           * Only this form supports the 'key' prop.
           * https://react.dev/reference/react/Fragment
           * https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
           * https://react.dev/learn/rendering-lists#why-does-react-need-keys
           */
          <React.Fragment key={index}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                flexShrink: 0, // Prevents shrinking so each slide stays full width
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </React.Fragment>
        ))}
      </Box>

      {/* 
        Right Arrow only shown when NOT on the last slide.
      */}
      {currentIndex < images.length - 1 && (
        <IconButton
          onClick={() => goTo("next")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "rgba(255,255,255,0.7)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default RoomCardHorizontalCarousel;
