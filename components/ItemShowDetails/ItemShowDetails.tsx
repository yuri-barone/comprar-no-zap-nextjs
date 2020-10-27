import {
  Avatar,
  Badge,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CloseIcon from '@material-ui/icons/Close';
import { formatNumberToMoneyWithSymbol } from '../../formatters';
import pictureService from '../services/pictureService';

const useStyles = makeStyles((theme) => ({
  imgSize: {
    height: 50,
    width: 50,
  },
  containerMaxHeight: {
    height: '100%',
  },
  badge: {
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    cursor: 'pointer',
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.error.main,
    },
  },
  productName: {
    maxWidth: theme.spacing(10),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export type ItemShowDetailsProps = {
  src?: string;
  quantity: number;
  productValue: number;
  productName: string;
  productId: number;
  pictureId: number;
  removeItem: (pram1: number) => void;
  changeItemQuantity: (param1: number, param2: number) => void;
};

const ItemShowDetails = ({
  quantity,
  productValue,
  productName,
  productId,
  changeItemQuantity,
  removeItem,
  pictureId,
}: ItemShowDetailsProps) => {
  const classes = useStyles();
  const [productQuantity, setProductQuantity] = useState(quantity);
  const [totalValue, setTotalValue] = useState<number>();
  const [image, setImage] = useState('/empty-img.jpg');

  // eslint-disable-next-line consistent-return
  const getImage = async () => {
    try {
      const pictureResponse = await pictureService.get(pictureId);
      setImage(pictureResponse.data.imgBase64);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getImage();
    return () => {
      setImage('/empty-img.jpg');
    };
  }, []);

  const calcTotalValue = () => {
    const total = productValue * quantity;
    setTotalValue(total);
  };

  useEffect(() => {
    calcTotalValue();
  }, [quantity]);

  useEffect(() => {
    changeItemQuantity(productId, productQuantity);
  }, [productQuantity]);

  const addQuantity = () => {
    const finalQuantity = quantity + 1;
    setProductQuantity(finalQuantity);
  };
  const removeQuantity = () => {
    const finalQuantity = quantity - 1;
    if (finalQuantity < 1) {
      return;
    }
    setProductQuantity(finalQuantity);
  };

  const handleClick = () => {
    removeItem(productId);
  };

  return (
    <Grid container alignItems="center" direction="column">
      <Grid item xs="auto">
        <Badge
          badgeContent={<CloseIcon fontSize="small" />}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClick={handleClick}
          classes={{ badge: classes.badge }}
        >
          <Avatar src={image} className={classes.imgSize} />
        </Badge>
      </Grid>
      <Grid item xs="auto">
        <Typography
          component="p"
          align="center"
          noWrap
          variant="caption"
          className={classes.productName}
        >
          {productName}
        </Typography>
        <Typography align="center">
          {formatNumberToMoneyWithSymbol(totalValue, 'R$')}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <IconButton onClick={removeQuantity}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography component="span">
          {quantity}
        </Typography>
        <IconButton onClick={addQuantity}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ItemShowDetails;
