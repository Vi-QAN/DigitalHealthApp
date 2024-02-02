export const convertToBytes32 = (value) => {
    if (value.length > 32) {
        throw new Error('Input string exceeds 32 characters');
    }
    
    // Convert the string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(value);

    // Create a Uint8Array with 32 bytes (bytes32)
    const bytes32 = new Uint8Array(32);

    // Copy the UTF-8 bytes to the bytes32 array
    bytes32.set(utf8Bytes);

    return '0x' + Buffer.from(bytes32).toString('hex');
  }