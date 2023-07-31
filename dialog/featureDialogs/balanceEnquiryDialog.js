const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const { performBalanceEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const BALANCE_ENQUIRY_DIALOG = 'balanceEnquiryDialog';

class BalanceEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || BALANCE_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(BALANCE_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performBalanceEnquiryStep.bind(this)
            ]));

        this.initialDialogId = BALANCE_ENQUIRY_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your account number for balance enquiry');
    }

    async performBalanceEnquiryStep(stepContext) {
        const accountNumber = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/balance`;
        const requestData = { AccountNumber: accountNumber };
        const response = await performBalanceEnquiryApiCall(apiUrl, requestData);
        console.log(response);
        if (response.responseMessage === 'Successful') {
            // Handle API success response
            // Corrected message with newline characters
            await stepContext.context.sendActivity(`Balance Enquiry successful! 
\n Your Account Name is: ${ response.accountName }
\n Your Account Number is: ${ response.accountNumber }
\n Your Available Balance is: ₦${ response.availableBalance }`);
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.BalanceEnquiryDialog = BalanceEnquiryDialog;
