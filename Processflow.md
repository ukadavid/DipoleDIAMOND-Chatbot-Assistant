# Chatbot process flow

1. Bot is launched and displays a greeting message: "Hi and welcome to dipoleDIAMOND CC Assistant."

2. Bot prompts the user (contact centre agent) to enter their email address.

3. User enters their email address.

4. Bot prompts the user to enter their token code for authentication.

5. User enters the token code.

6. Bot validates the email and token code for authentication.

7. If the email and token code are valid:
   - Bot authenticates the user as an agent and proceeds to the main menu.
   - Bot displays the available actions/options for the contact centre agent (balance enquiry, check account BVN, confirm account lien, confirm account status, get transaction status, get account details, get customer details, fetch loan eligibility, send account statement).

8. If the email is not profiled (not in the profiling table):
   - Bot informs the user that the email is not recognized, and they cannot proceed.

9. If the token code is invalid:
   - Bot informs the user that the token code is incorrect and prompts them to enter a valid token code.

10. User re-enters the token code.

11. Bot validates the new token code.

12. Repeat steps 7-9 as necessary until a valid email and token code are provided.

13. Once authenticated, the contact centre agent can select an action from the main menu.

14. Bot processes the selected action and performs the necessary tasks (e.g., querying account balance, checking account BVN, confirming account lien, etc.).

15. Bot displays the results or provides the requested information to the contact centre agent.

16. The conversation continues as the contact centre agent interacts with the bot, selecting different actions or asking for further assistance.

17. Bot handles each selected action and responds accordingly.

18. The conversation ends when the contact centre agent finishes using the bot or explicitly ends the conversation.

19. Bot displays a farewell message: "Thank you for using dipoleDIAMOND CC Assistant. Goodbye."

20. Bot ends the conversation.

21. Bot is closed.

22. Bot is relaunched and the process repeats from step 1.
