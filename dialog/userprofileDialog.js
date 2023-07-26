const { InputHints, MessageFactory, CardFactory } = require('botbuilder');
const { ConfirmPrompt, ComponentDialog, ChoicePrompt, TextPrompt, WaterfallDialog, ListStyle, Dialog } = require('botbuilder-dialogs');
const { validateEmail } = require('../validateEmail');
const { getMenuCard } = require('../card.js');
const { ActionDialog } = require('./actionDialog.js');

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CHOICE_PROMPT = 'choicePrompt'; // Correct prompt type for the adaptive card prompt

class UserProfileDialog extends ComponentDialog {
    constructor(id) {
        super(id || 'userProfileDialog');
        this.userProfileDialog = new WaterfallDialog(WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.loopStep.bind(this),
            this.emailStep.bind(this), // Corrected spelling here
            this.confirmationStep.bind(this),
            this.processConfirmationStep.bind(this),
            this.authenticationStep.bind(this),
            this.authenticationValidationStep.bind(this),
            this.menuStep.bind(this),
            this.processActionStep.bind(this),
            this.showMenuStep.bind(this)
        ]);
        this.addDialog(new ActionDialog('actionDialog'));
        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT)) // Use ChoicePrompt for adaptive card prompt
            .addDialog(this.userProfileDialog);
        this.initialDialogId = WATERFALL_DIALOG;
    }

    async nameStep(stepContext) {
        const userInfo = stepContext.options;

        if (!userInfo.name) {
            const messageText = 'Enter username';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(userInfo.name);
    }

    async loopStep(stepContext) {
        try {
            const result = stepContext.result;

            // validate user inputed a string length not greater than 5
            if (typeof result === 'string' && result.length > 5) {
                const errorMessageText = 'Username invalid. Please enter a valid username \n \n Username must be a string of characters and length must not be greater than 5';
                const msg = MessageFactory.text(errorMessageText, errorMessageText, InputHints.ExpectingInput);
                await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

                return await stepContext.replaceDialog(WATERFALL_DIALOG, { stepIndex: 1 });
            } else {
                return await stepContext.next(result);
            }
        } catch (error) {
            console.error('Error in dialog:', error);

            await stepContext.context.sendActivity('An error occurred. Please try again later.');

            return await stepContext.endDialog();
        }
    }

    async emailStep(stepContext) {
        const userInfo = stepContext.options;

        userInfo.name = stepContext.result;
        if (!userInfo.email) {
            const messageText = 'Enter email address';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(userInfo.email);
    }

    async confirmationStep(stepContext) {
        const userInfo = stepContext.options;

        userInfo.email = stepContext.result;

        if (validateEmail(userInfo.email)) {
            const messageText = `Please confirm, I have your name as: ${ userInfo.name } and email as: ${ userInfo.email }. Is this correct?`;
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

            return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
        } else {
            const errorMessageText = 'Email invalid. Please enter a valid email';
            const msg = MessageFactory.text(errorMessageText, errorMessageText, InputHints.ExpectingInput);

            await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
            return await stepContext.replaceDialog(WATERFALL_DIALOG, { stepIndex: 2 });
        }
    }

    async processConfirmationStep(stepContext) {
        const confirmationResult = stepContext.result;
        const userInfo = stepContext.options;

        if (confirmationResult) {
            return await stepContext.next(userInfo);
        } else {
            // Take the user back to the username input step
            return await stepContext.replaceDialog(WATERFALL_DIALOG, { stepIndex: 1 });
        }
    }

    async authenticationStep(stepContext) {
        const userInfo = stepContext.options;

        if (!userInfo.authKey) {
            const messageText = 'Please enter authentication key';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next();
    }

    async authenticationValidationStep(stepContext) {
        const authKey = '11223344';
        const result = stepContext.result;

        if (result !== authKey) {
            await stepContext.context.sendActivity('Invalid passKey. Please enter the correct authentication key.');
            const messageText = 'Please enter the correct authentication key';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        } else {
            return await stepContext.next();
        }
    }

    async menuStep(stepContext) {
        const menuCard = getMenuCard();
        const cardAttachment = CardFactory.adaptiveCard(menuCard);
        const message = { attachments: [cardAttachment] };

        // Send the adaptive card to the user
        await stepContext.context.sendActivity(message);

        return Dialog.EndOfTurn;
    }

    async processActionStep(stepContext) {
        const activity = stepContext.context.activity;
        const selectedOption = activity.value?.title || activity.text;

        // Start the ActionDialog to handle the API calls based on the selected option
        return await stepContext.beginDialog('actionDialog', { selectedOption });
    }

    async showMenuStep(stepContext) {
        // After the action is completed, show the menu again
        return await stepContext.replaceDialog(WATERFALL_DIALOG, stepContext.options);
    }
}

module.exports.UserProfileDialog = UserProfileDialog;
