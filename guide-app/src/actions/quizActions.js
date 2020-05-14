// @flow

export function setLatestQuestionIdAction(latestQuestionId: string): Action {
  return { type: "SET_LATEST_QUESTION_ID", latestQuestionId };
}

export function selectDialogChoiceAction(dialogChoice: DialogChoice): Action {
  return { type: "SELECT_DIALOG_CHOICE", dialogChoice };
}

export function resetDialogChoicesAction(): Action {
  return { type: "RESET_DIALOG_CHOICES" };
}
