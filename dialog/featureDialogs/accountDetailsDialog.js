const fs = require('fs');
const path = require('path');
const { TextPrompt, WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const { performAccountDetailsApiCall } = require('../../api/api.js');
// error showing here try and fix
const TEXT_PROMPT = 'textPrompt';
const ACCOUNT_DETAILS_DIALOG = 'accountStatusDialog';

class AccountDetailsDialog extends ComponentDialog {
    constructor(dialogID) {
        super(dialogID || ACCOUNT_DETAILS_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(ACCOUNT_DETAILS_DIALOG, [
                this.accountNumberStep.bind(this),
                this.performAccountDetailsStep.bind(this)
            ]));

        this.initialDialogId = ACCOUNT_DETAILS_DIALOG;
    }

    async accountNumberStep(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, 'Please enter your account number to know your account details');
    }

    async performAccountDetailsStep(stepContext) {
        const accountNumber = stepContext.result;

        // Perform API call with the inputted account number and requestId using api.js
        const apiUrl = `${ API_BASE_URL }/api/bank/dac/account/get-account-details`;
        const requestData = { AccountNumber: accountNumber };
        const response = await performAccountDetailsApiCall(apiUrl, requestData);

        if (response.responseMessage === 'Successful') {
            // Handle API success response
            // 'response' here will be the status text received from the API response
            const accountDetailsCard = this.createAdaptiveCard(response);
            const lastNTransactionsCard = this.createLastNTransactionsCard(response.lastNTransactions);

            // Send both adaptive cards in a single turn
            await stepContext.context.sendActivities([
                { type: 'message', attachments: [CardFactory.adaptiveCard(accountDetailsCard)] },
                { type: 'message', attachments: [CardFactory.adaptiveCard(lastNTransactionsCard)] }
            ]);
        } else {
            // Handle API error response
            await stepContext.context.sendActivity('Sorry, we encountered an error while processing your request. Please try again later.');
        }

        // End the dialog and return to the main menu prompt
        return await stepContext.endDialog();
    }

    createAdaptiveCard(data) {
        const cardJsonPath = path.join(__dirname, '../../jsonRepository/accountDetailsCard.json');
        const adaptiveCardTemplate = JSON.parse(fs.readFileSync(cardJsonPath, 'utf8'));

        // Replace placeholders in the template with data
        const placeholders = {
            customerId: data.customerId,
            accountNumber: data.accountNumber,
            accountName: data.accountName,
            accountType: data.accountType,
            productCode: data.productCode,
            product: data.product,
            accountStatus: data.accountStatus,
            currencyCode: data.currencyCode,
            branchCode: data.branchCode,
            branch: data.branch,
            bookBalance: data.bookBalance,
            availableBalance: data.availableBalance,
            lienAmount: data.lienAmount,
            unclearedBalance: data.unclearedBalance,
            mobileNo: data.mobileNo,
            email: data.email
            // lastNTransactions: this.renderTransactions(data.lastNTransactions) // Call the renderTransactions function
        };

        const processedCardJson = JSON.stringify(adaptiveCardTemplate).replace(
            /\${([^{}]+)}/g,
            (match, capture) => placeholders[capture.trim()]
        );

        return JSON.parse(processedCardJson);
    }

    createLastNTransactionsCard(lastNTransactions) {
        const lastNTransactionsCard = {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.3',
            body: [
                {
                    type: 'TextBlock',
                    text: 'Last N Transactions:',
                    size: 'medium',
                    weight: 'bolder'
                },
                {
                    type: 'ColumnSet',
                    columns: [
                        { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: 'Amount', weight: 'bolder' }] },
                        { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: 'Type', weight: 'bolder' }] },
                        { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: 'Currency', weight: 'bolder' }] },
                        { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: 'Transaction Date', weight: 'bolder' }] },
                        { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: 'Remarks', weight: 'bolder' }] }
                    ]
                },
                // Render the last N transactions
                ...this.renderTransactions(lastNTransactions)
            ]
        };

        return lastNTransactionsCard;
    }

    renderTransactions(lastNTransactions) {
        // Function to render the last N transactions as a list
        return lastNTransactions.map((transaction) => {
            return {
                type: 'ColumnSet',
                columns: [
                    { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: `${ transaction.amount }`, wrap: true }] },
                    { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: `${ transaction.transactionType }`, wrap: true }] },
                    { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: `${ transaction.currency }`, wrap: true }] },
                    { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: `${ new Date(transaction.transactionDate).toDateString() }`, wrap: true }] },
                    { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: `${ transaction.remarks }`, wrap: true }] }
                ]
            };
        });
    }
}

module.exports.AccountDetailsDialog = AccountDetailsDialog;
