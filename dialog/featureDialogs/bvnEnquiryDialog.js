const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const API_BASE_URL = 'https://dac-fn7h.onrender.com';
const { performBVNEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const BVN_ENQUIRY_DIALOG = 'bvnEnquiryDialog';

class BvnEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || BVN_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(BVN_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performBvnEnquiryStep.bind(this)
            ]));

        this.initialDialogId = BVN_ENQUIRY_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your account number for BVN enquiry');
    }

    async performBvnEnquiryStep(stepContext) {
        const accountNumber = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/bvn`;
        const requestData = { AccountNumber: accountNumber };
        const response = await performBVNEnquiryApiCall(apiUrl, requestData);

        if (response.responseMessage === 'Successful') {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            await stepContext.context.sendActivity(`BVN Enquiry successful! Your BVN is: ${ response.bvn }`);
        } else if (response.bvn == null) {
            await stepContext.context.sendActivity(`BVN Enquiry failed! ${ response.response.data.responseMessage }`);
            console.log();
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.BvnEnquiryDialog = BvnEnquiryDialog;
