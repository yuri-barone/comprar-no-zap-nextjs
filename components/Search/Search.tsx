import {
  makeStyles, fade, InputBase,
} from '@material-ui/core';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

export type SearchProps = {
  onChange?: (e:any) => void;
  onEnter?: () => void;
  value?: string;
  InputAddornment?: React.ReactFragment;
};

const useStyles = makeStyles((theme) => ({
  searchDiv: {
    position: 'relative',
    display: 'flex',
    borderRadius: 250,
    border: `1px solid ${fade(theme.palette.common.black, 0.4)}`,
    '&:hover': {
      border: `1px solid ${theme.palette.common.black}`,
    },
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    height: theme.spacing(4),
  },
}));

function Search({
  onEnter, value, onChange, InputAddornment,
}: SearchProps) {
  const classes = useStyles();
  const handleKeyDown = (e:any) => {
    if (e.keyCode === 13) {
      onEnter();
    }
  };

  return (
    <div className={classes.searchDiv}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Pesquisar por produtos ou empresas"
        onChange={onChange}
        onKeyDown={handleKeyDown}
        value={value}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        endAdornment={InputAddornment}
      />
    </div>
  );
}

export default Search;
