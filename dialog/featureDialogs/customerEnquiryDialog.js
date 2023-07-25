const fs = require('fs');
const path = require('path');
const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const API_BASE_URL = 'https://dac-fn7h.onrender.com';
const { performCustomerEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const CUSTOMER_ENQUIRY_DIALOG = 'customerEnquiryDialog';

function formatIsoDate(isoDate) {
    const dateObj = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateObj.toLocaleDateString(undefined, options);
}
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

        if (response.responseMessage === 'Successful') {
            // Handle API success response
            // Load the adaptive card template from the JSON file
            const cardJsonPath = path.join(__dirname, '../../customerDetailsCard.json');
            const adaptiveCardTemplate = JSON.parse(fs.readFileSync(cardJsonPath, 'utf8'));

            // Replace placeholders in the template with data from the response
            const placeholders = {
                customerId: response.customerId,
                title: response.title,
                gender: response.gender,
                firstName: response.firstName,
                middleName: response.middleName,
                lastName: response.lastName,
                customerCategory: response.customerCategory,
                address: response.address,
                dateOfBirth: formatIsoDate(response.dateOfBirth),
                mobileNo: response.mobileNo,
                email: response.email,
                state: response.state,
                country: response.country
            };

            const processedCardJson = JSON.stringify(adaptiveCardTemplate).replace(
                /\${([^{}]+)}/g,
                (match, capture) => placeholders[capture.trim()]
            );

            const adaptiveCard = JSON.parse(processedCardJson);

            await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(adaptiveCard)] });
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.CustomerEnquiryDialog = CustomerEnquiryDialog;
