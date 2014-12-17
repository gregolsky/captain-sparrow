module.exports = {
  normalizeName: normalizeName,
  padLeft: padLeft
};

function normalizeName(name) {
  return name
    .replace(/[^A-Za-z0-9 \.]/g, '')
    .replace('.', ' ')
    .replace(/ +/g, ' ')
    .toUpperCase()
    .trim();
}

function padLeft(padString, arg) {
  return (padString + arg).slice(-padString.length);
}
