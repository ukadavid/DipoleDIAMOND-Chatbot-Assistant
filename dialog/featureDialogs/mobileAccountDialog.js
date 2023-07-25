const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const API_BASE_URL = 'https://dac-fn7h.onrender.com';
const { performMobileEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const MOBILE_ENQUIRY_DIALOG = 'mobileEnquiryDialog';

class MobileEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || MOBILE_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(MOBILE_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performMobileEnquiryStep.bind(this)
            ]));

        this.initialDialogId = MOBILE_ENQUIRY_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your mobile number for your account enquiry');
    }

    async performMobileEnquiryStep(stepContext) {
        const MobileNumber = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/get-accounts-with-mobile`;
        const requestData = { MobileNumber: MobileNumber };
        const response = await performMobileEnquiryApiCall(apiUrl, requestData);

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

module.exports.MobileEnquiryDialog = MobileEnquiryDialog;
