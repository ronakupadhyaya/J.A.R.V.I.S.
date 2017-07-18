const messageConfirmation = (confirmation, cancellation) => ({
    "text": "Is this correct?",
    "type": "message",
    "attachments": [
        {
            "text": "Is this correct?",
            "fallback": "Correct details?",
            "callback_id": "meeting_confirmation",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "yes",
                    "text": "Yes",
                    "type": "button",
                    "value": confirmation
                },
                {
                    "name": "no",
                    "text": "No",
                    "type": "button",
                    "value": cancellation
                }
            ]
        }
    ]
});

export { messageConfirmation };