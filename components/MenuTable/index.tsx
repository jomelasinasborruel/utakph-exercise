"use client";

import { DB } from "@/app/firebase";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import dayjs from "dayjs";
import { onValue, ref, update } from "firebase/database";
import * as React from "react";
import AddItemModal from "../Modal/AddItem";
import { headCells } from "./headCells";
import EditItemModal from "../Modal/EditItem";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  viewBin: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    viewBin,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={viewBin ? undefined : onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
            style={{
              color: "white",
              ...(viewBin
                ? {
                    cursor: "not-allowed",
                  }
                : { cursor: "pointer" }),
            }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          if (
            headCell.id === "id" ||
            headCell.id === (viewBin ? "dateCreated" : "deletedAt")
          )
            return;
          return (
            <TableCell
              key={headCell.id}
              align={headCell.alignRight ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                style={{
                  color: "#ffffff",
                  whiteSpace: "pre",
                }}
                sx={{
                  color: "#ffffff",
                  fill: "white",
                  ["& .MuiTableSortLabel-icon"]: { fill: "white" },
                }}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  selected: readonly string[];
  menuData: Data[];
  viewBin: boolean;
  setViewDeleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleDeleteItem = (menuData: Data[]) => {
  menuData.map((datum) => {
    update(ref(DB, "menu/" + datum.id), {
      ...datum,
      deletedAt: dayjs().toISOString(),
    })
      .then(() => console.log("success"))
      .catch((error) => {
        console.log(error);
      });
  });
};

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { selected, menuData, viewBin, setViewDeleted } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        textAlign: "right",
      }}
    >
      {selected.length > 0 && (
        <Tooltip title="Delete an item">
          <Button
            onClick={() =>
              handleDeleteItem(
                menuData.filter((item) => selected.includes(item.id))
              )
            }
            variant="outlined"
          >
            DELETE
          </Button>
        </Tooltip>
      )}
      {selected.length === 0 && (
        <Tooltip title={viewBin ? "Hide deleted records first" : "Add an item"}>
          <React.Fragment>
            <AddItemModal viewBin={viewBin} />
          </React.Fragment>
        </Tooltip>
      )}
      {selected.length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%", color: "white" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
      ) : null}

      {selected.length === 0 && (
        <Button
          onClick={() => setViewDeleted((prev) => !prev)}
          variant="outlined"
          sx={{ whiteSpace: "pre" }}
        >
          {viewBin ? "HIDE DELETED" : "SHOW DELETED"}
        </Button>
      )}
    </Toolbar>
  );
}
const EnhancedTable = () => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("dateCreated");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [toggleEditModal, setToggleEditModal] = React.useState(false);
  const [selectedItemID, setSelectedItemID] = React.useState<Data | null>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [menuData, setMenuData] = React.useState<Data[]>([]);
  const [viewBin, setViewBin] = React.useState<boolean>(false);

  React.useEffect(() => {
    const menuRef = ref(DB, "menu/");
    const unsubscribe = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMenuData([]);
        return;
      }

      const formattedData: Data[] = Object.keys(data).map((key) => {
        return {
          id: key,
          name: data[key].name,
          category: data[key].category,
          options: data[key].options,
          price: data[key].price,
          cost: data[key].cost,
          numberOfStocks: data[key].numberOfStocks,
          dateCreated: data[key].dateCreated,
          deletedAt: data[key].deletedAt,
        };
      });

      setMenuData(formattedData);
    });

    return unsubscribe;
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = menuData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty menuData.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - menuData.length) : 0;

  const visibleRows = React.useMemo(() => {
    const filteredData = menuData.filter((item) => {
      if (!viewBin) return item.deletedAt === 0;
      return item.deletedAt !== 0;
    });
    return stableSort(filteredData, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, menuData, viewBin]);

  const renderCell = (col: keyof Data, row: Data) => {
    let cell: React.JSX.Element;
    switch (col) {
      case "options": {
        if (!row.options) {
          cell = <React.Fragment>N/A</React.Fragment>;
          break;
        } else {
          const options: string[] = JSON.parse(row.options);

          cell = (
            <React.Fragment key={row.id}>
              {!options.length && <React.Fragment>N/A</React.Fragment>}
              <ul>
                {options &&
                  options.map((item, index) => <li key={index}>- {item}</li>)}
              </ul>
            </React.Fragment>
          );
        }

        break;
      }

      default: {
        cell = (
          <React.Fragment key={row.id}>
            {row[col as keyof typeof row]}
          </React.Fragment>
        );
        break;
      }
    }
    return cell;
  };

  return (
    <React.Fragment>
      {toggleEditModal && selectedItemID && (
        <EditItemModal
          toggleModal={toggleEditModal}
          item={selectedItemID}
          setTooggleModal={setToggleEditModal}
        />
      )}

      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            width: "100%",
            mb: 2,
            background: "none",
            boxShadow: "none",
          }}
        >
          <EnhancedTableToolbar
            menuData={menuData}
            selected={selected}
            viewBin={viewBin}
            setViewDeleted={setViewBin}
          />
          <TableContainer>
            <Table
              sx={{
                minWidth: 750,
                [`& .${tableCellClasses.root}`]: {
                  borderBottomColor: "#ffffff",
                },
              }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                viewBin={viewBin}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={menuData.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={() => {
                        setToggleEditModal(true);
                        setSelectedItemID(
                          menuData.find((item) => item.id === row.id) ?? null
                        );
                      }}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      role="button"
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => {
                            event.stopPropagation();
                            viewBin ? null : handleClick(event, row.id);
                          }}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                          style={{
                            color: "white",
                            ...(viewBin
                              ? {
                                  cursor: "not-allowed",
                                }
                              : { cursor: "pointer" }),
                          }}
                        />
                      </TableCell>

                      {Object.keys(row).map((col, index) => {
                        const key = col as keyof Data;
                        if (key === "id" || key === "deletedAt") return;

                        return (
                          <TableCell
                            key={index}
                            sx={{
                              color: "#ffffff",
                              textAlign: [
                                "name",
                                "category",
                                "options",
                              ].includes(key)
                                ? "left"
                                : "right",
                            }}
                            align="right"
                          >
                            {renderCell(key, row)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={
              menuData.filter((item) =>
                viewBin ? item.deletedAt !== 0 : item.deletedAt === 0
              ).length
            }
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ color: "white", "& .MuiSvgIcon-root": { fill: "#ffffff" } }}
          />
        </Paper>
      </Box>
    </React.Fragment>
  );
};

export default EnhancedTable;
