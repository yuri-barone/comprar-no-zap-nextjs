import { makeStyles } from "@material-ui/core";
import React, { useRef, useState } from "react";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { getBase64, resizeImage } from "../../images/base64ImageManipulator";
import clsx from 'clsx';

export type ImageUploadProps = {
  defaultImage?: String;
  onChangeImage?: (imgBase64: any) => void;
  rounded?: boolean;
  size?: number;
  configureActions?: (actions:any) => void;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: theme.palette.grey[300],
    minHeight: 176,
    width: "100%",
    overflow: "hidden",
  },
  rounded: {
    position: "relative",
    borderRadius: 200,
    height: theme.spacing(22),
    width: theme.spacing(22),
  },
  input: {
    display: "none",
  },
  clickableLabel: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 99,
  },
  img:{
    position: "absolute",
    objectFit: "cover",
  },
  icon:{
    zIndex: 99,
  },
}));

function ImageUpload({
  defaultImage,
  onChangeImage,
  rounded,
  size,
  configureActions
}: ImageUploadProps) {
  const classes = useStyles({ rounded, size });
  const fileInput: any = useRef(null);
  const [imgB64, setImgB64] = useState<any>(defaultImage);
  const noop = () => {};
  const handleFiles = async () => {
    const file = fileInput.current.files[0];
    const img = await getBase64(file);
    const imgResized = await resizeImage(img);
    setImgB64(imgResized);
    (onChangeImage || noop)(imgResized);
  };
  const clear = () => {
    setImgB64(defaultImage)
  }

  configureActions({clear})

  return (
    <div className={clsx(rounded && classes.rounded, classes.root)}>
      <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        className={classes.input}
        onChange={handleFiles}
        ref={fileInput}
      />
      <img
        alt=""
        src={imgB64}
        className={classes.img}
        width="100%"
        height="100%"
      ></img>
      <label htmlFor="icon-button-file" className={classes.clickableLabel}>
      </label>
      <PhotoCamera className={classes.icon} />
    </div>
  );
}

export default ImageUpload;
