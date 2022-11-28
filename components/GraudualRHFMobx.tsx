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
import { useForm } from 'react-hook-form';
import { refToInnerRef } from '../utils';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react'

interface FormFields {
  firstName: string;
  lastName: string;
}

export default function ValidationExamples({ submit }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });
  
  const onSubmit = (data: FormFields) => {
    submit(data)
  };

  return (
    <div>
      <Card className="mb-3">
        <CardHeader className="bg-info">
          <CardTitle>Form with Validations onBlur</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow
              label="First name"
              feedback={errors.firstName?.message}
              {...refToInnerRef(register('firstName', {
                required: 'first name needed',
                validate: {
                  custom1: (val) => val.length > 5 || 'not greater than 5'
                }
              }))}
            />
            <FormRow
              label="Last name"
              feedback={errors.lastName?.message}
              {...refToInnerRef(register('lastName', { required: 'last name needed'}))}
            />
            <Button color="primary" type="submit">Submit</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

// FormStore will be responsible for keeping track of form state, validating,
// and submitting after everything has been validated
class FormStore {
  firstName = '';
  lastName = '';
  isFirstNameError = false;
  isLastNameError = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFirstName = (name: string) => {
    this.firstName = name;
  }

  setLastName = (name: string) => {
    this.lastName = name;
  }

  triggerFirstNameValidation = () => {
    this.isFirstNameError = this.firstName.length > 0 ? false : true;
  }

  triggerLastNameValidation = () => {
    this.isLastNameError = this.lastName.length > 0 ? false : true;
  }

  get firstNameError() {
    return this.isFirstNameError ? 'first name invalid' : '';
  }

  get lastNameError() {
    return this.isLastNameError ? 'last name invalid' : '';
  }

  submit = () => {
    // Return early if something is not valid
    if (this.isFirstNameError || this.isLastNameError) return false;

    console.log(`Submitting ${this.firstName} and ${this.lastName}`)
  }
}

// Initializing store for use in the component. We will ignore props and context
// for the sake of a simpler example
const formStore = new FormStore();

export const OldFormValidationsExample = observer(() => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    triggerFirstNameValidation,
    triggerLastNameValidation,
    firstNameError,
    lastNameError,
  } = formStore;
  
  const onSubmit = () => {
    formStore.submit();

  };

  return (
    <div>
      <Card className="mb-3">
        <CardHeader className="bg-info">
          <CardTitle>Form with Validations onBlur</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={onSubmit}>
            <FormRow
              label="First name"
              name="first"
              onChange={(e) => setFirstName(e.target.value)}
              feedback={firstNameError}
              onBlur={triggerFirstNameValidation}
              value={firstName}
            />
            <FormRow
              label="Last name"
              name="last"
              onChange={(e) => setLastName(e.target.value)}
              feedback={lastNameError}
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
