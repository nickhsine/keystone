'use strict';

import { AlignedInfoBox } from 'react-article-components'
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin';
import InfoBoxEditingBlock from './info-box-editing-block';
import React from 'react';

export default class InfoBoxBlock extends AtomicBlockRendererMixin(React.Component) {
  constructor(props) {
    super(props);
    this.handleEditingBlockChange  = this._handleEditingBlockChange.bind(this);
  }

  _handleEditingBlockChange(value) {
      this.onValueChange(value);
      this.toggleEditMode();
  }

  render() {
      if (!this.state.data) {
          return null;
      }

      let blockContent = _.get(this.state.data, [ 'content', 0 ], {});
      let title = blockContent.title;
      let body = blockContent.body;
      let draftRawObj = blockContent.draftRawObj;
      const EditBlock = (
          <InfoBoxEditingBlock
              body={body}
              draftRawObj={draftRawObj}
              label='infobox'
              isModalOpen={this.state.editMode}
              title={title}
              onToggle={this.handleEditingBlockChange}
              toggleModal={this.toggleEditMode}
          />
      );

      return (
          <div
              contentEditable={false}
              onClick={this.toggleEditMode}
              style={{ cursor: 'pointer' }}
              >
              <AlignedInfoBox
                  {...this.state.data}
                  >
                  {this.props.children}
              </AlignedInfoBox>
              {EditBlock}
          </div>
      );
  }
};
