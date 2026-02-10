export default function NlmtDefinitionsMasterValidation(values, isTouched) {
  const errors = {}

  //definitions validation rule
  if (isTouched.definition && !values.definition) {
    errors.definition = 'required'
  } else if (isTouched.definition && !/^[a-zA-Z0-9 ]+$/.test(values.definition)) {
    errors.definition = 'Definitions only have Letters and space'
  }

  return errors
}
