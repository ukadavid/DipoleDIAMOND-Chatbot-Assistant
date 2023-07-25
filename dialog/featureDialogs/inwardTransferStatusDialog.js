const { TextPrompt, WaterfallDialog, ComponentDialog, DateTimePrompt } = require('botbuilder-dialogs');
const API_BASE_URL = process.env.API_BASE_URL;
const { performInwardTransferApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const DATE_PROMPT = 'datePrompt';
const INWARD_TRANSFER_DIALOG = 'inwardTransferDialog';

class InwardTransferDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || INWARD_TRANSFER_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new DateTimePrompt(DATE_PROMPT))
            .addDialog(new WaterfallDialog(INWARD_TRANSFER_DIALOG, [
                this.accountNumberStep.bind(this),
                this.transactionDateStep.bind(this),
                this.amountStep.bind(this),
                this.performInwardTransferStep.bind(this)
            ]));

        this.initialDialogId = INWARD_TRANSFER_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your account number to know your account status');
    }

    async transactionDateStep(stepContext) {
        // Get the account number entered by the user
        const accountNumber = stepContext.result;

        // Save the account number in the dialog state for future steps
        stepContext.values.accountNumber = accountNumber;

        // Prompt the user for the transaction date
        return await stepContext.prompt(DATE_PROMPT, 'Please enter the transaction date in the format YYYY-MM-DD');
    }

    async amountStep(stepContext) {
        // Get the transaction date entered by the user
        const transactionDate = stepContext.result;

        // Save the transaction date in the dialog state for future steps
        stepContext.values.transactionDate = transactionDate;

        // Prompt the user for the amount
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter the amount');
    }

    async performInwardTransferStep(stepContext) {
        // Get the amount entered by the user
        const amount = stepContext.result;

        // Retrieve the account number, transaction date, and amount from the dialog state
        const accountNumber = stepContext.values.accountNumber;
        const transactionDate = stepContext.values.transactionDate;

        // Perform API call with the inputted account number, transaction date, and amount using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/inward-transfer-status`;
        const requestData = {
            AccountNumber: accountNumber,
            TransactionDate: transactionDate,
            Amount: amount
        };
        const response = await performInwardTransferApiCall(apiUrl, requestData);

        if (response === 'Internal Server Error') {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        } else {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            await stepContext.context.sendActivity(`Account Status successful! Your Account Status is: ${ response }`);
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.InwardTransferDialog = InwardTransferDialog;
