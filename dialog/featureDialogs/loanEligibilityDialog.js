const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const API_BASE_URL = 'https://dac-fn7h.onrender.com';
const { performLoanEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const LOAN_ENQUIRY_DIALOG = 'loanEnquiryDialog';

class LoanEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || LOAN_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(LOAN_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performLoanEnquiryStep.bind(this)
            ]));

        this.initialDialogId = LOAN_ENQUIRY_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter the phone number to verify loan eligibility');
    }

    async performLoanEnquiryStep(stepContext) {
        const PhoneNumber = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/fetch-eligibility`;
        const requestData = { PhoneNumber: PhoneNumber };
        const response = await performLoanEnquiryApiCall(apiUrl, requestData);

        if (response === 'Internal Server Error') {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        } else {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            await stepContext.context.sendActivity(`Loan Enquiry successful! Your Loan Eligibility is: ${ response }`);
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.LoanEnquiryDialog = LoanEnquiryDialog;
