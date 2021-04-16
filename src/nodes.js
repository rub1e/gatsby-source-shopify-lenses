import createNodeHelpers from "gatsby-node-helpers";
import { map } from "p-iteration";
import { createRemoteFileNode } from "gatsby-source-filesystem";

import {
  PRODUCT,
  PRODUCT_OPTION,
  PRODUCT_VARIANT,
  PRODUCT_METAFIELD,
  PRODUCT_VARIANT_METAFIELD,
} from "./constants";

const { createNodeFactory, generateNodeId } = createNodeHelpers({
  typePrefix: TYPE_PREFIX,
});

const downloadImageAndCreateFileNode = async (
  { url, nodeId },
  {
    createNode,
    createNodeId,
    touchNode,
    store,
    cache,
    getCache,
    getNode,
    reporter,
    downloadImages,
  }
) => {
  if (!downloadImages) return undefined;

  const mediaDataCacheKey = `${TYPE_PREFIX}__Media__${url}`;
  const cacheMediaData = await cache.get(mediaDataCacheKey);

  if (cacheMediaData) {
    const fileNodeID = cacheMediaData.fileNodeID;
    touchNode(getNode(fileNodeID));
    return fileNodeID;
  }

  const fileNode = await createRemoteFileNode({
    url,
    store,
    cache,
    createNode,
    createNodeId,
    getCache,
    parentNodeId: nodeId,
    reporter,
  });

  if (fileNode) {
    const fileNodeID = fileNode.id;
    await cache.set(mediaDataCacheKey, { fileNodeID });
    return fileNodeID;
  }

  return undefined;
};

export const ProductNode = (imageArgs) =>
  createNodeFactory(PRODUCT, async (node) => {
    if (node.variants) {
      const variants = node.variants.edges.map((edge) => edge.node);

      node.variants___NODE = variants.map((variant) =>
        generateNodeId(PRODUCT_VARIANT, variant.id)
      );

      delete node.variants;
    }

    if (node.metafields) {
      const metafields = node.metafields.edges.map((edge) => edge.node);

      node.metafields___NODE = metafields.map((metafield) =>
        generateNodeId(PRODUCT_METAFIELD, metafield.id)
      );
      delete node.metafields;
    }

    if (node.options) {
      node.options___NODE = node.options.map((option) =>
        generateNodeId(PRODUCT_OPTION, option.id)
      );
      delete node.options;
    }

    if (node.images && node.images.edges)
      node.images = await map(node.images.edges, async (edge) => {
        edge.node.localFile___NODE = await downloadImageAndCreateFileNode(
          {
            id: edge.node.id,
            url: edge.node.originalSrc,
          },
          imageArgs
        );
        return edge.node;
      });

    return node;
  });

export const ProductMetafieldNode = (_imageArgs) =>
  createNodeFactory(PRODUCT_METAFIELD);

export const ProductOptionNode = (_imageArgs) =>
  createNodeFactory(PRODUCT_OPTION);

export const ProductVariantNode = (imageArgs, productNode) =>
  createNodeFactory(PRODUCT_VARIANT, async (node) => {
    if (node.metafields) {
      const metafields = node.metafields.edges.map((edge) => edge.node);

      node.metafields___NODE = metafields.map((metafield) =>
        generateNodeId(PRODUCT_VARIANT_METAFIELD, metafield.id)
      );
      delete node.metafields;
    }

    if (node.image)
      node.image.localFile___NODE = await downloadImageAndCreateFileNode(
        {
          id: node.image.id,
          url: node.image.originalSrc,
        },
        imageArgs
      );

    if (!isNaN(node.price)) {
      node.priceNumber = parseFloat(node.price);
    }

    node.product___NODE = productNode.id;
    return node;
  });

export const ProductVariantMetafieldNode = (_imageArgs) =>
  createNodeFactory(PRODUCT_VARIANT_METAFIELD);
