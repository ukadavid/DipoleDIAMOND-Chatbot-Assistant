const { TextPrompt, WaterfallDialog, ComponentDialog, DateTimePrompt } = require('botbuilder-dialogs');
const API_BASE_URL = process.env.API_BASE_URL;
const { performChargeReversalEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const DATE_PROMPT = 'datePrompt';
const CHARGE_REVERSAL_ENQUIRY_DIALOG = 'chargeReversalEnquiryDialog';

class ChargeReversalEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || CHARGE_REVERSAL_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new DateTimePrompt(DATE_PROMPT))
            .addDialog(new WaterfallDialog(CHARGE_REVERSAL_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.startDateStep.bind(this),
                this.endDateStep.bind(this),
                this.amountStep.bind(this),
                this.performChargeReversalStep.bind(this)
            ]));

        this.initialDialogId = CHARGE_REVERSAL_ENQUIRY_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your account number to know your account status');
    }

    async startDateStep(stepContext) {
        // Get the account number entered by the user
        const accountNumber = stepContext.result;

        // Save the account number in the dialog state for future steps
        stepContext.values.accountNumber = accountNumber;

        // Prompt the user for the start date
        return await stepContext.prompt(DATE_PROMPT, 'Please enter the start date in the format YYYY-MM-DD');
    }

    async endDateStep(stepContext) {
        // Get the start date entered by the user
        const startDate = stepContext.result;

        // Save the start date in the dialog state for future steps
        stepContext.values.startDate = startDate;

        // Prompt the user for the end date
        return await stepContext.prompt(DATE_PROMPT, 'Please enter the end date in the format YYYY-MM-DD');
    }

    async amountStep(stepContext) {
        // Get the end date entered by the user
        const endDate = stepContext.result;

        // Save the end date in the dialog state for future steps
        stepContext.values.endDate = endDate;

        // Prompt the user for the amount
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter the amount');
    }

    async performChargeReversalStep(stepContext) {
        // Get the amount entered by the user
        const amount = stepContext.result;

        // Retrieve the account number and start date from the dialog state
        const accountNumber = stepContext.values.accountNumber;
        const startDate = stepContext.values.startDate;
        const endDate = stepContext.values.endDate;

        // Perform API call with the inputted account number, start date, and end date using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/charge-reversal`;
        const requestData = {
            AccountNumber: accountNumber,
            StartDate: startDate,
            EndDate: endDate,
            Amount: amount
        };
        const response = await performChargeReversalEnquiryApiCall(apiUrl, requestData);

        if (response === 'Internal Server Error') {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        } else {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            await stepContext.context.sendActivity(`Account Status successful! Your Account Status is: ${ response }`);
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.ChargeReversalEnquiryDialog = ChargeReversalEnquiryDialog;
