const { TextPrompt, WaterfallDialog, ComponentDialog, DateTimePrompt } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const { performOutwardTransferApiCall } = require('../../api/api.js');

const TEXT_PROMPT = 'textPrompt';
const DATE_PROMPT = 'datePrompt';
const OUTWARD_TRANSFER_DIALOG = 'outwardTransferDialog';

class OutwardTransferDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || OUTWARD_TRANSFER_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new DateTimePrompt(DATE_PROMPT))
            .addDialog(new WaterfallDialog(OUTWARD_TRANSFER_DIALOG, [
                this.accountNumberStep.bind(this),
                this.transactionDateStep.bind(this),
                this.amountStep.bind(this),
                this.performOutwardTransferStep.bind(this)
            ]));

        this.initialDialogId = OUTWARD_TRANSFER_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your account number to know your account status');
    }

    async transactionDateStep(stepContext) {
        // Get the account number entered by the user
        const accountNumber = stepContext.result;

        // Save the account number in the dialog state for future steps
        stepContext.values.accountNumber = accountNumber;

        // Prompt the user for the transaction date
        return await stepContext.prompt(DATE_PROMPT, 'Please enter the transaction date in the format YYYY-MM-DD');
    }

    async amountStep(stepContext) {
        // Get the transaction date entered by the user
        const transactionDate = stepContext.result;

        // Save the transaction date in the dialog state for future steps
        stepContext.values.transactionDate = transactionDate;

        // Prompt the user for the amount
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter the amount');
    }

    async performOutwardTransferStep(stepContext) {
        // Get the amount entered by the user
        const amount = stepContext.result;

        // Retrieve the account number, transaction date, and amount from the dialog state
        const accountNumber = stepContext.values.accountNumber;
        const transactionDate = stepContext.values.transactionDate;

        // Perform API call with the inputted account number, transaction date, and amount using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/fip/outward-transfer-status`;
        const requestData = {
            AccountNumber: accountNumber,
            TransactionDate: transactionDate,
            Amount: amount
        };
        const response = await performOutwardTransferApiCall(apiUrl, requestData);
        if (response.transactionDetails !== null) {
            // Handle API success response
            // 'response' here will be the status text received from the API response

            const transactionsTable = this.renderTransactions(response.transactionDetails);
            const adaptiveCard = CardFactory.adaptiveCard(transactionsTable);

            await stepContext.context.sendActivity({ attachments: [adaptiveCard] });
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }

    renderTransactions(transactions) {
        const facts = [];
        const tableRows = transactions.map((transaction) => {
            for (const transactionKey in transaction) {
                facts.push({
                    title: transactionKey,
                    value: transaction[transactionKey]
                });
            }
        });

        const adaptiveCard = {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.0',
            body: [
                {
                    type: 'TextBlock',
                    text: 'Transaction Details:',
                    size: 'medium',
                    weight: 'bolder'
                },
                {
                    type: 'TextBlock',
                    text: 'Here is the table:',
                    size: 'medium',
                    wrap: true
                },
                {
                    type: 'Container',
                    items: [
                        {
                            type: 'FactSet',
                            facts: facts
                        }
                    ]
                }
                // ...tableRows
            ]
        };

        return adaptiveCard;
    }
}

module.exports.OutwardTransferDialog = OutwardTransferDialog;
