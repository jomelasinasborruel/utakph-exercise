import { DB } from "@/app/firebase";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import cuid from "cuid";
import dayjs from "dayjs";
import { ref, set, update } from "firebase/database";
import * as React from "react";
import { headCells } from "../MenuTable/headCells";
import { Snackbar } from "@mui/material";
import { BiCheckCircle } from "react-icons/bi";

export default function EditItemModal({
  item: menuItem,
  toggleModal,
  setTooggleModal,
}: {
  item: Data;
  toggleModal: boolean;
  setTooggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [options, setOptions] = React.useState<string[]>([]);
  const [isSnackbarToggled, setIsSnackbarToggled] = React.useState(false);
  const handleClose = () => {
    setOptions([]);
    setTooggleModal(false);
  };

  const handleCloseSnackBar = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSnackbarToggled(false);
  };
  const items = headCells.map((item) => ({ label: item.label, key: item.id }));
  const handleAddOption = () => {
    const optionsInput = document.getElementById("options") as HTMLInputElement;
    if (
      !optionsInput ||
      options.includes(optionsInput.value.toLowerCase()) ||
      !optionsInput.value.trim()
    )
      return;
    setOptions([...options, optionsInput.value.trim().toLowerCase()]);
    optionsInput.value = "";
    optionsInput.focus();
  };

  const updateRecord = (data: Data) => {
    const datum = JSON.parse(JSON.stringify(data));
    delete datum.id;

    try {
      update(ref(DB, "items/" + menuItem.id), {
        ...datum,
        menuID: (menuItem as any).menuID,
        dateCreated: menuItem.dateCreated,
        deletedAt: 0,
      })
        .then(() => setIsSnackbarToggled(true))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  const handleDeleteOption = (val: string) =>
    setOptions(options.filter((item) => item !== val));

  React.useEffect(() => {
    try {
      setOptions(JSON.parse(menuItem.options));
    } catch (error) {
      //
    }
  }, [toggleModal]);

  return (
    <React.Fragment>
      <Snackbar
        ContentProps={{ sx: { bgcolor: "#198754" } }}
        color="error"
        open={isSnackbarToggled}
        autoHideDuration={3000}
        message={
          <span>
            <BiCheckCircle className="inline text-[1.5rem] mr-2" /> Item updated
          </span>
        }
        onClose={handleCloseSnackBar}
      />
      <Dialog
        open={toggleModal}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          sx: {
            maxWidth: "700px",
            width: "100vw",
            margin: 1,
          },

          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            formJson.options = JSON.stringify(options);
            formJson.id = cuid();
            formJson.dateCreated = dayjs().toISOString();

            updateRecord(formJson as Data);
            // handleClose();
          },
        }}
      >
        <DialogContent>
          <DialogContentText sx={{ marginBottom: 3 }}>
            Modify item details.
          </DialogContentText>
          {items.map((item, index) => {
            if (["id", "dateCreated", "deletedAt"].includes(item.key)) return;

            if (item.key === "options") {
              return (
                <div key={index} className="flex flex-col">
                  <div className="w-full flex">
                    <TextField
                      onKeyDown={(e) => {
                        if (e.code === "Enter") {
                          e.preventDefault();
                          document.getElementById("btn-add")?.click();
                        }
                      }}
                      autoComplete="off"
                      autoFocus
                      fullWidth
                      margin="normal"
                      id={item.key}
                      name={item.key}
                      label={item.label}
                      type={"text"}
                      variant="outlined"
                    />
                    <Button
                      id="btn-add"
                      onClick={handleAddOption}
                      sx={{ marginTop: 2, marginBottom: 1, marginLeft: 1 }}
                      variant="outlined"
                    >
                      ADD
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {options.map((item, index) => (
                      <div
                        key={index}
                        role="button"
                        onClick={() => handleDeleteOption(item)}
                        className="p-2 bg-[#0e381c] relative text-white rounded-md overflow-hidden"
                      >
                        <button className="absolute top-0 left-0 w-full h-full bg-[#9e2a2a]  text=center opacity-0 transition-all duration-300 hover:opacity-100">
                          x
                        </button>
                        {item.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <TextField
                key={index}
                autoFocus
                required
                fullWidth
                defaultValue={menuItem[item.key]}
                autoComplete="off"
                margin="normal"
                id={item.key}
                name={item.key}
                label={item.label}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    e.preventDefault();
                  }
                }}
                type={["price", "cost"].includes(item.key) ? "number" : "text"}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      display: "none",
                    },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
                variant="outlined"
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">EDIT</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
