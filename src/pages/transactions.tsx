/* eslint-disable react/display-name */
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  makeStyles,
  LinearProgress,
} from "@material-ui/core";
import {
  DataGrid,
  GridColDef,
  GridOverlay,
  GridRowId,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import FilterListIcon from "@material-ui/icons/FilterList";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import yp from "../utils/sdk";

interface User {
  firstName: string;
  lastName: string;
}

interface Transaction {
  id: number;
  date: string;
  user: User;
  commerce: string | null;
  budget: string | null;
  credit: string;
  debit: string;
  balance: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: "1rem",
    paddingbottom: "1rem",
  },
  dataGrid: {
    backgroundColor: theme.palette.background.paper,
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterButton: {
    margin: "0.5rem 0.75rem 0.5rem 0.5rem",
  },
}));

const CustomLoadingOverlay: FC = () => {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
};

const CustomToolbar: FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const { selectionModel } = useContext(SelectionContext);

  function handleClick() {
    const url = new URL(window.location.href);
    url.searchParams.append("id", Math.floor(Math.random() * 5).toString());
    router.replace(url.href);
  }

  function handleDeleteFilter(filter: string): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(filter);
    router.replace(url.href);
  }

  return (
    <GridToolbarContainer className={classes.toolbar}>
      <Box display="flex" alignItems="center">
        <IconButton
          size="small"
          className={classes.filterButton}
          onClick={handleClick}
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
        <Box display="flex" alignItems="center">
          {Object.entries(router.query).map(([filter, value]) => {
            return (
              <Chip
                key={filter}
                size="small"
                label={
                  <span>
                    <strong>{filter}:</strong>{" "}
                    {typeof value === "string" ? value : value.join(", ")}
                  </span>
                }
                style={{ marginRight: 6 }}
                onDelete={() => handleDeleteFilter(filter)}
              />
            );
          })}
        </Box>
      </Box>
      <Box>
        <GridToolbarExport />
        <IconButton
          disabled={selectionModel.length === 0}
          onClick={() =>
            alert(
              `Los IDs seleccionados son: ${JSON.stringify(selectionModel)}`
            )
          }
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
    </GridToolbarContainer>
  );
};

const columns: GridColDef[] = [
  {
    field: "date",
    headerName: "Fecha",
    flex: 0.5,
    valueFormatter: ({ value: date }) => {
      const dateObj = new Date(date as string);
      const formattedDate = new Intl.DateTimeFormat("es-MX").format(dateObj);
      return formattedDate;
    },
  },
  {
    field: "user",
    headerName: "Usuario",
    flex: 1,
    valueFormatter: ({ value: user }) => {
      return `${(user as User).firstName} ${(user as User).lastName}`;
    },
    renderCell: ({ value: user }) => {
      return (
        <>
          <Avatar style={{ width: 25, height: 25, fontSize: 12 }}>
            {(user as User).firstName.charAt(0)}
            {(user as User).lastName.charAt(0)}
          </Avatar>
          <span style={{ marginLeft: "0.5rem" }}>
            {(user as User).firstName} {(user as User).lastName}
          </span>
        </>
      );
    },
  },
  {
    field: "commerce",
    headerName: "Comercio",
    flex: 1,
    renderCell: ({ value: commerce }) => {
      if (commerce) return commerce;

      return <span style={{ color: "#888" }}>No disponible</span>;
    },
  },
  {
    field: "budget",
    headerName: "Presupuesto",
    flex: 1,
    renderCell: ({ value: budget }) => {
      if (budget) return budget;

      return (
        <Button
          disableElevation
          color="secondary"
          variant="contained"
          size="small"
        >
          Sin asignar
        </Button>
      );
    },
  },
  {
    field: "debit",
    headerName: "Cargo",
    flex: 0.5,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) return "";

      const formattedValue = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(parseFloat(value as string));
      return formattedValue;
    },
  },
  {
    field: "credit",
    headerName: "Abono",
    flex: 0.5,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) return "";

      const formattedValue = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(parseFloat(value as string));
      return formattedValue;
    },
  },
  {
    field: "balance",
    headerName: "Saldo",
    flex: 0.5,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) return "";

      const formattedValue = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(parseFloat(value as string));
      return formattedValue;
    },
  },
];

interface ISelectionContextValues {
  selectionModel: GridRowId[];
  setSelectionModel: Dispatch<SetStateAction<GridRowId[]>>;
}

const SelectionContext = createContext({} as ISelectionContextValues);

const TransactionsPage: NextPage = () => {
  const router = useRouter();
  const classes = useStyles();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(1);
  const [page, setPage] = useState(0);

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  useEffect(() => {
    const preferedPageSize = localStorage.getItem("pageSize");
    if (!preferedPageSize) return;
    setPageSize(parseInt(preferedPageSize));
  }, []);

  useEffect(() => {
    async function getTotalCount() {
      setIsLoading(true);
      const response = await yp.get<Transaction[]>(
        "/transactions",
        router.query
      );
      setTotalResults(response.data.length);
      setIsLoading(false);
    }

    getTotalCount();
  }, [router.query]);

  useEffect(() => {
    async function getTransactions() {
      setIsLoading(true);

      const response = await yp.get<Transaction[]>("/transactions", {
        _limit: pageSize,
        _page: page + 1,
        ...router.query,
      });

      setTransactions(response.data);
      setIsLoading(false);
    }

    getTransactions();
  }, [router, pageSize, page]);

  return (
    <Container className={classes.container}>
      <h1>Transactions</h1>
      <SelectionContext.Provider value={{ selectionModel, setSelectionModel }}>
        <DataGrid
          className={classes.dataGrid}
          autoHeight
          page={page}
          rowCount={totalResults}
          rows={transactions}
          columns={columns}
          loading={isLoading}
          pageSize={pageSize}
          rowsPerPageOptions={[1, 2, 4]}
          onPageSizeChange={({ pageSize }) => {
            localStorage.setItem("pageSize", pageSize.toString());
            setPageSize(pageSize);
          }}
          onPageChange={({ page }) => setPage(page)}
          localeText={{
            noRowsLabel: "Sin datos",
            toolbarExport: "Exportar",
            toolbarExportCSV: "Descargar CSV",
          }}
          paginationMode="server"
          checkboxSelection
          selectionModel={selectionModel}
          onSelectionModelChange={(newSelection) => {
            setSelectionModel(newSelection.selectionModel);
          }}
          components={{
            Toolbar: CustomToolbar,
            LoadingOverlay: CustomLoadingOverlay,
          }}
        />
      </SelectionContext.Provider>
    </Container>
  );
};

export default TransactionsPage;
