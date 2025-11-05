export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 MB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // log base(1024) number (bytes) = total power => formulae log(number)/log(base)= power
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
export const inputOnChange = (stateSetterFunc) => {
  return (e) => {
    const { name,value } = e.target;
    stateSetterFunc((prev) =>({
      ...prev,
      [name]:value,
    }));
  };
};
