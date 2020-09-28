import { makeStyles, TextField, fade } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";

export type SearchProps = {
  onSearch: (filter: string) => void;
};

const useStyles = makeStyles((theme) => ({
  searchDiv: {
    display: "flex",
    backgroundColor: fade(theme.palette.common.white, 0.15),
  },
  searchInput: {
    margin: 5,
    width: "100%",
  },
  searchIcon: {
    alignSelf: "flex-end",
    marginBottom: 5,
    marginLeft: 5,
  },
}));

function Search({ onSearch }: SearchProps) {
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  const handleSearchChange = (e: any) => {
    setFilter(e.target.value);
  };
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      onSearch(filter);
    }, 500);
    return () => {
      clearInterval(searchTimeout);
    };
  }, [filter]);

  return (
    <div className={classes.searchDiv}>
      <SearchIcon className={classes.searchIcon} />
      <TextField
        onChange={handleSearchChange}
        className={classes.searchInput}
        label="Pesquisar por produtos ou empresas"
        variant="standard"
      />
    </div>
  );
}

export default Search;
