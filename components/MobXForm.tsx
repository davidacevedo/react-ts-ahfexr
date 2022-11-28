/**
 * MobX Form is a Form with 2 inputs which are both handled by MobX state management.
 * 1. Form state will be handled by the MobX store `FormStore`
 * 2. Each input will have a validation of needing at least 1 character, but first name
 * will also have the requirement of not being longer than 5 characters.
 * 3. The form will submit the form data as a JSON object, which is depicted by console.log
 * 
 * The goal is to move this to use `react-hook-form` (RHF)
 */ 
// 
import * as React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormRow,
  Form,
} from '@appfolio/react-gears';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react'

interface FormState {
  firstName: string;
  lastName: string;
}

interface FormStateError {
  firstName: false | string;
  lastName: false | string;
}

class FormStore {
  formState: FormState = {
    firstName: '',
    lastName: ''
  }

  formErrorState: FormStateError = {
    firstName: false,
    lastName: false,
  }
  
  constructor() {
    makeAutoObservable(this);
  }

  setFirstName = (name: string) => {
    this.formState.firstName = name;
  }

  setLastName = (name: string) => {
    this.formState.lastName = name;
  }

  triggerFirstNameValidation = () => {
    if (this.formState.firstName.length === 0) {
      this.formErrorState.firstName = 'first name invalid';
      return;
    }

    if (this.formState.firstName.length > 5) {
      this.formErrorState.firstName = 'firstName must be less than 5 characters';
      return;
    }

    this.formErrorState.firstName = false;
  }

  triggerLastNameValidation = () => {
    this.formErrorState.lastName = this.formState.lastName.length > 0
      ? false
      : 'last name invalid';
  }

  submit = () => {
    // Don't submit if something is invalid
    if (this.formErrorState.firstName || this.formErrorState.lastName) return false;

    console.log(`Submitting ${this.formState}`)
  }
}

// Initializing store for use in the component. We will ignore props and context
// for the sake of a simpler example
const formStore = new FormStore();

const MobXForm = observer(() => {
  const {
    formState,
    formErrorState,
    setFirstName,
    setLastName,
    triggerFirstNameValidation,
    triggerLastNameValidation,
  } = formStore;
  const { firstName, lastName } = formState;
  
  const onSubmit = () => {
    formStore.submit();

  };

  return (
    <div>
      <Card className="mb-3">
        <CardHeader>
          <CardTitle>MobXForm</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={onSubmit}>
            <FormRow
              label="First name"
              name="first"
              onChange={(e) => setFirstName(e.target.value)}
              feedback={formErrorState.firstName}
              onBlur={triggerFirstNameValidation}
              value={firstName}
            />
            <FormRow
              label="Last name"
              name="last"
              onChange={(e) => setLastName(e.target.value)}
              feedback={formErrorState.lastName}
              onBlur={triggerLastNameValidation}
              value={lastName}
            />
            <Button color="primary" type="submit">Submit</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
})

export default MobXForm;
