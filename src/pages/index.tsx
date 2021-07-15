/* eslint-disable react/display-name */
import { Container } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import api from "../utils/api";
import { Table } from "../components/table";
import { TableTopBar } from "../components/table-top-bar";
import { FilterForm } from "../components/filter-form";
import { Loader } from "../components/loader";
import { exportCSVFile } from "../utils/csv";

interface User {
  id: string;
  name: string;
  email: string;
  website: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    async function getFilteredUsers() {
      setLoading(true);
      const response = await api.get<User[]>("/users", {
        _limit: pageSize,
        _page: 1,
        ...router.query,
      });
      if (!response.ok) return;

      const users = response.data.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          website: user.website,
        };
      });

      setUsers(users);
      setLoading(false);
    }

    getFilteredUsers();
  }, [router, pageSize]);

  function handleFilterFormToggle() {
    setIsFilterFormOpen((isOpen) => !isOpen);
  }

  function handleExport() {
    const fileTitle = "usuarios";

    const headers = {
      id: "ID",
      name: "Nombre",
      email: "Correo electrónico",
      website: "Sitio web",
    };

    exportCSVFile({ headers, items: [], fileTitle });
  }

  return (
    <Container>
      {isFilterFormOpen && (
        <FilterForm setIsFilterFormOpen={setIsFilterFormOpen} />
      )}

      <TableTopBar
        isFilterOpen={isFilterFormOpen}
        onExportClick={handleExport}
        onFilterClick={handleFilterFormToggle}
      />

      <Table
        users={users}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setUsers={setUsers}
        isLoading={loading}
      />
    </Container>
  );
};

export default Home;
