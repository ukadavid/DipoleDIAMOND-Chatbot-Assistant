// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const util = require('util');
const delay = util.promisify(setTimeout);

class EmptyBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} mainDialog
     */
    constructor(conversationState, userState, mainDialog) {
        super(conversationState, userState, mainDialog);

        this.conversationState = conversationState;
        this.userState = userState;
        this.mainDialog = mainDialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await this.sendGreetingMessage(context);
                    await delay(2000);

                    await mainDialog.run(context, conversationState.createProperty('DialogState'));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');

            // Run the Dialog with the new message Activity.
            await this.mainDialog.run(context, this.dialogState);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async sendGreetingMessage(context) {
        const welcomeMessage = 'Hi and welcome to dipoleDIAMOND CC Assistant.';
        await context.sendActivity(welcomeMessage);
    }
}

module.exports.EmptyBot = EmptyBot;
