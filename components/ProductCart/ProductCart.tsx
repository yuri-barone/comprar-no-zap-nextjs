import {
  Avatar, Badge, Grid, IconButton, makeStyles, Typography,
} from '@material-ui/core';
import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';

export type ProductCartProps = {
  quantity: number,
  src: string,
  name: string,
  id: number,
  removeItem: (param1:number) => void,
};

const useStyles = makeStyles((theme) => ({
  avatarSize: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
}));

const ProductCart = ({
  quantity, src, name, id, removeItem,
}:ProductCartProps) => {
  const classes = useStyles();

  const handleClick = () => {
    removeItem(id);
  };
  return (
    <Grid container spacing={1} justify="center">
      <Grid item xs={12}>
        <Badge
          badgeContent={quantity}
          color="primary"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Avatar src={src} className={classes.avatarSize} />
        </Badge>
        <IconButton onClick={handleClick}>
          <DeleteIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="caption" color="textSecondary">
          {name}
        </Typography>
      </Grid>

    </Grid>

  );
};

export default ProductCart;
