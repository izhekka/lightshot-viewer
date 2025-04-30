const nextChar = {
    'a': 'b', 'b': 'c', 'c': 'd', 'd': 'e', 'e': 'f', 'f': 'g', 'g': 'h', 'h': 'i', 'i': 'j', 'j': 'k',
    'k': 'l', 'l': 'm', 'm': 'n', 'n': 'o', 'o': 'p', 'p': 'q', 'q': 'r', 'r': 's', 's': 't', 't': 'u',
    'u': 'v', 'v': 'w', 'w': 'x', 'x': 'y', 'y': 'z', 'z': '0', '0': '1', '1': '2', '2': '3', '3': '4',
    '4': '5', '5': '6', '6': '7', '7': '8', '8': '9', '9': null
}


function generateHash() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < 6; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

function getNextHash(currentHash) {
    if (!currentHash) {
        return 'a';
    }

    const hash = currentHash;
    const hashLength = hash.length;

    const lastChar = hash[hashLength - 1];
    const nextChar = nextChar[lastChar];
    if (nextChar) {
        return hash.slice(0, -1) + nextChar;
    }
    return getNextHash(hash.slice(0, -1)) + 'a';
}

module.exports = {
  getNextHash,
  generateHash
};
