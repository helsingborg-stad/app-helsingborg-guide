// @flow

const defaultState: QuizState = {
  latestQuestionId: "",
  selectedDialogChoiceIds: []
};

export default function quizReducer(
  state: QuizState = defaultState,
  action: Action
): QuizState {
  switch (action.type) {
    case "SET_LATEST_QUESTION_ID":
      return {
        ...state,
        latestQuestionId: action.latestQuestionId
      };
    case "SELECT_DIALOG_CHOICE":
      return {
        ...state,
        selectedDialogChoiceIds: [
          ...state.selectedDialogChoiceIds,
          action.dialogChoice
        ]
      };
    case "RESET_DIALOG_CHOICES":
      return {
        ...state,
        selectedDialogChoiceIds: []
      };
    default:
      return state;
  }
}
