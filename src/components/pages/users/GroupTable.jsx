import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormControl, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import AddUser from './modal/AddUser';

import { updateObject } from '../../../actions/api';
import { setVolume } from '../../../actions/core';
import SelectUser from './modal/SelectUser';
import UsersTable from './UsersTable';

const userContain = (user, keyword) => 
  {
    return user && 
  (user.firstName.includes(keyword) || user.lastName.includes(keyword) || user.email.includes(keyword))
  }


class GroupTable extends Component {
  static propTypes = {
    group: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
  }
  state = {

  }
  onSearch = (e) => {
    let keyword = e.target.value;
    this.setState({keyword});
  }

  filterUsers() {
    const {keyword} = this.state;
    const {userIds, users} = this.props;
    if (keyword && keyword.length>0) {
      return userIds.filter(id => userContain(users[id], keyword) )
    } else {
      return userIds;
    }
  }

  showAddModal = () => {
    this.setState({form: 'add_user'});
  }

  showSelectModal = () => {
    this.setState({form: 'select_user'});
  }

  closeModal = () => {
    this.setState({form: false});
  }

  selectUser = (user) => {
    const {volume, updateObject, group, setVolume, onAddMember} = this.props;
    const meta = volume.meta;
    let members = (volume.meta && volume.meta.members) || {};
    let userIds = members[group] || [];
    if (!userIds.includes(user._id)) {
      userIds.push(user._id);
    }
    members[group] = [...userIds];
    meta.members = members;
    this.closeModal();
    return updateObject('folder', volume._id, volume.name, meta).then(res => {
      console.log(volume);
      setVolume({...volume});
      if (onAddMember)
        return onAddMember(user);
    });
  }

  render() {
    let {groupName, group, onSelect} = this.props;
    
    const userIds = this.filterUsers();
    
    return (
      <div>
        <div className="search-box">
        <Row>
          <Col sm={3}> Search {groupName}s: </Col>
          <Col sm={9}><FormControl type="name" placeholder="name or email" onChange={this.onSearch}/></Col>
        </Row>
        </div>
        {userIds && <UsersTable userIds={userIds} onSelect={onSelect}/> }
        <Button variant="contained" onClick={this.showAddModal}>Add {groupName}</Button>
        {" "}
        <Button variant="contained" onClick={this.showSelectModal}>Add Existing User</Button>
        <AddUser
          show={this.state.form === 'add_user'} onClose={this.closeModal}
          groupName={groupName} role={groupName.toLowerCase()}
          onAdd={this.selectUser}
          />
        <SelectUser show={this.state.form === 'select_user'} exclude={this.props.userIds} onClose={this.closeModal} onSelect={this.selectUser} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  volume: state.entities.volume,
  userIds: state.entities.volume.meta.members && state.entities.volume.meta.members[ownProps.group],
  users: state.entities.users,
})

const mapDispatchToProps = {
  updateObject,
  setVolume,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupTable)
