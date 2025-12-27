/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: adplacements
 * Interface for AdPlacements
 */
export interface AdPlacements {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  placementName?: string;
  /** @wixFieldType text */
  placementType?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  creativeDimensions?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType image */
  exampleImage?: string;
}


/**
 * Collection ID: retailers
 * Interface for Retailers
 */
export interface Retailers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  retailerName?: string;
  /** @wixFieldType image */
  retailerLogo?: string;
  /** @wixFieldType url */
  websiteUrl?: string;
  /** @wixFieldType text */
  industryCategory?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
}
