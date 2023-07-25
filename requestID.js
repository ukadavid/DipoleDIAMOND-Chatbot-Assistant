async function generateRandomRequestId() {
    // Generate a random requestId in the range of 100,000,000 to 999,999,999
    const min = 100000000;
    const max = 999999999;
    const requestId = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`Generated random requestId: ${ requestId }`);
    return requestId.toString();
}

module.exports.generateRandomRequestId = generateRandomRequestId;
