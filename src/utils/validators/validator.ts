import * as EmailValidator from 'email-validator';

export default class Validator {
  public IsEmailValid(email: string): boolean {
    return EmailValidator.validate(email);
  }
  public IsPhoneNumberValid(phoneNumber: string): boolean {
    const regex = new RegExp(
      // eslint-disable-next-line no-useless-escape
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{5,6}$/im
    );

    return regex.test(phoneNumber.toString());
  }
}
