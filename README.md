# Campus Exchange

A verified marketplace for the UML community. Buy, sell, and trade safely with fellow students.

## Local Execution Not Possible

The application **cannot** run locally without extensive Firebase/google configuration.

### Why Local Doesn't Work

To run this application locally you would need:

1. **Firebase/google Project Access** - You must be added as a user to our Firebase project and google Ai API(gmail account for both)
2. **Firebase/Google Configuration** - `.env` file with API keys (excluded for security)(the old keys we did in testing doesn't work(previous commits))
3. **Firebase rules** - Will need to adjust rules to asyc between databases with multiple people using it
4. **Firebase/google pay** - Will need to add your debit or credit card. Even though the Admin has it on file if someone else mess-up they will take the blame for using it incorrectly firebase/google api will both need it.
4. **Security Rules** - Firestore security rules must be configured
5. **Google AI API** - API key for AI features (excluded for security)
6. **Service Account** - Admin SDK credentials for certain features
7. **Init and Install** - Would need to download firebase and google API Init on your personal computer and add the firebase/google project to it
8. **Other** - Would need to setup a zoom with you because as a Admin I(Tennessee) will see everything. If I add you will see something different on your end in the console of firebase and google API.

This process takes a very long time of configurations setups rules and installs and requires 
access to our specific Firebase/Google project

### How to View the Application

**The production version is live and fully functional:**

🔗 **[https://campus-exchange-d47f4.web.app/]** 

No setup required 
just click the link

### If You Still Need to Run Locally 

If the grading for some reason requires local execution, please email me at:
**[Tennessee_Foster@student.uml.edu]**

We will:
1. Add your email to our Firebase/google project
2. Provide the `.env` file with credentials
3. Schedule a time to help with setup

*Note: This process requires 1-3 days of configuration installs setup and Init to run it locally.*

- TennaThePhantom: Tennessee
- Kenshi584: Derek 
- diyachauhan: Diya
- adamohanian-max: Adam
- DS123838: Daniyal
