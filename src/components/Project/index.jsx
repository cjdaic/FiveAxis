import React, { Component } from 'react'
import { Tree, Card } from 'antd'
import './index.css'
import { connect } from 'react-redux'
import { setCurrentObj } from '../../redux/actions/ActionApp'
class Project extends Component {
  treeFormat = (root) => {
    if (root === null || root === undefined) return []
    return ([{
      title: root.name,
      key: root.id,
      children: root.children.map((node) => {
        return this.treeFormat(node)[0]
      })
    }])
  }
  getSceneKey = (root) => {
    if (root === null || root === undefined) return []
    return [root.id]
  }
  handleSelect = (key) => {
    this.props.setCurrentObj(this.props.scene.getObjectById(Number(key)))
  }
  render() {
    return (
      <div className='project'>
        <Card size='small' title='Project' className='project-card'>
          <Tree
            expandedKeys={this.getSceneKey(this.props.scene)}
            treeData={this.treeFormat(this.props.scene)}
            onSelect={this.handleSelect}
            selectedKeys={(this.props.currentObj !== null && this.props.currentObj !== undefined) ? [this.props.currentObj.id] : []}
          />
        </Card>
      </div>

    )
  }
}
export default connect(
  state => ({
    scene: state.app.scene,
    currentObj: state.app.currentObj,
  }),
  {
    setCurrentObj
  }
)(Project)