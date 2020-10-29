import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

export type ImageFeedbackProps = TypographyProps & {
  image: string;
  message?: string;
  withButton?: boolean;
  buttonMessage?: string;
  altText?: string;
  buttonOnClick?: () => void;
};

const useStyles = makeStyles((theme) => ({
  image: {
    position: 'absolute',
    objectFit: 'cover',
    borderRadius: 200,
  },
  rounded: {
    position: 'relative',
    borderRadius: 200,
    height: theme.spacing(22),
    width: theme.spacing(22),
    backgroundColor: theme.palette.primary.light,
  },
}));

const ImageFeedback = ({
  image, message, altText, withButton, buttonMessage, buttonOnClick, ...props
}: ImageFeedbackProps) => {
  const classes = useStyles();
  return (
    <Grid container justify="center" alignItems="center" spacing={2}>
      <Grid item>
        <div className={classes.rounded}>
          <img className={classes.image} alt={message || altText} src={image} width="100%" height="100%" />
        </div>
      </Grid>
      {message && (
      <Grid item xs={12}>
        <Typography align="center" color="textPrimary" variant="body1" {...props}>
          {message}
        </Typography>
      </Grid>
      )}
      {withButton && (
        <Grid item xs="auto">
          <Button color="primary" variant="contained" size="large" onClick={buttonOnClick}>{buttonMessage}</Button>
        </Grid>
      )}
    </Grid>
  );
};
export default ImageFeedback;
