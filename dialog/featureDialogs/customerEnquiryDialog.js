const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const API_BASE_URL = 'https://dac-fn7h.onrender.com';
const { performCustomerEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const CUSTOMER_ENQUIRY_DIALOG = 'customerEnquiryDialog';

class CustomerEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || CUSTOMER_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(CUSTOMER_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performCustomerEnquiryStep.bind(this)
            ]));

        this.initialDialogId = CUSTOMER_ENQUIRY_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter the customer ID for customer enquiry');
    }

    async performCustomerEnquiryStep(stepContext) {
        const CustomerId = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/get-customer-details`;
        const requestData = { CustomerId: CustomerId };
        const response = await performCustomerEnquiryApiCall(apiUrl, requestData);

        if (response === 'Internal Server Error') {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        } else {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            await stepContext.context.sendActivity(`BVN Enquiry successful! Your BVN is: ${ response }`);
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.CustomerEnquiryDialog = CustomerEnquiryDialog;
