import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { AdminRoomModalProps } from "../../types/interfaces";

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
  setRoomForm,
  setSelectedFiles,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { mx: 2 } } }}
      slots={{ transition: Transition }}
    >
      <DialogTitle>Create Room</DialogTitle>

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
          onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
        />

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
          onClick={onSave}
          sx={{
            backgroundColor: "#472d30",
            color: "#fff",
            "&:hover": { backgroundColor: "#E26D5C" },
            px: 5,
          }}
        >
          Create Room
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminRoomModal;
