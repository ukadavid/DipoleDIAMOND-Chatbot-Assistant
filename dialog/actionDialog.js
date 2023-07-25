const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const { BalanceEnquiryDialog } = require('./featureDialogs/balanceEnquiryDialog.js');
const { BvnEnquiryDialog } = require('./featureDialogs/bvnEnquiryDialog.js');
const { LienEnquiryDialog } = require('./featureDialogs/lienEnquiryDialog.js');
const { AccountStatusDialog } = require('./featureDialogs/accountStatusDialog.js');
const { AccountDetailsDialog } = require('./featureDialogs/accountDetailsDialog.js');
const { TransactionEnquiryDialog } = require('./featureDialogs/transactionEnquiryDialog.js');
const { MobileEnquiryDialog } = require('./featureDialogs/mobileAccountDialog.js');
const { CustomerEnquiryDialog } = require('./featureDialogs/customerEnquiryDialog.js');
const { LoanEnquiryDialog } = require('./featureDialogs/loanEligibilityDialog.js');
const { StatementEnquiryDialog } = require('./featureDialogs/statementEnquiryDialog.js');
const { InwardTransferDialog } = require('./featureDialogs/inwardTransferStatusDialog.js');
const { OutwardTransferDialog } = require('./featureDialogs/outwardTransferDialog.js');
const { ChargeReversalEnquiryDialog } = require('./featureDialogs/chargeReversalDialog.js');
const { ValidateTokenDialog } = require('./featureDialogs/validateTokenDialog.js');

const BALANCE_ENQUIRY_DIALOG = 'balanceEnquiryDialog'; // Add the constant for the BalanceEnquiryDialog ID
const BVN_ENQUIRY_DIALOG = 'bvnEnquiryDialog';
const LIEN_ENQUIRY_DIALOG = 'lienEnquiryDialog';
const ACCOUNT_STATUS_DIALOG = 'accountStatusDialog';
const ACCOUNT_DETAILS_DIALOG = 'accountDetailsDialog';
const TRANSACTION_ENQUIRY_DIALOG = 'transactionEnquiryDialog';
const MOBILE_ENQUIRY_DIALOG = 'mobileEnquiryDialog';
const CUSTOMER_ENQUIRY_DIALOG = 'customerEnquiryDialog';
const LOAN_ENQUIRY_DIALOG = 'loanEnquiryDialog';
const STATEMENT_ENQUIRY_DIALOG = 'statementEnquiryDialog';
const INWARD_TRANSFER_DIALOG = 'inwardTransferDialog';
const OUTWARD_TRANSFER_DIALOG = 'outwardTransferDialog';
const CHARGE_REVERSAL_DIALOG = 'chargeReversalEnquiryDialog';
const VALIDATE_TOKEN_DIALOG = 'validateTokenDialog';

class ActionDialog extends ComponentDialog {
    constructor(dialogId) {
        super(dialogId);

        this.addDialog(new WaterfallDialog(dialogId, [ // Use 'dialogId' for the WaterfallDialog ID
            this.performActionStep.bind(this)
        ]));
        this.addDialog(new BalanceEnquiryDialog(BALANCE_ENQUIRY_DIALOG)); // Register the BalanceEnquiryDialog with its ID
        this.addDialog(new BvnEnquiryDialog(BVN_ENQUIRY_DIALOG));
        this.addDialog(new LienEnquiryDialog(LIEN_ENQUIRY_DIALOG));
        this.addDialog(new AccountStatusDialog(ACCOUNT_STATUS_DIALOG));
        this.addDialog(new AccountDetailsDialog(ACCOUNT_DETAILS_DIALOG));
        this.addDialog(new TransactionEnquiryDialog(TRANSACTION_ENQUIRY_DIALOG));
        this.addDialog(new MobileEnquiryDialog(MOBILE_ENQUIRY_DIALOG));
        this.addDialog(new CustomerEnquiryDialog(CUSTOMER_ENQUIRY_DIALOG));
        this.addDialog(new LoanEnquiryDialog(LOAN_ENQUIRY_DIALOG));
        this.addDialog(new StatementEnquiryDialog(STATEMENT_ENQUIRY_DIALOG));
        this.addDialog(new InwardTransferDialog(INWARD_TRANSFER_DIALOG));
        this.addDialog(new OutwardTransferDialog(OUTWARD_TRANSFER_DIALOG));
        this.addDialog(new ChargeReversalEnquiryDialog(CHARGE_REVERSAL_DIALOG));
        this.addDialog(new ValidateTokenDialog(VALIDATE_TOKEN_DIALOG));

        this.initialDialogId = dialogId; // Use 'dialogId' as the initialDialogId
    }

    async performActionStep(stepContext) {
        const selectedOption = stepContext.options.selectedOption;
        console.log(selectedOption);
        await stepContext.context.sendActivity(`Performing ${ selectedOption }...`);

        switch (`${ selectedOption }`) {
        case 'Balance Enquiry':
            return await stepContext.beginDialog('balanceEnquiryDialog');
        case 'BVN Enquiry':
            return await stepContext.beginDialog('bvnEnquiryDialog');
        case 'Lien Enquiry':
            return await stepContext.beginDialog('lienEnquiryDialog');
        case 'Account Status Enquiry':
            return await stepContext.beginDialog('accountStatusDialog');
        case 'Transaction Enquiry':
            return await stepContext.beginDialog('transactionEnquiryDialog');
        case 'Mobile Enquiry':
            return await stepContext.beginDialog('mobileEnquiryDialog');
        case 'Account Details Enquiry':
            return await stepContext.beginDialog('accountDetailsDialog');
        case 'Customer Enquiry':
            return await stepContext.beginDialog('customerEnquiryDialog');
        case 'Loan Enquiry':
            return await stepContext.beginDialog('loanEnquiryDialog');
        case 'Statement Enquiry':
            return await stepContext.beginDialog('statementEnquiryDialog');
        case 'Inward Transfer Status':
            return await stepContext.beginDialog('inwardTransferDialog');
        case 'Outward Transfer Status':
            return await stepContext.beginDialog('outwardTransferDialog');
        case 'Charge Reversal Enquiry':
            return await stepContext.beginDialog('chargeReversalDialog');
        case 'Validate Token':
            return await stepContext.beginDialog('validateTokenDialog');
        }

        // Return to the main menu prompt
        return await stepContext.endDialog();
    }
}

module.exports.ActionDialog = ActionDialog;
