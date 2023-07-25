const { InputHints, MessageFactory } = require('botbuilder');
const generateRandomRequestId = require('./requestID.js');

async function performBalanceEnquiry(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the account number for balance enquiry';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performCheckAccountBVN(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the account number for BVN verification';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performConfirmAccountLien(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the account number for lien confirmation';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performConfirmAccountStatus(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the account number for account status confirmation';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performGetTransactionStatus(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the transaction reference number for transaction status retrieval';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performAccountWithMobile(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the mobile number for account retrieval';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performAccountDetails(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the account number for account details retrieval';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performCustomerDetails(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the customerId for customer details retrieval';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performSendStatement(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the account number, start date, and end date for account statement retrieval in the format: accountNumber-startDate-endDate';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performLoanEligibility(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter the phone number for loan eligibility';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performInwardTransfer(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter accountNumber, transactionDate, amount, sessionId, and fipTransferType for the inward transfer in the format: accountNumber-transactionDate-amount-sessionId-fipTransferType';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performOutwardsTransfer(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter accountNumber, transactionDate, amount, sessionId, and fipTransferType for the outwards transfer in the format: accountNumber-transactionDate-amount-sessionId-fipTransferType';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performTokenValidation(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter a token and userId for token validation in the format: token-userId';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

async function performChargeReversal(stepContext) {
    const requestId = generateRandomRequestId();
    const messageText = 'Please enter requestId, startDate, endDate, accountNumber, and amount for charge reversal in the format: requestId-startDate-endDate-accountNumber-amount';
    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    return await stepContext.next(requestId);
}

module.exports = {
    performBalanceEnquiry,
    performInwardTransfer,
    performCheckAccountBVN,
    performConfirmAccountLien,
    performOutwardsTransfer,
    performTokenValidation,
    performChargeReversal,
    performLoanEligibility,
    performSendStatement,
    performCustomerDetails,
    performAccountDetails,
    performConfirmAccountStatus,
    performAccountWithMobile,
    performGetTransactionStatus,
};
