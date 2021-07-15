import { Box, TextField, Button } from "@material-ui/core";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { FC, useState } from "react";

const INITIAL_QUERY = {
  name: "",
  value: "",
};

interface IFilterFormProps {
  setIsFilterFormOpen: Dispatch<SetStateAction<boolean>>;
}

export const FilterForm: FC<IFilterFormProps> = ({ setIsFilterFormOpen }) => {
  const router = useRouter();
  const [query, setQuery] = useState(INITIAL_QUERY);

  function handleChange(e) {
    setQuery({ ...query, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.append(query.name, query.value);
    router.replace(url.href);
    setQuery(INITIAL_QUERY);
    setIsFilterFormOpen(false);
  }

  return (
    <Box my="2rem" component="form" onSubmit={handleSubmit} display="flex">
      <TextField
        required
        variant="outlined"
        label="Nombre"
        name="name"
        style={{ marginRight: "1rem" }}
        value={query.name}
        onChange={handleChange}
      />
      <TextField
        required
        variant="outlined"
        label="Valor"
        name="value"
        style={{ marginRight: "1rem" }}
        value={query.value}
        onChange={handleChange}
      />
      <Button type="submit" color="primary" variant="contained">
        Aplicar filtro
      </Button>
    </Box>
  );
};
