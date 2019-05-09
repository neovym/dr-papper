import React, { ChangeEvent, FormEvent } from "react";
import { compose } from "recompose";

import { withFirebase } from "../../Firebase";

interface ISignUpForm {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  error: null;
}

const SignUpFormInit: ISignUpForm = {
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
  error: null
}

class SignUpFormBase extends React.Component<
  any,
  ISignUpForm> {
  constructor(props: any) {
    super(props)
    this.state = {
      ...SignUpFormInit
    }
  }

  private validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  onSignUpFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    this.setState((current) => ({
      ...current,
      [target.name]: target.value
    }));
  }

  onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const {username, email, password} = this.state
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then((authUser: firebase.User) => {
        return this.props.firebase
          .user(authUser.uid)
          .set({
            username,
            email,
          });
      })
      .then((authUser: firebase.User) => {
        this.setState({
          ...SignUpFormInit
        })
      })
      .catch((error: any) => {
        if (error !== undefined) {
          alert(error.message)
        }
        this.setState({
          error
        })
      });
    event.preventDefault();
  }

  render() {
    const validateForm = () => {
      const {
        username,
        email,
        password,
        passwordConfirm
      } = this.state;
      return username !== "" &&
        this.validateEmail(email) &&
        password !== "" &&
        password === passwordConfirm
    }
    return (
      <div className="sign-up">
        <form onSubmit={this.onSubmit}>
          <input
            name="username"
            type="text"
            onChange={this.onSignUpFormChange}
            placeholder="Username"
          />
          <input
            name="email"
            type="text"
            onChange={this.onSignUpFormChange}
            placeholder="Your Email"
          />
          <input
            name="password"
            type="text"
            onChange={this.onSignUpFormChange}
            placeholder="Your Password"
          />
          <input
            name="passwordConfirm"
            type="text"
            onChange={this.onSignUpFormChange}
            placeholder="Your Password Again"
          />
          <button type="submit" disabled={!validateForm()}>Sign In</button>
        </form>
      </div>
    )
  }
}

const SignUpForm = compose(
  withFirebase
)(SignUpFormBase);

export default SignUpForm;