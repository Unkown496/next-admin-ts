import type { FeatureType } from 'adminjs';

export enum MetadataFeature {
  ResourceField = 'resource:field',
}

export type FeatureCallback = () => FeatureType;
