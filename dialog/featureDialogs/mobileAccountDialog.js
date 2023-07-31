const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
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

        if (response.responseMessage === 'Successful') {
            // Handle API success response
            // Loop through the accounts array and render its contents
            let message = 'Mobile Enquiry successful! \nHere are your accounts:\n';
            for (const account of response.accounts) {
                message += `\n Account Name: ${ account }\n`;
            }
            await stepContext.context.sendActivity(message);
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.MobileEnquiryDialog = MobileEnquiryDialog;
