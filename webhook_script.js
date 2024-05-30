/*
This function is an Installable Trigger, so you need to set it up
to run when a form is submitted.

In the Script Editor:
    1. Choose Edit > Current project's triggers. You see a panel with the message No triggers set up. Click here to add one now.
    2. Click the link.
    3. Under Run, select the function you want executed by the trigger - onSubmit()
    4. Under Events, select "From Form".
    5. From the next drop-down list, select "On form submit".
    6. Click Save.
*/

const POST_URL = "";

function onSubmit(e) {
    const form = FormApp.getActiveForm();
    const allResponses = form.getResponses();
    const latestResponse = allResponses[allResponses.length - 1];
    const response = latestResponse.getItemResponses();
    const payload = {};
    for (let i = 0; i < response.length; i++) {
        const question = response[i].getItem().getTitle();
        const answer = response[i].getResponse();
        payload[question] = answer;
    }

    const options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
    };

    console.log(JSON.stringify(options))
    UrlFetchApp.fetch(POST_URL, options);
}

