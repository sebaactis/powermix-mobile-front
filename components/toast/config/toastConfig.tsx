import React from 'react';
import { ToastConfig } from 'react-native-toast-message';
import { AppToast } from '../AppToast';


export const toastConfig: ToastConfig = {
  appSuccess: (props) => (
    <AppToast
      variant="success"
      text1={props.text1}
      text2={props.text2}
    />
  ),
  appError: (props) => (
    <AppToast
      variant="error"
      text1={props.text1}
      text2={props.text2}
    />
  ),
  appWarning: (props) => (
    <AppToast
      variant="warning"
      text1={props.text1}
      text2={props.text2}
    />
  ),
};
