function generateWalletAddress() {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let address = "ppe_"; // prefix

  for (let i = 0; i < 38; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return address;
}

export default generateWalletAddress;
