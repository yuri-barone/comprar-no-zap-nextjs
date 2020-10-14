// eslint-disable-next-line max-len
export const resizeImage = (imgAvatar: any, maxWidth = 400, maxHeight = 400) => new Promise((resolve) => {
  const img = new Image();
  img.src = imgAvatar;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = maxWidth;
    const MAX_HEIGHT = maxHeight;
    let { width } = img;
    let { height } = img;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx: any = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    resolve(canvas.toDataURL());
  };
});

export const getBase64 = async (file: any) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = function onError(error) {
    reject(error);
  };
});
