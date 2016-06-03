import _ from 'lodash';
import http from 'https';
import url from 'url';
// import sizeOf from 'image-size';
import ApiDataInstance from './ApiDataInstance';
import { ENTITY } from './CONSTANT';

function composeImageSet(imageObj = {}) {
  let resizedTargets = _.merge({}, _.get(imageObj, [ 'resizedTargets' ], {}));
  resizedTargets.original = {
    url: imageObj.url,
    width: imageObj.width,
    height: imageObj.height
  }
  resizedTargets.id = imageObj.id;
  resizedTargets.description = imageObj.description;

  return resizedTargets;
}

const processor = {
    convertBlock(entityMap, block) {
        let alignment = 'center';
        let content;
        let entityRange = block.entityRanges[0];
        const entity = entityMap[entityRange.key];
        const type = entity && entity.type;
        switch (type) {
            case ENTITY.infobox.type:
                alignment = entity.data && entity.data.alignment || alignment;
                content = [ {
                    title: entity.data.title,
                    body: entity.data.body
                }];
                break;
            case ENTITY.embeddedCode.type:
                alignment = entity.data && entity.data.alignment || alignment;
                content = [ {
                    caption: entity.data.caption,
                    embeddedCode: entity.data.embeddedCode
                }];
                break;
            case ENTITY.slideshow.type:
            case ENTITY.imageDiff.type:
                alignment = entity.data && entity.data.alignment || alignment;
                content = this.convertImagesBlock(entity);
                break;
            case ENTITY.image.type:
                alignment = entity.data && entity.data.alignment || alignment;
                content = [this.convertImageBlock(entity)];
                break;
            default:
                return;
        }
        return new ApiDataInstance({alignment, type, content})
    },

    convertImageBlock(entity) {
        let image = entity.data || {};
        return composeImageSet(image)
    },

    convertImagesBlock(entity) {
        let images = Array.isArray(entity.data.images) ? entity.data.images : [];
        return this._convertImagesBlock(images);
    },

    _convertImagesBlock(images) {
        return images.map((image) => {
            return composeImageSet(image);
        });
    }
};

export default processor;