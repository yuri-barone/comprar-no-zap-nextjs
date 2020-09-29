import { Avatar, Badge, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

export type ProductCartProps = {
    quantity: number,
    src: string,
    name: string
}

const useStyles = makeStyles(theme => ({
    avatarSize: {
        height: theme.spacing(8),
        width: theme.spacing(8),
    }
}))

const ProductCart = ({quantity, src, name}:ProductCartProps) => {
    const classes = useStyles()
    return (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Badge
                      badgeContent={quantity}
                      color="primary"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                    >
                      <Avatar src={src} className={classes.avatarSize} />
                    </Badge>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                    {name}
                    </Typography>
                  </Grid>
                </Grid>

    );
}

export default ProductCart;
