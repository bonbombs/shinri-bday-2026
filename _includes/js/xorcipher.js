const XORCipher = {
  encode (key, plaintext) {
      const bin = xor_encrypt(key, plaintext);
      const hex = Array.from(bin, (b)=>b.toString(16).padStart(2, '0')).join('');
      return hex;
  }
};

function keyCharAt(key, i) {
  return key.charCodeAt(Math.floor(i % key.length));
}

function xor_encrypt(key, plaintext) {
  const bin = new Uint8Array(plaintext.length);
  for(let i = 0; i < plaintext.length; i++){
      bin[i] = plaintext.charCodeAt(i) ^ keyCharAt(key, i);
  }
  return bin;
}