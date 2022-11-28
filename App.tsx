import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from '@appfolio/react-gears';
import MobXForm from './components/MobXForm';
import GradualRHFMobx from './components/GraudualRHFMobx';

export default function NewUser() {
  return (
    <React.Fragment>
      <MobXForm/>
      <GradualRHFMobx />
    </React.Fragment>
  );
}
