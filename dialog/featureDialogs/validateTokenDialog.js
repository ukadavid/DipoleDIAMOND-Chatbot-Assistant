const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const { performValidateTokenApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const VALIDATE_TOKEN_DIALOG = 'validateTokenDialog';

class ValidateTokenDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || VALIDATE_TOKEN_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(VALIDATE_TOKEN_DIALOG, [
                this.tokenStep.bind(this),
                this.userStep.bind(this),
                this.performValidateTokenStep.bind(this)
            ]));
        this.initialDialogId = VALIDATE_TOKEN_DIALOG;
    }

    async tokenStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your token');
    }

    async userStep(stepContext) {
        // Get the token entered by the user
        const token = stepContext.result;

        // Save the token in the dialog state for future steps
        stepContext.values.token = token;

        // Prompt the user for the user
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your userID');
    }

    async performValidateTokenStep(stepContext) {
        // Get the user entered by the user
        const user = stepContext.result;

        // Retrieve the token from the dialog state
        const token = stepContext.values.token;

        const responseData = { UserId: user, Token: token };

        // Perform API call with the inputted token and user using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/token/validate`;
        const apiResponse = await performValidateTokenApiCall(apiUrl, responseData);

        // If the API call is successful, display the account details to the user
        if (apiResponse.responseMessage === 'Successful') {
            await stepContext.context.sendActivity(`This is your secured token: ${ apiResponse.token }`);
            return await stepContext.endDialog();
        } else {
            await stepContext.context.sendActivity('Your token is invalid');
            return await stepContext.endDialog();
        }
    }
}

module.exports.ValidateTokenDialog = ValidateTokenDialog;
