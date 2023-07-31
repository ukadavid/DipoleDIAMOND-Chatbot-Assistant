const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const { performLienEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const LIEN_ENQUIRY_DIALOG = 'lienEnquiryDialog';
function formatIsoDate(isoDate) {
    const dateObj = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateObj.toLocaleDateString(undefined, options);
}

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
            if (response.liens && response.liens.length > 0) {
                await stepContext.context.sendActivity('Lien Enquiry Successful');
                for (const lien of response.liens) {
                    let liensText = '';
                    liensText += `Account Number: ${ lien.accountNumber }\n`;
                    liensText += `\nLien Amount: ₦${ lien.lienAmount }\n`;
                    liensText += `\nLien Reason: ${ lien.lienReason }\n`;
                    liensText += `\nInitiator: ${ lien.initiator }\n`;
                    liensText += `\nVerifier: ${ lien.verifier }\n`;
                    liensText += `\nBranch Code: ${ lien.branchCode }\n`;
                    liensText += `\nLien Date: ${ formatIsoDate(lien.lienDate) }\n`;
                    liensText += `\nExpiry Date: ${ formatIsoDate(lien.expiryDate) }\n\n`;

                    await stepContext.context.sendActivity(liensText);
                }
            } else {
                await stepContext.context.sendActivity('No liens found for the given account number.');
            }
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.LienEnquiryDialog = LienEnquiryDialog;
