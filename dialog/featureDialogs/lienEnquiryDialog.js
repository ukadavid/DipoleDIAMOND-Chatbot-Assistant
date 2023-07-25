const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const API_BASE_URL = 'https://dac-fn7h.onrender.com';
const { performLienEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const LIEN_ENQUIRY_DIALOG = 'lienEnquiryDialog';

class LienEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || LIEN_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(LIEN_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performLienEnquiryStep.bind(this)
            ]));

        this.initialDialogId = LIEN_ENQUIRY_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your account number for Lien enquiry');
    }

    async performLienEnquiryStep(stepContext) {
        const accountNumber = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/lien`;
        const requestData = { AccountNumber: accountNumber };
        const response = await performLienEnquiryApiCall(apiUrl, requestData);

        if (response === 'Internal Server Error') {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        } else {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            await stepContext.context.sendActivity(`BVN Enquiry successful! Your Lien Enquiry is: ${ response }`);
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.LienEnquiryDialog = LienEnquiryDialog;
