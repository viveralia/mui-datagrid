/* eslint-disable react/display-name */
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton, LinearProgress } from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridOverlay,
} from "@material-ui/data-grid";
import { Dispatch, FC, SetStateAction } from "react";

interface User {
  id: string;
}

interface ITableProps {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
}

const CustomToolbar: FC = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const CustomLoadingOverlay: FC = () => {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
};

export const Table: FC<ITableProps> = ({
  users,
  setUsers,
  pageSize,
  setPageSize,
  isLoading,
}) => {
  function deleteUser(userId: string) {
    setUsers((users) => users.filter((u) => userId !== u.id));
  }

  return (
    <DataGrid
      rows={users}
      components={{
        Toolbar: CustomToolbar,
        LoadingOverlay: CustomLoadingOverlay,
      }}
      columns={[
        {
          field: "id",
          headerName: "ID",
          flex: 1,
          hideSortIcons: true,
          filterable: false,
          sortable: false,
        },
        {
          field: "name",
          headerName: "Nombre",
          flex: 1,
          hideSortIcons: true,
          filterable: false,
          sortable: false,
          editable: true,
        },
        {
          field: "email",
          headerName: "Correo electrónico",
          flex: 1,
          hideSortIcons: true,
          filterable: false,
          sortable: false,
        },
        {
          field: "website",
          headerName: "Sitio web",
          flex: 1,
          hideSortIcons: true,
          filterable: false,
          sortable: false,
        },
        {
          field: "delete",
          headerName: "Borrar",
          flex: 1,
          hideSortIcons: true,
          filterable: false,
          sortable: false,
          renderCell: ({ row }) => {
            return (
              <IconButton onClick={() => deleteUser(row.id)}>
                <DeleteIcon />
              </IconButton>
            );
          },
        },
      ]}
      // s
      autoPageSize
      autoHeight
      paginationMode="server"
      hideFooterRowCount
      disableMultipleColumnsSorting
      loading={isLoading}
      rowsPerPageOptions={[5, 10]}
      pageSize={pageSize}
      isRowSelectable={() => false}
      onPageSizeChange={({ pageSize }) => setPageSize(pageSize)}
      localeText={{
        footerRowSelected: (count) => {
          const isPlural = count > 1;
          return `${count} fila${isPlural ? "s" : ""} seleccionada${
            isPlural ? "s" : ""
          }`;
        },
      }}
    />
  );
};
