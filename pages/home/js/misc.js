exports.containsAny = (list, valList) => {
  let toReturn = false;
  valList.forEach((item) => {
    if (list.includes(item)) {
      toReturn = true;
    }
  });
  return toReturn;
};
