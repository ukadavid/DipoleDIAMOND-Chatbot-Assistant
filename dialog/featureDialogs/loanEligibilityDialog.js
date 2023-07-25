const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const API_BASE_URL = 'https://dac-fn7h.onrender.com';
const { performLoanEnquiryApiCall } = require('../../api/api.js');
const path = require('path');
const fs = require('fs');

const TEXT_PROMPT = 'textPrompt';
const LOAN_ENQUIRY_DIALOG = 'loanEnquiryDialog';

function formatIsoDate(isoDate) {
    const dateObj = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateObj.toLocaleDateString(undefined, options);
}

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

        if (response.responseMessage === 'Eligibility Fetched Successfully') {
            // Handle API success response
            // Load the adaptive card template from the JSON file
            const cardJsonPath = path.join(__dirname, '../../loanEnquiryCard.json');
            const adaptiveCardTemplate = JSON.parse(fs.readFileSync(cardJsonPath, 'utf8'));

            // Replace placeholders in the template with data from the API response
            const placeholders = {
                amount: response.amount,
                lastSalaryDate: formatIsoDate(response.lastSalaryDate),
                avgSalaryPerYear: response.avgSalaryPerYear,
                lastSalaryAmount: response.lastSalaryAmount,
                currency: response.currency,
                status: response.status,
                requestId: response.requestId,
                responseCode: response.responseCode,
                responseMessage: response.responseMessage
            };
            const processedCardJson = JSON.stringify(adaptiveCardTemplate).replace(
                /\${([^{}]+)}/g,
                (match, capture) => placeholders[capture.trim()]
            );

            // Send the adaptive card as an attachment
            await stepContext.context.sendActivity({
                attachments: [{
                    contentType: 'application/vnd.microsoft.card.adaptive',
                    content: JSON.parse(processedCardJson)
                }]
            });
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.LoanEnquiryDialog = LoanEnquiryDialog;
