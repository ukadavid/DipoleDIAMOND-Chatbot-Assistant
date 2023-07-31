const { TextPrompt, WaterfallDialog, ComponentDialog, DateTimePrompt } = require('botbuilder-dialogs');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const { performStatementEnquiryApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const DATE_PROMPT = 'datePrompt';
const STATEMENT_ENQUIRY_DIALOG = 'statementEnquiryDialog';

class StatementEnquiryDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || STATEMENT_ENQUIRY_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new DateTimePrompt(DATE_PROMPT))
            .addDialog(new WaterfallDialog(STATEMENT_ENQUIRY_DIALOG, [
                this.accountNumberStep.bind(this),
                this.startDateStep.bind(this),
                this.endDateStep.bind(this),
                this.performAccountDetailsStep.bind(this)
            ]));

        this.initialDialogId = STATEMENT_ENQUIRY_DIALOG;
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

    async performAccountDetailsStep(stepContext) {
        // Get the end date entered by the user
        const endDate = stepContext.result;

        // Retrieve the account number and start date from the dialog state
        const accountNumber = stepContext.values.accountNumber;
        const startDate = stepContext.values.startDate;

        // Perform API call with the inputted account number, start date, and end date using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/statement/send-statement`;
        const requestData = {
            AccountNumber: accountNumber,
            StartDate: startDate,
            EndDate: endDate
        };
        const response = await performStatementEnquiryApiCall(apiUrl, requestData);

        if (response.responseMessage === 'Successful') {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            await stepContext.context.sendActivity(`Account Statement Enquiry is successful! Your RequestId is: ${ response.requestId }`);
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.StatementEnquiryDialog = StatementEnquiryDialog;
