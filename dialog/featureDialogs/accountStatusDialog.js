const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const { performAccountStatusApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const ACCOUNT_STATUS_DIALOG = 'accountStatusDialog';

class AccountStatusDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || ACCOUNT_STATUS_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(ACCOUNT_STATUS_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performAccountStatusStep.bind(this)
            ]));

        this.initialDialogId = ACCOUNT_STATUS_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your account number to know your account status');
    }

    async performAccountStatusStep(stepContext) {
        const accountNumber = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/account/status`;
        const requestData = { AccountNumber: accountNumber };
        const response = await performAccountStatusApiCall(apiUrl, requestData);

        if (response.responseMessage === 'Successful') {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            await stepContext.context.sendActivity(`Account Status Enquiry successful! Your Account Status is: ${ response.accountStatus }`);
        } else if (response.bvn == null) {
            await stepContext.context.sendActivity(`Account Status Enquiry failed! ${ response.response.data.responseMessage }`);
            console.log();
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }
        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.AccountStatusDialog = AccountStatusDialog;
