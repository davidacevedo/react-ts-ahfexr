/**
 * MobX Form is a Form with 2 inputs which are both handled by MobX state management.
 * 1. Form state will be handled by the MobX store `FormStore`
 * 2. Each input will have a validation of needing at least 1 character, but first name
 * will also have the requirement of not being longer than 5 characters.
 * 3. The form will submit the form data as a JSON object, which is depicted by console.log
 * 
 * The goal is to move this to use `react-hook-form` (RHF)
 */ 
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
import { useForm, UseFormRegisterReturn } from 'react-hook-form';

// Wondering what refToInnerRef is? Check out https://backstage.qa.appfolio.com/docs/default/resource/front-end-all/react-hook-form/react-hook-form-caveats-with-react-gears/#react-hook-form-and-ref
const refToInnerRef = ({ ref, ...rest }: UseFormRegisterReturn) => ({ ...rest, innerRef: ref });

interface MobXFormState {
  lastName: string;
};

interface RHFFormState {
  firstName: string;
};
 
interface MobXFormStateError {
  lastName: false | string;
}

class FormStore {
  formState: MobXFormState = {
    lastName: ''
  }

  formErrorState: MobXFormStateError = {
    lastName: false,
  }
  
  constructor() {
    makeAutoObservable(this);
  }

  setLastName = (name: string) => {
    this.formState.lastName = name;
  }

  triggerLastNameValidation = () => {
    this.formErrorState.lastName = this.formState.lastName.length > 0
      ? false
      : 'last name invalid';
  }

  submit = (data: RHFFormState) => {
    // Don't submit if something is invalid
    if (this.formErrorState.lastName) return false;

    const submitData = { ...this.formState, ...data };
    console.log(`Submitting ${submitData}`)
  }
}

// Initializing store for use in the component. We will ignore props and context
// for the sake of a simpler example
const formStore = new FormStore();

const GradualRHFMobx = observer(() => {
  const { register, formState: { errors }, handleSubmit } = useForm<RHFFormState>({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  const {
    formState,
    formErrorState,
    setLastName,
    triggerLastNameValidation,
  } = formStore;
  const { lastName } = formState;
  
  // onSubmit for RHF values isn't called if form is invalid
  const onSubmit = (data: RHFFormState) => {
    formStore.submit(data);

  };

  return (
    <div>
      <Card className="mb-3">
        <CardHeader>
          <CardTitle>Gradual Migration to react-hook-form (RHF)</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow
              label="First name"
              {...refToInnerRef(register('firstName', {
                required: 'first name invalid',
                maxLength: {
                  value: 5,
                  message: 'firstName must be less than 5 characters or less'
                }
              }))}
              feedback={errors?.firstName?.message}
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

export default GradualRHFMobx;
