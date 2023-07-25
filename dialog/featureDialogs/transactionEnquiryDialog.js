const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const API_BASE_URL = 'https://dac-fn7h.onrender.com';
// Replace the line below with your actual API call function
const { performTransactionEnquiryApiCall } = require('../../api/api.js');
const fs = require('fs');
const path = require('path');

const TEXT_PROMPT = 'textPrompt';
const TRANSACTION_ENQUIRY_DIALOG = 'transactionEnquiryDialog';

class TransactionEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || TRANSACTION_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(TRANSACTION_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performTransactionEnquiryStep.bind(this)
            ]));

        this.initialDialogId = TRANSACTION_ENQUIRY_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your Customer Reference ID for Transaction enquiry');
    }

    async performTransactionEnquiryStep(stepContext) {
        const ClientReferenceId = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/transaction/status`;
        const requestData = { ClientReferenceId: ClientReferenceId };
        const response = await performTransactionEnquiryApiCall(apiUrl, requestData);

        if (response.responseMessage === 'Successful') {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            const adaptiveCard = this.createAdaptiveCard(response);

            await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(adaptiveCard)] });
        } else if (response.bvn == null) {
            await stepContext.context.sendActivity(`Transaction Status Enquiry failed! ${ response.response.data.responseMessage }`);
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }

    createAdaptiveCard(data) {
        const filePath = path.join(__dirname, '../../transactionCard.json');
        const adaptiveCardTemplate = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Replace the placeholders in the Adaptive Card JSON with actual data
        adaptiveCardTemplate.body[3].columns[0].items[0].text = data.finacleTranId;
        adaptiveCardTemplate.body[3].columns[1].items[0].text = data.transactionReference;
        adaptiveCardTemplate.body[3].columns[2].items[0].text = data.transactionStatus;

        return adaptiveCardTemplate;
    }
}

module.exports.TransactionEnquiryDialog = TransactionEnquiryDialog;
