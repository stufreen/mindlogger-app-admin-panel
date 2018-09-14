import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Prompt } from 'react-router-dom';
import {
  Button,
  Tab, Tabs,
  Modal
} from "react-bootstrap";

import { getItems, getObject, addItem, updateItem, updateFolder, getObjectsById } from "../../../../actions/api";
import { setActChanged } from "../../../../actions/core";
import ActSetting from "./ActSetting";
import Bookmarks from './Bookmarks';
import Screen from './Screen';
import AddObjectForm from '../AddObjectForm';

class EditAct extends Component {

  state = {
    settings: {},
    screens: [],
    screensData: [],
  }

  loadAllScreens() {
    const {getObjectsById, actId} = this.props;
    getObjectsById('item', 'screens', {folderId: actId});
  }

  updateScreen(index, screen) {
    let screensData = [...this.state.screensData];
    screensData[index] = { name: screen.name, ...screen.meta, id: screen._id};
    this.setState({index, screensData}, () => {
      this.formRef.reset();
    });
  }

  loadScreen(index, screens) {
    let {screensData} = this.state;
    const {screenHash} = this.props;
    if (!screens) {
      screens = this.state.screens;
    }
    const {getObject} = this.props;
    if (screens && screens[index]) {
      if (screensData[index] === undefined) {
        const id = screens[index]['@id'].split("/")[1];
        console.log("loading..", id);
        if (screenHash[id]) {
          this.updateScreen(index, screenHash[id]);
        }
        getObject(`item/${id}`).then(res => {
          this.updateScreen(index, res);
        })
      } else {
        this.setState({index}, () => {
          this.formRef.reset();
        });
      }
    }
  }

  addScreen = () => {
    let {screens} = this.state;
    if (screens && screens.length > 0) {
      let formErrors = this.formRef.submit();
      if (formErrors) {
        return;
      }
    } else {
      screens = [];
    }
    this.setState({open: 'add'});
    
    // const {volume, addItem} = this.props;
    // addItem('item', 'screen',{}, volume._id, 'collection').then(res => {

    // });
  }

  selectScreen = (index) => {
    if (this.state.index === undefined ) {
      this.loadScreen(index);
    } else {
      let formErrors = this.formRef.submit();
      if (formErrors === undefined) {
        this.loadScreen(index);
      } else {
        window.alert("Please fix valdiation errors");
      }
    }
    
  }

  onSaveScreen = (body) => {
    const {index,screensData} = this.state;
    screensData[index] = {...body};
    this.setState({screensData});
  }
  componentWillMount() {
    const {actId, getObject} = this.props;
    getObject(`folder/${actId}`).then(act => {
      this.decodeData(act);
    });
    this.loadAllScreens();
  }

  componentDidMount() {
    const {setActChanged} = this.props;
    setActChanged(true);
  }

  componentWillUnmount() {
    this.props.setActChanged(false);
  }

  decodeData(act) {
    const {name} = act;
    const {screens, ...setting} = act.meta || {};
    this.setState({setting: {name, ...setting}, screens });
    this.loadScreen(0, screens);
  }

  close = e => {
    this.setState({ form: "" });
  };

  onSetting = (setting) => {
    this.setState({setting});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  onSubmit = () => {
    const {setActChanged, updateItem, act, updateFolder, history} = this.props;
    let prArray = [];
    let formErrors = this.formRef.submit();
    if (formErrors) {
      window.alert("Please fix valdiation errors in screens");
      return;
    }
    formErrors = this.settingRef.submit();
    if (formErrors) {
      window.alert("Please fix valdiation errors in settings");
      return;
    }
    const {screens, screensData} = this.state;
    for (let i = 0; i < screens.length; i++) {
      if(screensData[i] === undefined)
        continue;
      const {name, id, ...screen} = screensData[i];
      prArray.push(updateItem(id, name, screen));
    }
    return Promise.all(prArray).then(() => {
      const {name, ...setting} = this.state.setting;
      this.setState({screens});
      return updateFolder(act._id, name, {screens, ...setting});
    }).then(() => {
      setActChanged(false);
      history.push('/acts');
    });
  }

  handleAddScreen = ({name}) => {
    const {addItem, act, updateFolder} = this.props;
    let {screens, screensData} = this.state;
    addItem(name, {}, act._id).then(res => {
      screens.push({'@id': `item/${res._id}`});
      screensData.push({name, id:res._id});
      const {name: actName, ...setting} = this.state.setting;
      return updateFolder(act._id, actName, {screens, ...setting});
    }).then(res => {
      this.setState({screens, screensData});
      this.handleClose();
    });
    
  }

  renderAddScreenDialog() {
    return (<Modal show={this.state.open === 'add'} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add screen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddObjectForm onSubmit={this.handleAddScreen} />
      </Modal.Body>
    </Modal>)
  }

  render() {
    const {screensData, index, setting, screens} = this.state;
    let screen = screensData[index];
    return (
      <section className="edit-act">
        <Prompt when={this.props.changed} message={location => 'Are you sure you want to leave this page?'} />
        <Tabs id="edit-act-tabs"  defaultActiveKey={1}>
          <Tab eventKey={1} title="Settings">
            <ActSetting setting={setting} onSetting={this.onSetting} onFormRef={ref => this.settingRef = ref }/>
          </Tab>
          <Tab eventKey={2} title="Screens">
            <div className="screens">
              <Bookmarks screens={screens} index={index} onSelect={this.selectScreen} onAdd={this.addScreen}/>
              <Screen index={index} screen={screen} onFormRef={ref => (this.formRef = ref)} onSaveScreen={this.onSaveScreen}/>
            </div>
          </Tab>
          <Button bsStyle="primary" className="save-btn" onClick={this.onSubmit}>Submit</Button>
        </Tabs>
        { this.renderAddScreenDialog() }
      </section>
    );
  }
}
const mapDispatchToProps = {
  getItems,
  getObject,
  setActChanged,
  addItem,
  updateItem,
  updateFolder,
  getObjectsById,
};

const mapStateToProps = (state, ownProps) => ({
  act: state.entities.data && state.entities.data[ownProps.match.params.id],
  actId: ownProps.match.params.id,
  changed: state.entities.actChanged,
  actIndex: ownProps.match.params.id,
  user: state.entities.auth || {},
  volume: state.entities.volume,
  screenHash: state.entities.screens || {},
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(EditAct);
