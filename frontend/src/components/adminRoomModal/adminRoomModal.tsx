import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Slide,
  Box,
  Typography,
  Snackbar,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { AdminRoomModalProps } from "../../types/interfaces";
import { getPublicUrl } from "../../utils/supabaseAssetsStorage";

/**
 * This is a nice transition effect we were eager to try out,
 * and worked out well.
 * https://mui.com/material-ui/react-dialog/#transitions
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminRoomModal: React.FC<AdminRoomModalProps> = ({
  open,
  onClose,
  onSave,
  roomForm,
  editingRoom,
  setRoomForm,
  existingImages,
  setExistingImages,
  setSelectedFiles,
}) => {
  const handleRemoveExistingImage = (img: string) => {
    setExistingImages((prev: any[]) => prev.filter((i) => i !== img));
  };

  // These states are needed to show an error message for empty fields
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { mx: 2 } } }}
        slots={{ transition: Transition }}
      >
        <DialogTitle>{editingRoom ? "Update Room" : "Create Room"}</DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={roomForm.name}
            onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={roomForm.description}
            onChange={(e) =>
              setRoomForm({ ...roomForm, description: e.target.value })
            }
          />

          <TextField
            margin="dense"
            label="Amenities (comma-separated)"
            fullWidth
            value={roomForm.amenities}
            onChange={(e) =>
              setRoomForm({ ...roomForm, amenities: e.target.value })
            }
          />

          <TextField
            margin="dense"
            type="number"
            label="Capacity"
            fullWidth
            value={roomForm.capacity}
            onChange={(e) =>
              setRoomForm({ ...roomForm, capacity: e.target.value })
            }
          />

          <TextField
            margin="dense"
            type="number"
            label="Price (€)"
            fullWidth
            value={roomForm.price}
            onChange={(e) =>
              setRoomForm({ ...roomForm, price: e.target.value })
            }
          />

          {editingRoom && existingImages?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Existing Images</Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                {existingImages.map((img) => (
                  <Box
                    key={img}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #ccc",
                    }}
                  >
                    <img
                      src={
                        /**
                         * The uploaded image path is like 'rooms/a77ddc44-0a5e-4585-b4e7-5b61cb2865d3/1770573915402-DruidsRest2.jpg',
                         * as per 'const filePath = `rooms/${roomId}/${Date.now()}-${safeName}`;' in the adminRoomsPage.tsx file.
                         * Hence, we are saying below, that if 'img' does include 'rooms/' in its path, that mean it has been uploaded by
                         * the admin and will show the uploaded path. Otherwise, it will enable the old image path display, whose
                         * image was originally manually uploaded straight into supabase
                         */
                        img.includes("rooms/")
                          ? getPublicUrl(img) // New uploaded images path
                          : getPublicUrl(`rooms/${editingRoom.id}/${img}`) // old seeded images
                      }
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={() => handleRemoveExistingImage(img)}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        minWidth: 0,
                        padding: "2px 6px",
                        fontSize: "0.7rem",
                      }}
                    >
                      X
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Image Upload 
        https://stackoverflow.com/questions/43692479/how-to-upload-an-image-in-react-js#68979570
        */}
          <input
            type="file"
            multiple
            // This enables us to upload an array of images
            // https://www.codefrontend.com/file-upload-reactjs/
            // https://www.compilenrun.com/docs/framework/react/react-forms/react-file-uploads/
            onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              color: "#472d30",
              "&:hover": { color: "#E26D5C" },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              // Checking if the fields are filled in
              if (
                !roomForm.name ||
                !roomForm.description ||
                !roomForm.amenities ||
                !roomForm.capacity ||
                !roomForm.price
              ) {
                setSnackbarMessage("Please fill in all required fields.");
                setSnackbarOpen(true);
                return;
              }

              onSave();
            }}
            sx={{
              backgroundColor: "#472d30",
              color: "#fff",
              "&:hover": { backgroundColor: "#E26D5C" },
              px: 5,
            }}
          >
            {editingRoom ? "Update Room" : "Create Room"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for error message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default AdminRoomModal;
