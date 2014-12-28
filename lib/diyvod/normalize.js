module.exports = {
  normalizeName: normalizeName,
  padLeft: padLeft
};

function normalizeName(name) {
  return name
    .replace(/[^A-Za-z0-9 \.]/g, '')
    .replace(/\./g, ' ')
    .replace(/ +/g, ' ')
    .toUpperCase()
    .trim();
}

function padLeft(padString, arg) {
  return padString.slice(0, padString.length - arg.length) + arg;
}
