import { Box, IconButton, Chip } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import { FC } from "react";
import { useRouter } from "next/router";

const filters = {
  website: "Sitio web",
};

interface ITableTopBarProps {
  onExportClick(): void;
  onFilterClick(): void;
  isFilterOpen: boolean;
}

export const TableTopBar: FC<ITableTopBarProps> = ({
  onExportClick,
  onFilterClick,
  isFilterOpen,
}) => {
  const router = useRouter();

  function handleDeleteFilter(filter: string): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(filter);
    router.replace(url.href);
  }

  return (
    <Box
      marginY="1rem"
      border="1px solid #eee"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>
        <IconButton onClick={onFilterClick}>
          {isFilterOpen ? <CloseIcon /> : <FilterListIcon />}
        </IconButton>
        {Object.entries(router.query).map(([filter, value]) => {
          return (
            <Chip
              key={filter}
              size="small"
              label={
                <span>
                  <strong>{filters[filter] || filter}:</strong>{" "}
                  {typeof value === "string" ? value : value.join(", ")}
                </span>
              }
              style={{ marginRight: 6 }}
              onDelete={() => handleDeleteFilter(filter)}
            />
          );
        })}
      </Box>
      <IconButton onClick={onExportClick}>
        <GetAppIcon />
      </IconButton>
    </Box>
  );
};
