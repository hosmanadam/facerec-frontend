const validateForm = (form) => {
  const regexes = {
    name: /^\w+$/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^\w+$/,
  };

  let formValidation = {
    isNameValid:
        (form.hasOwnProperty('name'))
        ? regexes.name.test(form.name)
        : true,
    isEmailValid:
        (form.hasOwnProperty('email'))
        ? regexes.email.test(form.email)
        : true,
    isPasswordValid:
        (form.hasOwnProperty('password'))
        ? regexes.password.test(form.password)
        : true,
  };

  let isFormValid = Object.values(formValidation).every(Boolean);

  let errorMessage = [
    !formValidation.isNameValid ? 'Invalid name' : null,
    !formValidation.isEmailValid ? 'Invalid email' : null,
    !formValidation.isPasswordValid ? 'Invalid password' : null,
  ].filter(Boolean).join('\n');

  let formValidationError = new Error(errorMessage);

  return {isFormValid, formValidationError}
};


export default validateForm;
