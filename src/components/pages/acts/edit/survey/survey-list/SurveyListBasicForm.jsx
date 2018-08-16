import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import {InputRow, InputTextField, InputRadioField} from '../../../../../forms/Material';
import InputFileField from '../../../../../forms/InputFileField';
import PadBlock from '../../../../../layout/PadBlock';
import validate from './validate';

class SurvyeListBasicForm extends Component {
  renderOptions() {
    let options = [];
    const {options_count} = this.props.body;
    for(let i=0; i < options_count ; i++) {
      options.push((
        <Grid container key={i+1} alignItems="baseline">
          <Grid item sm={2}>
            Option {i+1}:
          </Grid>
          <Grid item>
            <InputRow>
              <Field name={`options[${i}].type`} label="Text" component={InputRadioField} select="text" />
              <Field name={`options[${i}].text`} component={InputTextField} type="text" placeholder="Text"/>
              
            </InputRow>
            
            <InputRow>
              <Field name={`options[${i}].type`} label="File" component={InputRadioField} select="file" />
              <Field name={`options[${i}].file`} component={InputFileField} />
            </InputRow>
          </Grid>
        </Grid>
      ))
    }
    return options;
  }

  renderAdvanceScreen() {
    let items = [];
    const {options_count} = this.props.body;
    for(let i=0; i < options_count ; i++) {
      items.push((
        <InputRow key={i+1}>
          <Grid item xs={6}>
            Option {i+1}:
          </Grid>
          <PadBlock>
            <Field name={`options[${i}].screen`} component={InputTextField} type="number" placeholder={`${i+2}`}/>
          </PadBlock>
        </InputRow>
      ))
    }
    return (<div>
      <p>Optionaly set screen to advance to, depending on which option is selected (default is next screen)</p>
      <Grid container alignItems="baseline">
        <Grid item xs={6}>
          If select
        </Grid>
        <Grid item xs={6}>
          Go to Screen #:
        </Grid>
      </Grid>
      {items}
    </div>);
  }
  render() {
    const {handleSubmit, submitting, body:{options_max_count}, previousPage} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          Enter text or upload pictures for the 2 response options
          { this.renderOptions() }
          { options_max_count === '1' && this.renderAdvanceScreen()}
          <div className="wizard-footer">
            <Button variant="contained" onClick={previousPage}>Back</Button>
            <Button variant="contained" color="primary" type="submit" disabled={submitting}>Submit</Button>
          </div>
        </div>
      </form>
    );
  }
}
export default reduxForm({
  // a unique name for the form
  form: 'survey-list-form',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(SurvyeListBasicForm);